import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence, PresenceStatus } from './entities/presence.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private presenceRepository: Repository<Presence>,
  ) {}

  // Simular cambio de presencia - PLACEHOLDER para FASE 7
  async setUserPresence(user: User, status: PresenceStatus) {
    let presence = await this.presenceRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!presence) {
      presence = this.presenceRepository.create({
        user,
        status,
        lastSeen: new Date(),
      });
    } else {
      presence.status = status;
      if (status === PresenceStatus.OFFLINE) {
        presence.lastSeen = new Date();
      }
    }

    return this.presenceRepository.save(presence);
  }

  async getUserPresence(userId: string) {
    const presence = await this.presenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!presence) {
      throw new NotFoundException('User presence not found');
    }

    return {
      userId: presence.user.id,
      username: presence.user.username,
      status: presence.status,
      lastSeen: presence.lastSeen,
    };
  }

  async getAllPresence() {
    // Simular: obtener presencia de todos los usuarios
    const presences = await this.presenceRepository.find({
      relations: ['user'],
    });

    return presences.map((p) => ({
      userId: p.user.id,
      username: p.user.username,
      status: p.status,
      lastSeen: p.lastSeen,
    }));
  }
}
