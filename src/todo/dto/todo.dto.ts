import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  Min,
  Max,
  IsNumber,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class General {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'the ID of the Todo' })
  id: number;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @ApiProperty({
    description: 'text of the Todo',
    default: 'text of the Todo',
  })
  text: string;
}
export class FindTodoWithId extends PickType(General, ['id'] as const) {}
export class CreateTodoDto extends PickType(General, ['text']) {}
export class ToggleTodoDto extends PickType(General, ['id']) {}
export class AddMessageDto extends PickType(General, ['id', 'text'] as const) {}
export class RemoveTodoDto extends PickType(General, ['id'] as const) {}
