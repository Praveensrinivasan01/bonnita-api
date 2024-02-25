import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto, SignupUserDto, UserDetailsDto } from 'src/dto/common.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags("USERS")
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    //SignUp
    @Post('/signup')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Register User' })
    @ApiBody({ type: SignupUserDto })
    @ApiResponse({ status: 200, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'User already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async registerUser(
        @Body() signupUserDto: SignupUserDto
    ): Promise<any> {
        return await this.userService.signUp(signupUserDto);
    }

    //SignIn 
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User Login' })
    @ApiBody({ type: LoginUserDto })
    async signIn(
        @Body() loginUserDto: LoginUserDto
    ) {
        return await this.userService.signIn(loginUserDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Reset Password sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.userService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To reset the new password' })
    @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async passwordReset(@Body() passwordResetDto: ResetPasswordDto) {
        return this.userService.resetPassword(passwordResetDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To change the new password' })
    @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async changePasssword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(changePasswordDto);
    }

    @Post('add-userdetails')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To change the user details' })
    @ApiResponse({ status: 200, description: 'User details added Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateUserDetails(@Body() userDetailsDto: UserDetailsDto) {
        return this.userService.addUserDetails(userDetailsDto);
    }

    @Get('get-all-customers')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the user details' })
    @ApiResponse({ status: 200, description: 'fetched all customers Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCustomers() {
        return this.userService.getAllCustomers();
    }

}
