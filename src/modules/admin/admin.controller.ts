import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from 'src/dto/common.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags("ADMIN")
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    //SignIn 
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin Login' })
    @ApiResponse({ status: 200, description: 'Admin Logged In successfully' })
    @ApiResponse({ status: 400, description: 'Admin already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiBody({ type: LoginUserDto })
    async signIn(
        @Body() loginUserDto: LoginUserDto
    ) {
        return await this.adminService.signIn(loginUserDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Reset Password sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.adminService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To reset the new password' })
    @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async passwordReset(@Body() passwordResetDto: ResetPasswordDto) {
        return this.adminService.resetPassword(passwordResetDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To change the new password' })
    @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.adminService.changePassword(changePasswordDto);
    }

    @Get('top-records')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'filtered sales by sates Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async topRecord() {
        return this.adminService.topRecord();
    }

    @Post('get-all-category')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the category' })
    @ApiResponse({ status: 200, description: 'fetched all category Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCategory(
        @Query('offset') offset: string,
        @Query('search') search: string,
    ) {
        return this.adminService.getAllCategory(search, offset);
    }

    @Get('get-all-subcategory/:category_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the subcategory' })
    @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllSubCategory(
        @Param('category_id') category_id: string,
        @Query('offset') offset: string,
        @Query('search') search: string,
    ) {
        return this.adminService.getAllSubCategory(category_id, search, offset);
    }


    @Post('get-all-customers')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the user details' })
    @ApiResponse({ status: 200, description: 'fetched all customers Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCustomers(
        @Query('offset') offset: string,
        @Query('search') search: string,
    ) {
        return this.adminService.getAllCustomers(search, offset);
    }


    @Post('get-all-orders')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the user orders' })
    @ApiResponse({ status: 200, description: 'fetched all orders Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllOrders(
        @Query('offset') offset: string,
        @Query('search') search: string,
    ) {
        return this.adminService.getAllOrders(search, offset);
    }

    @Post('get-order-details/:order_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the user orders' })
    @ApiResponse({ status: 200, description: 'fetched all orders Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getOrderDetails(
        @Param('order_id') order_id: string
    ) {
        return this.adminService.getOrderDetails(order_id);
    }


    @Get('get-all-products')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the products' })
    @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllProduct(
        @Query('offset') offset: string,
        @Query('search') search: string,
    ) {
        return this.adminService.getAllProduct(search,offset);
    }

    @Get('get-top-records')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the products' })
    @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getTopRecords(
        @Query('sort') sort: string,
        @Query('offset') offset: string,
    ) {
        return this.adminService.getTopRecords(sort, offset);
    }

}
