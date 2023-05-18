import { ForbiddenException, Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
  secret: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private config: ConfigService,
  ) {
    this.secret = this.config.get('JWT_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }

  async signToken(secret: string, sub: number, expiresIn = '15m') {
    const payload = { sub };
    return this.jwt.signAsync(payload, {
      /** @see https://github.com/vercel/ms  */
      expiresIn,
      secret,
    });
  }

  async compare(password: string, passwordToCompare: string) {
    return await compare(password, passwordToCompare);
  }

  async registerUser(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.createUser(username, hashedPassword);
    //! use short expire time
    const expiresIn = '1y';
    const access_token = await this.signToken(this.secret, user.id, expiresIn);
    return { access_token, userId: user };
  }

  async loginUser(username: string, password: string) {
    const user = await this.userService.getUserForLogin(username);
    if (!user) throw new ForbiddenException('Invalid Credentials');

    const passwordIsMatching = await this.compare(password, user.password);
    if (!passwordIsMatching)
      throw new ForbiddenException('Invalid Credentials');

    //! use short expire time
    const expiresIn = '1y';
    const access_token = await this.signToken(this.secret, user.id, expiresIn);
    return { access_token, user };
  }
}
