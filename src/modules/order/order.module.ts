import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductDiscount } from 'src/entities/product-management/discount.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_OrderItem } from 'src/entities/order-management/order-item.entity';
import { E_User } from 'src/entities/users-management/users.entity';
import { MailService } from 'src/mail/mail.service';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { E_RAISE_REQUEST } from 'src/entities/order-management/raise-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([E_Product, E_ProductImage, E_Image, E_ProductFavourites, E_ProductDiscount, E_ProductCategory, E_ProductSubCategory, E_ProductCartItem, E_ProductReview, E_OrderDetails, E_OrderItem, E_User, E_RAISE_REQUEST]),
  TwilioModule.forRoot({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  }),
  ],
  controllers: [OrderController],
  providers: [OrderService, MailService]
})
export class OrderModule { }
