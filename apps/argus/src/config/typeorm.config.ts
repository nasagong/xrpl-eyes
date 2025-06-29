import { DataSource } from 'typeorm';
import { UAWRecord } from '../entities/uaw-record.entity';
import { Dapp } from '../entities/dapp.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [UAWRecord, Dapp],
  subscribers: [],
  migrations: [],
}); 