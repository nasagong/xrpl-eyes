import { Client } from 'xrpl';
import { Service, Transaction, TransactionAnalysis, UAWAnalysis } from './types';

export class TransactionAnalyzer {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  private rippleTimeToDate(rippleTime: number): Date {
    const RIPPLE_EPOCH_DIFF = 946684800; // 2000-01-01 00:00:00 UTC
    return new Date((rippleTime + RIPPLE_EPOCH_DIFF) * 1000);
  }

  private getTimeRange() {
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 59, 59, 999);
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 0, 0, 0);
    return { startTime, endTime };
  }

  private async getTransactionsForAddress(address: string): Promise<any[]> {
    const { startTime, endTime } = this.getTimeRange();
    
    let allTransactions: any[] = [];
    let marker: string | undefined;
    
    while (true) {
      const response = await this.client.request({
        command: 'account_tx',
        account: address,
        limit: 20,
        marker: marker
      });

      const transactions = response.result.transactions;
      if (!transactions || transactions.length === 0) break;

      // 이전 시간 정각보다 오래된 트랜잭션이 나오면 중단
      const oldTransactionIndex = transactions.findIndex((tx: any) => {
        const txDate = this.rippleTimeToDate(tx.tx.date);
        return txDate < startTime;
      });

      if (oldTransactionIndex === -1) {
        // 모든 트랜잭션이 시간 범위 내
        allTransactions.push(...transactions);
      } else {
        // 시간 범위 내 트랜잭션만 추가
        allTransactions.push(...transactions.slice(0, oldTransactionIndex));
        break;
      }

      // 다음 페이지 마커가 없으면 종료
      marker = response.result.marker as string | undefined;
      if (!marker) break;
    }

    // 종료 시간 이후의 트랜잭션 필터링
    return allTransactions.filter(tx => {
      const txDate = this.rippleTimeToDate(tx.tx.date);
      return txDate <= endTime;
    });
  }

  private formatTransaction(tx: any): Transaction {
    return {
      time: this.rippleTimeToDate(tx.tx.date).toISOString(),
      type: tx.tx.TransactionType,
      sender: tx.tx.Account,
      receiver: tx.tx.Destination,
      amount: tx.tx.Amount,
      hash: tx.tx.hash
    };
  }

  async analyzeService(service: Service): Promise<{ transactionAnalysis: TransactionAnalysis; uawAnalysis: UAWAnalysis }> {
    const { startTime, endTime } = this.getTimeRange();
    const allTransactions: any[] = [];
    const uniqueWallets = new Set<string>();

    for (const address of service.addresses) {
      const transactions = await this.getTransactionsForAddress(address);
      allTransactions.push(...transactions);
    }

    // 발신자만 UAW로 계산
    allTransactions.forEach(tx => {
      uniqueWallets.add(tx.tx.Account);
    });

    const transactionAnalysis: TransactionAnalysis = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalTransactions: allTransactions.length,
      uawCount: uniqueWallets.size,
      transactions: allTransactions.map(tx => this.formatTransaction(tx))
    };

    const uawAnalysis: UAWAnalysis = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalTransactions: allTransactions.length,
      uawCount: uniqueWallets.size,
      uniqueWallets: Array.from(uniqueWallets)
    };

    return { transactionAnalysis, uawAnalysis };
  }
} 