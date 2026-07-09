import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('api/client')
export class RentalsController {
  constructor(private rentalsService: RentalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post('rentals')
  async createRental(@Request() req, @Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create({
      ...createRentalDto,
      userId: req.user._id,
    });
  }
}
