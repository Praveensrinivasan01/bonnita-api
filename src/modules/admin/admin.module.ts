import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_Admin } from 'src/entities/admin-management/admin.entity';
import { E_Token } from 'src/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_Coupon } from 'src/entities/order-management/coupon.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_WhyUs } from 'src/entities/why-us/why-us.entity';
import { E_User } from 'src/entities/users-management/users.entity';
import { MailService } from 'src/mail/mail.service';
import { E_NewsLetter } from 'src/entities/admin-management/newsletter.entity';
import { TwilioModule } from 'nestjs-twilio';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_UserCoupon } from 'src/entities/users-management/usercoupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([E_Admin, E_Token, E_ProductSubCategory, E_ProductCategory, E_Coupon, E_OrderDetails, E_WhyUs, E_User, E_NewsLetter, E_Product, E_UserCoupon]),
  JwtModule.register({
    secret: 'SecretKey',
    signOptions: {
      expiresIn: '1d'
    },
  }),
  PassportModule.register({
    defaultStrategy: 'jwt'
  }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, MailService]
})
export class AdminModule { }
