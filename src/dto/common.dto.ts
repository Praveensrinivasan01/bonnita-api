import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { ENUM_ORDER_STATUS, ENUM_UserStatus } from "src/enum/common.enum";

export class SignupUserDto {

    @ApiProperty({
        description: 'User First Name',
        example: 'john',
    })
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiProperty({
        description: 'User Last Name',
        example: 'doe',
    })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({
        description: 'User Phone Number',
        example: '+13240981234',
    })
    @IsNotEmpty()
    @IsString()
    mobile: string;

    @ApiProperty({
        description: 'User Email',
        example: 'johndoe@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User Role',
        example: 'user',
    })
    @IsNotEmpty()
    @IsString()
    role: string;

    @ApiProperty({
        description: 'User Password',
        example: 'Admin@123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginUserDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'User Email',
        example: 'johndoe@gmail.com',
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'User Password',
        example: 'Admin@g123',
    })
    password: string;
}

export class ForgotPasswordDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'User Email',
        example: 'johndoe@gmail.com',
    })
    email: string;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'New password',
        example: 'Admin@123',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Confirm new password',
        example: 'Admin@123',
    })
    confirm_password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'user id',
        example: 'hd77fd-cd8uy7u-c9duc',
    })
    user_id: string;
}

export class CouponDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'New password',
        example: 'Admin@123',
    })
    coupon_name: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Confirm new password',
        example: 'Admin@123',
    })
    discount_percent: number;
}

export class CheckCouponDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'New password',
        example: 'Admin@123',
    })
    coupon_name: string;

}

export class ChangeCouponStatus {

    @IsNotEmpty()
    @IsEnum(ENUM_UserStatus)
    @ApiProperty({
        description: 'Coupon Status',
        example: 'active',
    })
    status: ENUM_UserStatus;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'coupon-id',
        example: 'hd9-3ddh83-ndu33',
    })
    coupon_id: string;
}

export class ChangeOrderStatus {

    @IsNotEmpty()
    @IsEnum(ENUM_ORDER_STATUS)
    @ApiProperty({
        description: 'Coupon Status',
        example: 'active',
    })
    status: ENUM_ORDER_STATUS;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'coupon-id',
        example: 'hd9-3ddh83-ndu33',
    })
    order_id: string;
}

export class AddWhyUsDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Apartment No',
        example: 'No.30',
    })
    whyus_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Apartment No',
        example: 'No.30',
    })
    left_content: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Apartment No',
        example: 'No.30',
    })
    image_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Address line 1',
        example: 'Bonnita street',
    })
    right_content: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Current Password',
        example: 'Admin@123',
    })
    current_password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'New password',
        example: 'Admin@123',
    })
    new_password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'user id',
        example: 'hd77fd-cd8uy7u-c9duc',
    })
    user_id: string;
}

export class UserDetailsDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Apartment No',
        example: 'No.30',
    })
    room_no: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Address line 1',
        example: 'Bonnita street',
    })
    address_line1: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Address line 2',
        example: 'Bonnita high street',
    })
    address_line2: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'City',
        example: 'bonnita city',
    })
    city: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Zipcode',
        example: '600089',
    })
    zip_code: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'State',
        example: 'Bonnita state',
    })
    state: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Country',
        example: 'Bonnita Country',
    })
    country: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'user id',
        example: 'hd77fd-cd8uy7u-c9duc',
    })
    user_id: string;
}