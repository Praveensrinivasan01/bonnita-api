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

@Module({
  imports: [TypeOrmModule.forFeature([E_Admin, E_Token, E_ProductSubCategory, E_ProductCategory]),
  JwtModule.register({
    secret: 'SecretKey',
    signOptions: {
      expiresIn: '1d'
    },
  }),
  PassportModule.register({
    defaultStrategy: 'jwt'
  })
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
