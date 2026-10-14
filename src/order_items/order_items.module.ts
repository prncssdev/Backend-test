import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Order_itemsService } from './order_items.service';
import { Order_itemsController } from './order_items.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [Order_itemsController],
  providers: [Order_itemsService],
  exports: [Order_itemsService],
})
export class Order_itemsModule {}