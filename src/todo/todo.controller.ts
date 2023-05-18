import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Put, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { JwtPayload } from '@src/auth/jwt.strategy';
import * as Dto from './dto/todo.dto';
import { Todo } from './entities';
import { TodoService } from './todo.service';

@Controller('todo')
@ApiTags('todo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /*
   * Get list of todos
   */
  @Get()
  @ApiOperation({
    description: 'Returns list of todos',
    summary: 'Returns array of todos',
  })
  @ApiResponse({
    status: 200,
    description: 'returns array of todos',
    type: [Todo],
  })
  @ApiBadRequestResponse({ description: 'no description provided' })
  todoList(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  /*
   * Find Todo with ID
   */
  @Get(':todoId')
  @ApiOperation({
    description: 'find a Todo with its messages',
    summary: 'Find Todo with ID',
    deprecated: true,
  })
  @ApiResponse({
    status: 200,
    description: 'find a todo with its associated messages',
    type: Todo,
  })
  @ApiNotFoundResponse({ description: 'Todo is unavailable' })
  @ApiBadRequestResponse({ description: 'no description provided' })
  findTodoWithId(@Query() { id }: Dto.FindTodoWithId): Promise<Todo> {
    return this.todoService.findTodoWithId(id);
  }

  /*
   * Create a Todo
   */
  @Post()
  @ApiOperation({
    description: 'Creates a new Todo',
    summary: 'Creates a Todo',
  })
  @ApiResponse({
    status: 201,
    description: 'returns the created Todo',
    type: Todo,
  })
  @ApiBadRequestResponse({ description: 'no description provided' })
  createTodo(@Body() { text }: Dto.CreateTodoDto, @Request() req: any) {
    const userId = (req.user as JwtPayload).sub;
    return this.todoService.createTodo(text, userId);
  }

  /*
   * Toggle a Todo
   */
  @Put(':id')
  @ApiOperation({
    description: 'Toggles a Todo',
    summary: 'Toggles a Todo',
  })
  @ApiResponse({
    description: 'returns the Todo status',
    type: Todo,
  })
  @ApiBadRequestResponse({ description: 'no description provided' })
  toggleTodo(@Param() { id }: Dto.ToggleTodoDto, @Request() req: any) {
    const userId = (req.user as JwtPayload).sub;
    return this.todoService.toggleTodo(id, userId);
  }

  /*
   * Add a Message to a Todo
   */
  @Post(':todoId/addMessage')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    description:
      'adds a Message to a Todo and returns the Todo with its messages',
    summary: 'Add a Message to a Todo',
  })
  @ApiResponse({
    status: 200,
    description: 'returns a todo with its associated Messages',
    type: Todo,
  })
  @ApiNotFoundResponse({ description: 'Todo is unavailable' })
  @ApiOperation({
    description: 'Adds a Message to a Todo',
    summary: 'Add a Message to a Todo',
  })
  @ApiBadRequestResponse({ description: 'no description provided' })
  update(@Body() { id, text }: Dto.AddMessageDto) {
    return this.todoService.addMessageToTheTodo(id, text);
  }

  /*
   * Remove a Todo
   */
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Todo is unavailable' })
  @ApiOperation({
    description: 'Deletes a Todo with an ID',
    summary: 'delete Todo',
  })
  remove(@Param() { id }: Dto.RemoveTodoDto, @Request() req: any) {
    const userId = (req.user as JwtPayload).sub;
    return this.todoService.removeTodo(id, userId);
  }
}
