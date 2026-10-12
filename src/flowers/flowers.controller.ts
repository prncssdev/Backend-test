import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('flowers')
export class FlowersController {
  constructor(private flowersService: FlowersService) {}

  // Get all flowerss (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.flowersService.getAll();
  }

  // Get single flowers by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.flowersService.findById(+id);
  }

  // Create flowers (open - for demo)
  @Post()
  async create(@Body() body: { flower_name: string; price: number; category_id: number }) {
  return this.flowersService.create(body.flower_name, body.price, body.category_id);
  }

// Update flowers (protected)
@UseGuards(JwtAuthGuard)
@Put(':id')
async update(@Param('id') id: string, @Body() body: any) {
  return this.flowersService.update(+id, body);
}

// Delete flowers (protected)
@UseGuards(JwtAuthGuard)
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.flowersService.remove(+id);
}
}