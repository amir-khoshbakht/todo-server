import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
    });
    try {
      await this.userRepository.save(user);
      return user;
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        // unique_violation https://www.postgresql.org/docs/current/errcodes-appendix.html
        throw new ConflictException('already taken');
      } else {
        // todo: log the error if needed
        throw new InternalServerErrorException('error in register');
      }
    }
  }

  async getUserForLogin(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      select: { id: true, password: true },
    });
  }
}
