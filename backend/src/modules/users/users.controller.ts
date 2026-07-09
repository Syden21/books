import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      email: createUserDto.email,
      passwordHash: createUserDto.password,
      name: createUserDto.name,
      contactPhone: createUserDto.contactPhone,
      role: createUserDto.role,
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/users')
  async getUsersAdmin(@Query() searchParams: SearchUserDto) {
    const users = await this.usersService.findAll(searchParams);
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get('manager/users')
  async getUsersManager(@Query() searchParams: SearchUserDto) {
    const users = await this.usersService.findAll(searchParams);
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }));
  }
}
