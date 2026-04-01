import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  // Simular upload - PLACEHOLDER para FASE 6
  async uploadFile(filename: string, user: User, groupId?: string) {
    // En producción, aquí iría la lógica real de upload a S3/CDN
    const simulatedUrl = `https://media.groupsapp.local/files/${filename}`;

    const media = this.mediaRepository.create({
      filename,
      url: simulatedUrl,
      mimeType: 'application/octet-stream', // Simplificado
      size: Math.floor(Math.random() * 10000000), // Simulado
      uploadedBy: user,
      group: groupId ? ({ id: groupId } as any) : undefined,
    });

    return this.mediaRepository.save(media);
  }

  async getFile(id: string) {
    return this.mediaRepository.findOne({
      where: { id },
    });
  }

  async deleteFile(id: string, user: User) {
    const media = await this.getFile(id);
    
    if (!media || media.uploadedBy.id !== user.id) {
      throw new Error('Unauthorized');
    }
    
    return this.mediaRepository.remove(media);
  }
}
