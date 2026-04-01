import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageStatus, MessageStatusEnum } from './entities/message-status.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessageStatusService {
  constructor(
    @InjectRepository(MessageStatus)
    private messageStatusRepository: Repository<MessageStatus>,
  ) {}

  async markAsRead(messageId: string, user: User) {
    let messageStatus = await this.messageStatusRepository.findOne({
      where: {
        message: { id: messageId },
        user: { id: user.id },
      },
    });

    if (!messageStatus) {
      throw new NotFoundException('Message or status not found');
    }

    messageStatus.status = MessageStatusEnum.READ;
    return this.messageStatusRepository.save(messageStatus);
  }

  async getMessageStatus(messageId: string) {
    return this.messageStatusRepository.find({
      where: { message: { id: messageId } },
      relations: ['user', 'message'],
    });
  }

  async createMessageStatus(messageId: any, users: User[]) {
    // Crear status para cada usuario del grupo
    const statuses = users.map((user) =>
      this.messageStatusRepository.create({
        message: { id: messageId },
        user,
        status: MessageStatusEnum.SENT,
      }),
    );

    return this.messageStatusRepository.save(statuses);
  }
}
