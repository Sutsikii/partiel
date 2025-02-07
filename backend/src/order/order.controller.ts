import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Post()
  async create(@Body() body: { items: { productId: number; quantity: number }[] }): Promise<Order> {
    if (!body.items || !Array.isArray(body.items)) {
      throw new BadRequestException("La requête doit contenir un tableau `items`");
    }
    return this.orderService.createOrder(body.items);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Order> {
    return this.orderService.updateStatus(id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
