import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PresenceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  DND = 'dnd', // Do Not Disturb
}

@Entity('presence')
export class Presence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: PresenceStatus, default: PresenceStatus.OFFLINE })
  status: PresenceStatus;

  @Column({ nullable: true })
  lastSeen: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
