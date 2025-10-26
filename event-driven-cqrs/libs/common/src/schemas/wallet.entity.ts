import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryColumn()
  accountId: string;

  @Column()
  currency: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? 0 : parseFloat(value)),
    },
  })
  balance: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  lastUpdated: Date;
}
