import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Order_itemsService } from './order_items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order_items')
export class Order_itemsController {
  constructor(private order_itemsService: Order_itemsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.order_itemsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.order_itemsService.findById(+id);
  }

  @Post()
  async create(@Body() body: { order_id: number; flower_id: number; quantity: number }) {
    return this.order_itemsService.create(body.order_id, body.flower_id, body.quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.order_itemsService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.order_itemsService.remove(+id);
  }
}
