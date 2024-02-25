import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_Payment } from 'src/entities/payment-management/payment-deails.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { MailService } from 'src/mail/mail.service';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [TypeOrmModule.forFeature([E_Payment, E_OrderDetails]),
  TwilioModule.forRoot({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  }),],
  controllers: [PaymentController],
  providers: [PaymentService, MailService]
})
export class PaymentModule { }
