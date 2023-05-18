import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  readonly todoSelect = {
    id: true,
    text: true,
    is_done: true,
    messages: {
      id: true,
      text: true,
    },
  };

  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private dataSource: DataSource,
  ) {}

  async createTodo(text: string, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({
      text,
      user_id: userId,
    });

    await this.todoRepository.save(todo);

    return this.todoRepository.findOne({
      where: { id: todo.id },
      relations: { messages: true },
      select: this.todoSelect,
    });
  }

  async toggleTodo(todoId: number, userId: number) {
    return this.todoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const todo = await transactionalEntityManager.findOne(Todo, {
          where: { id: todoId },
        });

        if (!todo) throw new NotFoundException();

        if (todo.user_id != userId) throw new UnauthorizedException();

        await transactionalEntityManager.update(
          Todo,
          { id: todoId },
          { is_done: () => 'NOT is_done' },
        );
      },
    );
  }

  async addMessageToTheTodo(todoId: number, messageText: string) {
    return this.todoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // const eee = await this.todoRepository.findOne({
        //   where: { id: todoId },
        //   lock: { mode: 'pessimistic_write' },
        // });

        // get the todo with pessimistic lock
        const todo = await transactionalEntityManager.findOne(Todo, {
          where: { id: todoId },
          lock: { mode: 'pessimistic_write' },
        });

        // save message
        const message = this.messageRepository.create({
          text: messageText,
          todo: todo,
        });
        await transactionalEntityManager.save(message);

        this.todoRepository.save(Todo);

        // get the todo with its messages
        return await transactionalEntityManager.findOne(Todo, {
          where: { id: todo.id },
          relations: { messages: true },
          select: this.todoSelect,
        });
      },
    );
  }

  async findAll(): Promise<Todo[]> {
    const a = await this.todoRepository.find({ where: { id: 1 } });
    console.log(a);

    return this.todoRepository.find({
      select: this.todoSelect,
      order: {
        id: { direction: 'ASC' },
      },
    });
  }

  findTodoWithId(todoId: number): Promise<Todo> {
    const todo = this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['messages'],
      select: this.todoSelect,
    });
    if (!todo) throw new NotFoundException();
    return todo;
  }

  async removeTodo(todoId: number, userId: number) {
    return this.todoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const todo = await transactionalEntityManager.findOne(Todo, {
          where: { id: todoId },
        });

        if (!todo) throw new NotFoundException();

        if (todo.user_id != userId) throw new UnauthorizedException();

        await transactionalEntityManager.delete(Todo, todo); // todo : add soft remove for Todo
      },
    );
  }
}
