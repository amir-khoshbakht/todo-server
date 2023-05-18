import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column('bigint')
  @ApiProperty()
  user_id: number;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  is_done: boolean;

  @Column()
  @ApiProperty()
  text: string;

  @OneToMany(() => Message, (message) => message.todo)
  @ApiProperty({ type: [Message] })
  messages?: Message[];
}
