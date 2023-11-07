import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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
        description: 'user id',
        example: 'hd77fd-cd8uy7u-c9duc',
    })
    user_id: string;
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