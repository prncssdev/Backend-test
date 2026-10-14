import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Get all orderss (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.ordersService.getAll();
  }

  // Get single orders by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.ordersService.findById(+id);
  }

  // Create orders (open - for demo)
  @Post()
  async create(@Body() body: { flower_name: string; price: number; category_id: number }) {
  return this.ordersService.create(body.flower_name, body.price, body.category_id);
  }

// Update orders (protected)
@UseGuards(JwtAuthGuard)
@Put(':id')
async update(@Param('id') id: string, @Body() body: any) {
  return this.ordersService.update(+id, body);
}

// Delete orders (protected)
@UseGuards(JwtAuthGuard)
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.ordersService.remove(+id);
}
}