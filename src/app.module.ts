import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { FlowersModule } from './flowers/flowers.module';
import { Order_itemsModule } from './order_items/order_items.module';
import { PaymentsModule } from './payments/payments.module';


@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CategoriesModule, FlowersModule , Order_itemsModule, PaymentsModule],
})

export class AppModule {}