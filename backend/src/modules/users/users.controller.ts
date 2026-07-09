import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
    });

    // Убираем passwordHash из ответа
    const { passwordHash, ...result } = user;
    return result;
  }

  @Get('admin/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin(@Query() searchParams: SearchUserDto) {
    const users = await this.usersService.findAll(searchParams);
    return users.map(({ passwordHash, ...user }) => user);
  }

  @Get('manager/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  async findAllManager(@Query() searchParams: SearchUserDto) {
    const users = await this.usersService.findAll(searchParams);
    return users.map(({ passwordHash, ...user }) => user);
  }

  @Get('admin/users/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    const { passwordHash, ...result } = user;
    return result;
  }
}
