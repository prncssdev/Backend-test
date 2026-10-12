import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FlowersController],
  providers: [FlowersService],
  exports: [FlowersService],
})
export class FlowersModule {}