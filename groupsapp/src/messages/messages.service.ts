import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(content: string, sender: User, group: Group) {
    if (!content || content.trim() === '') {
      throw new BadRequestException('Message content cannot be empty');
    }

    const message = this.messagesRepository.create({
      content,
      sender,
      group,
    });

    return this.messagesRepository.save(message);
  }

  async findByGroup(groupId: string, limit = 50, offset = 0) {
    return this.messagesRepository.find({
      where: { group: { id: groupId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['sender', 'group'],
    });
  }

  async findById(id: string) {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'group'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(id: string, content: string, userId: string) {
    const message = await this.findById(id);

    // Verificar que solo el remitente pueda editar
    if (message.sender.id !== userId) {
      throw new BadRequestException('You can only edit your own messages');
    }

    if (!content || content.trim() === '') {
      throw new BadRequestException('Message content cannot be empty');
    }

    message.content = content;
    message.isEdited = true;

    return this.messagesRepository.save(message);
  }

  async delete(id: string, userId: string) {
    const message = await this.findById(id);

    // Verificar que solo el remitente pueda eliminar
    if (message.sender.id !== userId) {
      throw new BadRequestException('You can only delete your own messages');
    }

    return this.messagesRepository.remove(message);
  }

  async getGroupMessages(groupId: string, limit = 50, offset = 0) {
    const [messages, total] = await this.messagesRepository.findAndCount({
      where: { group: { id: groupId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['sender', 'group'],
    });

    return {
      messages,
      total,
      limit,
      offset,
    };
  }
}
