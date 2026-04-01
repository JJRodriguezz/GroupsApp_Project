import { Controller, Post, Get, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async uploadMedia(@Body() dto: UploadMediaDto) {
    // En producción, usaría @UseGuards(JwtGuard) y extraería userId del JWT
    return this.mediaService.uploadFile(dto.filename, { id: dto.userId } as any, dto.groupId);
  }

  @Get(':id')
  async getMediaFile(@Param('id') id: string) {
    return this.mediaService.getFile(id);
  }

  @Delete(':id')
  async deleteMediaFile(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.mediaService.deleteFile(id, { id: body.userId } as any);
  }
}
