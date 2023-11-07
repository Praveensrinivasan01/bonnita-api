import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_ProductDiscount } from 'src/entities/product-management/discount.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
@Module({
  imports: [TypeOrmModule.forFeature([E_Product, E_ProductImage, E_Image, E_ProductFavourites, E_ProductDiscount, E_ProductCategory, E_ProductSubCategory, E_ProductCartItem, E_ProductReview]),
  MulterModule.register({ storage })
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
