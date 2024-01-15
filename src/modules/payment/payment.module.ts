import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_Payment } from 'src/entities/payment-management/payment-deails.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([E_Payment, E_OrderDetails]),],
  controllers: [PaymentController],
  providers: [PaymentService, MailService]
})
export class PaymentModule { }
