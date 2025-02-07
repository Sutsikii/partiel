import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🔒 Route protégée : accessible uniquement aux utilisateurs authentifiés
  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // 🔒 Route protégée : accessible uniquement aux utilisateurs authentifiés
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  // 🔒 Route protégée : accessible uniquement aux ADMIN
  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  // 🔒 Route protégée : accessible uniquement aux ADMIN
  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() productData: Partial<Product>): Promise<Product> {
    return this.productService.update(id, productData);
  }

  // 🔒 Route protégée : accessible uniquement aux ADMIN
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
