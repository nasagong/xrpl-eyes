import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('dapps')
@Index(['name', 'contract_address'], { unique: true })
export class Dapp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contract_address: string;
} 