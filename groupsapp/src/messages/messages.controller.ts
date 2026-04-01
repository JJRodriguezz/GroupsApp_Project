import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  @Get('group/:groupId')
  async getGroupMessages(
    @Param('groupId') groupId: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.messagesService.getGroupMessages(
      groupId,
      Math.min(Number(limit), 100),
      Number(offset),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMessageDto) {
    const sender = await this.usersService.findById(dto.senderId);
    if (!sender) {
      throw new NotFoundException('User not found');
    }

    const group = await this.groupsService.findById(dto.groupId);

    return this.messagesService.create(dto.content, sender, group);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.update(id, dto.content, dto.senderId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Body() dto: any) {
    return this.messagesService.delete(id, dto.senderId);
  }
}
