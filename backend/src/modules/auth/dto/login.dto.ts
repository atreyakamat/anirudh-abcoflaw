import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Password' })
  @IsString()
  @MinLength(4)
  password: string;
}