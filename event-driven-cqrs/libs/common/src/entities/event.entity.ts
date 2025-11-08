import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { EventType } from '../enums/event-type.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
