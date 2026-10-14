import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { Order_itemsService } from './order_items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order_items')
export class Order_itemsController {
  constructor(private order_itemsService: Order_itemsService) {}

  // Get all order_itemss (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.order_itemsService.getAll();
  }

  // Get single order_items by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.order_itemsService.findById(+id);
  }

  // Create order_items (open - for demo)
  @Post()
  async create(@Body() body: { flower_name: string; price: number; category_id: number }) {
  return this.order_itemsService.create(body.flower_name, body.price, body.category_id);
  }

// Update order_items (protected)
@UseGuards(JwtAuthGuard)
@Put(':id')
async update(@Param('id') id: string, @Body() body: any) {
  return this.order_itemsService.update(+id, body);
}

// Delete order_items (protected)
@UseGuards(JwtAuthGuard)
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.order_itemsService.remove(+id);
}
}