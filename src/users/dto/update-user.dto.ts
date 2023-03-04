import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsUrl, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(2, 30)
  username?: string;

  @Length(2, 200)
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @Length(3, 10)
  password?: string;
}
