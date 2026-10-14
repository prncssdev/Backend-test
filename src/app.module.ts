import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { FlowersModule } from './flowers/flowers.module';
//import { Order_items } from './order_items/order_items.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CategoriesModule, FlowersModule /*, Order_items*/],
})

export class AppModule {}