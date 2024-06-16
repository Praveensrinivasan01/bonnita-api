import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { E_User } from 'src/entities/users-management/users.entity';
import { E_Token } from 'src/entities/token.entity';
import { E_UserAddress } from 'src/entities/users-management/user_address.entity';
import { E_UserPayment } from 'src/entities/users-management/user_payment.entity';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/mail/mail.service';
import { TwilioModule } from 'nestjs-twilio';
import { E_Otp } from 'src/entities/users-management/otp.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([E_User, E_Token, E_UserAddress, E_UserPayment, E_Otp]),
  JwtModule.register({
    secret: 'SecretKey',
    signOptions: {
      expiresIn: '1d'
    },
  }),
    ProductModule,
  PassportModule.register({
    defaultStrategy: 'jwt'
  }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService]
})
export class UsersModule { }
