import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Product } from './products/product.entity';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';

import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

import { User } from './user/user.entity';
import { AuthModule } from './user/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const options: DataSourceOptions = {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Product, Order, OrderItem, User], // ✅ Ajout de User
          synchronize: true, 
        };
        return options;
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Database options are undefined');
        }
        console.log('📡 Initialisation de la connexion à la base de données avec les options:', options);
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        console.log('✅ Connexion à la base de données réussie !');
        return dataSource;
      },
    }),
    TypeOrmModule.forFeature([Product, Order, OrderItem, User]),
    AuthModule,
  ],
  controllers: [ProductController, OrderController],
  providers: [ProductService, OrderService],
})
export class AppModule {}
