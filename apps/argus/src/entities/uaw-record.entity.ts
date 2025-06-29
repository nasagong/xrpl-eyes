import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('uaw_records')
export class UAWRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'uaw_count' })
  uawCount: number;

  @Column({ name: 'total_transactions' })
  totalTransactions: number;

  @Column({ type: 'timestamp', name: 'collection_start_time' })
  collectionStartTime: Date;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
} 