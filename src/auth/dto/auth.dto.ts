import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class utilityTypes {}

export class RegisterDto {
  /* username */
  // data validation
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  // swagger
  @ApiProperty({
    default: 'username',
    description: 'username',
  })
  // data transform -- in order to change incoming key name
  @Expose({ name: 'username' })
  'username': string;

  /* Password */
  // data validation
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  // swagger
  @ApiProperty({
    default: 'secret',
    description: 'password',
  })
  'password': string;
}

export class LoginDto {
  /* username */
  // data validation
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  // swagger
  @ApiProperty({
    default: 'username',
    description: 'username',
  })
  'username': string;

  /* Password */
  // data validation
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  // swagger
  @ApiProperty({
    default: 'secret',
    description: 'password',
  })
  'password': string;
}
