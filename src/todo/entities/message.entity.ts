import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  text: string;

  @ManyToOne(() => Todo, (todo) => todo.messages, { nullable: false })
  todo: Todo;
}
