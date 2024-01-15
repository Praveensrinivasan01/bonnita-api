import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configuration/database.configuration';
import { ProductModule } from './modules/product/product.module';
import { LandingpageModule } from './modules/landingpage/landingpage.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentController } from './modules/payment/payment.controller';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig), UsersModule, AdminModule, ProductModule, LandingpageModule, OrderModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
