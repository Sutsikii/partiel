import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async createOrder(items: { productId: number; quantity: number }[]): Promise<Order> {
    console.log("📦 Commande reçue:", items); 
  
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException("La commande doit contenir au moins un produit.");
    }
  
    const order = new Order();
    order.items = [];
  
    for (const item of items) {
      console.log("➡️ Traitement de l'article:", item);
  
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Produit avec l'ID ${item.productId} non trouvé.`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuffisant pour le produit ${product.name}`);
      }
  
      product.stock -= item.quantity;
      await this.productRepository.save(product);
  
      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      order.items.push(orderItem);
    }
  
    const newOrder = await this.orderRepository.save(order);
    await this.orderItemRepository.save(order.items);
  
    console.log("✅ Commande enregistrée avec succès:", newOrder);
    return newOrder;
  }
  

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.product'] });
  }

  async updateStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Commande avec ID ${orderId} non trouvée`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async deleteOrder(orderId: number): Promise<void> {
    const result = await this.orderRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Commande avec ID ${orderId} non trouvée`);
    }
  }
}
