import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTitle } from './entities/payment-title.entity';
import { PaymentTitlesController } from './payment-titles.controller';
import { PaymentTitlesService } from './payment-titles.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTitle])],
  controllers: [PaymentTitlesController],
  providers: [PaymentTitlesService],
  exports: [PaymentTitlesService],
})
export class PaymentTitlesModule {}
