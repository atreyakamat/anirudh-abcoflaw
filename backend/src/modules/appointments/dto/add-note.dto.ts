import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  content: string;
}