import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto.name, dto.description);
  }

  @Get()
  async findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.groupsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto.name, dto.description);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.groupsService.delete(id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }

  @Post(':groupId/members/:userId')
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupsService.addMember(groupId, { id: userId } as any);
  }

  @Delete(':groupId/members/:userId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupsService.removeMember(groupId, userId);
  }
}
