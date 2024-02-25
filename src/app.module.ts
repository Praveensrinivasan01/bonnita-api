import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configuration/database.configuration';
import { ProductModule } from './modules/product/product.module';
import { LandingpageModule } from './modules/landingpage/landingpage.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentController } from './modules/payment/payment.controller';
import { PaymentModule } from './modules/payment/payment.module';
import { TwilioModule, TwilioService } from 'nestjs-twilio';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig), UsersModule, AdminModule, ProductModule, LandingpageModule, OrderModule, PaymentModule,
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
