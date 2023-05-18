import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo, Message } from './entities';
import { TodoController } from './todo.controller';

@Module({
  controllers: [TodoController],
  imports: [TypeOrmModule.forFeature([Todo, Message])],
  providers: [TodoService],
})
export class TodoModule {}
