import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
