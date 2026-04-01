import { IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  filename: string;

  @IsString()
  userId: string;

  @IsString()
  groupId?: string;
}
