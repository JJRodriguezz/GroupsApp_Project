import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  @IsUUID()
  senderId: string;
}
