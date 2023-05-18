import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as Dto from './dto/auth.dto';
import { UserService } from '@src/user/user.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* Register */
  @Post('register')
  @ApiOperation({
    description: 'register a new user',
    summary: 'register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'returns JWT token',
    schema: {
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIyMjIsImlhdCI6MTY3NDgyNzczN30.jorAHF_94bz2fMj8e8skIv1bdebV2w4XoKQypCyZmfA',
    },
  })
  @ApiConflictResponse({ description: 'already exists' }) // @HttpCode(400)
  async register(@Body() { username, password }: Dto.RegisterDto) {
    const { access_token } = await this.authService.registerUser(
      username,
      password,
    );
    return { access_token };
  }

  /* Login
   */
  @Post('login')
  @ApiOperation({ description: 'Login user', summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'returns the jwt token',
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() { username, password }: Dto.LoginDto) {
    const { access_token } = await this.authService.loginUser(
      username,
      password,
    );
    return { access_token };
  }
}
