import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  url: string;

  @Column()
  mimeType: string;

  @Column('bigint')
  size: number;

  @ManyToOne(() => User, { eager: true })
  uploadedBy: User;

  @ManyToOne(() => Group, { nullable: true })
  group: Group;

  @CreateDateColumn()
  createdAt: Date;
}
