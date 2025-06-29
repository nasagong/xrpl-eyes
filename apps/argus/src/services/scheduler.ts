import { Client } from 'xrpl';
import cron from 'node-cron';
import { Service } from './types';
import { TransactionAnalyzer } from './transaction-analyzer';
import { AppDataSource } from '../config/typeorm.config';
import { UAWRecord } from '../entities/uaw-record.entity';
import { Dapp } from '../entities/dapp.entity';

export class UAWScheduler {
  private client: Client;
  private analyzer: TransactionAnalyzer;
  private isInitialized: boolean = false;

  constructor() {
    this.client = new Client('wss://s1.ripple.com');
    this.analyzer = new TransactionAnalyzer(this.client);
  }

  private async loadServicesFromDatabase(): Promise<Service[]> {
    const dappRepository = AppDataSource.getRepository(Dapp);
    const dapps = await dappRepository.find();
    
    const serviceMap = new Map<string, string[]>();
    
    for (const dapp of dapps) {
      if (!serviceMap.has(dapp.name)) {
        serviceMap.set(dapp.name, []);
      }
      serviceMap.get(dapp.name)!.push(dapp.contract_address);
    }
    
    const services: Service[] = Array.from(serviceMap.entries()).map(([name, addresses]) => ({
      name,
      addresses
    }));
    
    return services;
  }

  private async waitForDatabase(maxRetries = 5, delay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await AppDataSource.initialize();
        console.log('DB 연결 성공');
        return true;
      } catch (error) {
        console.log(`DB 연결 시도 ${i + 1}/${maxRetries} 실패. ${delay/1000}초 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('데이터베이스 연결 실패');
  }

  private async analyzeAllServices(startTime: Date, endTime: Date) {
    const services = await this.loadServicesFromDatabase();
    const collectionStartTime = startTime;
    console.log('\n=== UAW 분석 시작 ===');
    console.log('수집 시작 시간:', collectionStartTime.toLocaleString());

    for (const service of services) {
      console.log(`\n=== ${service.name} ===`);
      const { transactionAnalysis, uawAnalysis } = await this.analyzer.analyzeService(service);
      
      console.log('조회 시작 시간:', transactionAnalysis.startTime);
      console.log('조회 종료 시간:', transactionAnalysis.endTime);
      console.log('총 트랜잭션 수:', transactionAnalysis.totalTransactions);
      console.log('UAW 수:', uawAnalysis.uawCount);

      const uawRecord = new UAWRecord();
      uawRecord.serviceName = service.name;
      uawRecord.uawCount = uawAnalysis.uawCount;
      uawRecord.totalTransactions = transactionAnalysis.totalTransactions;
      uawRecord.collectionStartTime = collectionStartTime;
      
      await AppDataSource.manager.save(uawRecord);
    }

    console.log('\n=== UAW 분석 완료 ===');
    console.log('종료 시간:', new Date().toLocaleString());
  }

  public async initialize() {
    if (this.isInitialized) {
      console.log('스케줄러가 이미 초기화되어 있습니다.');
      return;
    }

    await this.waitForDatabase();

    await this.client.connect();
    console.log('XRPL 클라이언트 연결됨');

    // 초기데이터) 이전 1시간만 분석 후 DB에 올림
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 59, 59, 999);
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 0, 0, 0);
    await this.analyzeAllServices(startTime, endTime);
    console.log('초기 1시간 데이터 적재 완료');
    this.isInitialized = true;

    // 매 정각 동일한 작업 반복 (1시간 단위 DB 적재재)
    cron.schedule('0 * * * *', async () => {
      const now = new Date();
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 59, 59, 999);
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 0, 0, 0);
      await this.analyzeAllServices(startTime, endTime);
    });
  }

  public async shutdown() {
    await this.client.disconnect();
    
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
} 