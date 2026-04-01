import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private groupMembersRepository: Repository<GroupMember>,
  ) {}

  async create(name: string, description?: string) {
    const group = this.groupsRepository.create({
      name,
      description,
    });
    return this.groupsRepository.save(group);
  }

  async findAll() {
    return this.groupsRepository.find();
  }

  async findById(id: string) {
    const group = await this.groupsRepository.findOne({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(id: string, name?: string, description?: string) {
    const group = await this.findById(id);
    if (name) group.name = name;
    if (description) group.description = description;
    return this.groupsRepository.save(group);
  }

  async delete(id: string) {
    const group = await this.findById(id);
    return this.groupsRepository.remove(group);
  }

  async addMember(groupId: string, user: User) {
    const group = await this.findById(groupId);
    
    // Verificar si el usuario ya está en el grupo
    const existingMember = await this.groupMembersRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: user.id },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    const groupMember = this.groupMembersRepository.create({
      group,
      user,
    });

    return this.groupMembersRepository.save(groupMember);
  }

  async removeMember(groupId: string, userId: string) {
    const member = await this.groupMembersRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }

    return this.groupMembersRepository.remove(member);
  }

  async getMembers(groupId: string) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group.members;
  }
}
