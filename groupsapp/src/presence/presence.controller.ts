import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceStatus } from './entities/presence.entity';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Get(':userId')
  async getUserPresence(@Param('userId') userId: string) {
    return this.presenceService.getUserPresence(userId);
  }

  @Get()
  async getAllPresence() {
    return this.presenceService.getAllPresence();
  }

  @Post(':userId/status')
  @HttpCode(HttpStatus.OK)
  async setUserPresence(
    @Param('userId') userId: string,
    @Body() body: { status: PresenceStatus },
  ) {
    // En producción, validaría que el user solo puede cambiar su propio status
    return this.presenceService.setUserPresence({ id: userId } as any, body.status);
  }
}
