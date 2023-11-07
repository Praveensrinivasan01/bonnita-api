import { Module } from '@nestjs/common';
import { LandingpageController } from './landingpage.controller';
import { LandingpageService } from './landingpage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_Query } from 'src/entities/users-management/query.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([E_Product, E_ProductImage, E_Image, E_ProductFavourites, E_ProductCategory, E_ProductSubCategory, E_ProductCartItem, E_ProductReview, E_OrderDetails, E_Query])],
  controllers: [LandingpageController],
  providers: [LandingpageService]
})
export class LandingpageModule { }
