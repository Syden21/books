import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { Request } from 'express';

@Controller('api')
@UseGuards(AuthenticatedGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post('client/rentals')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async createRental(
    @Req() req: Request,
    @Body() createRentalDto: CreateRentalDto,
  ) {
    const user = req.user as any;
    return this.rentalsService.createRental(user.id, createRentalDto);
  }

  @Get('client/rentals')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async getUserRentals(@Req() req: Request) {
    const user = req.user as any;
    return this.rentalsService.getUserRentals(user.id);
  }

  @Get('manager/rentals')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async getAllRentals() {
    return this.rentalsService.getAllRentals();
  }

  @Get('client/rentals/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async getRental(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as any;
    return this.rentalsService.getRentalById(id, user.id, user.role);
  }

  @Get('manager/rentals/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async getRentalManager(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.getRentalById(id, 0, 'admin');
  }

  @Patch('manager/rentals/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async updateRentalStatusManager(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalStatusDto: UpdateRentalStatusDto,
  ) {
    return this.rentalsService.updateRentalStatus(
      id,
      updateRentalStatusDto.status,
      0,
      'admin',
    );
  }

  @Patch('client/rentals/:id/cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async cancelRental(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user as any;
    return this.rentalsService.updateRentalStatus(
      id,
      'cancelled',
      user.id,
      user.role,
    );
  }
}
