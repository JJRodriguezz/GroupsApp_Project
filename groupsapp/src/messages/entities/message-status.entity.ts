import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';

export enum MessageStatusEnum {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

@Entity('message_status')
export class MessageStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE', eager: true })
  message: Message;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'enum', enum: MessageStatusEnum, default: MessageStatusEnum.SENT })
  status: MessageStatusEnum;

  @CreateDateColumn()
  createdAt: Date;
}
