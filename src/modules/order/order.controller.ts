import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddOrUpdateOrderDto } from 'src/dto/order.dto';

@Controller('order')
@ApiTags("ORDER")
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    // create order
    @Post('/create-order')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create order' })
    @ApiResponse({ status: 200, description: 'Admin Logged In successfully' })
    @ApiResponse({ status: 400, description: 'Admin already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiBody({ type: AddOrUpdateOrderDto })
    async createOrder(
        @Body() addOrUpdateDto: Omit<AddOrUpdateOrderDto, 'order_id'>
    ) {
        return await this.orderService.createOrder(addOrUpdateDto);
    }

    // create order
    @Post('/update-order-status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create order' })
    @ApiResponse({ status: 200, description: 'Admin Logged In successfully' })
    @ApiResponse({ status: 400, description: 'Admin already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateOrderStatus(
        @Body() addOrUpdateDto: Pick<AddOrUpdateOrderDto, 'order_id' | 'status'>
    ) {
        return await this.orderService.updateOrderStatus(addOrUpdateDto);
    }

  
     @Post('/get-order')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'get order' })
     @ApiResponse({ status: 200, description: 'get order status' })
     @ApiResponse({ status: 400, description: 'get order status' })
     @ApiResponse({ status: 500, description: 'Internal server error' })
     async getOrder(@Query('offset') offset: string) {
         return await this.orderService.getuserOrders(offset);
     }

    @Post('/get-order/:user_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get order' })
    @ApiResponse({ status: 200, description: 'get order status' })
    @ApiResponse({ status: 400, description: 'get order status' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getuserOrdersById(@Query('offset') offset: string, @Param("user_id", ParseUUIDPipe) user_id: string) {
        return await this.orderService.getuserOrdersById(user_id, offset);
    }

    @Post('/get-order-items/:order_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get order' })
    @ApiResponse({ status: 200, description: 'get order status' })
    @ApiResponse({ status: 400, description: 'get order status' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getuserOrdersItemsById(@Query('offset') offset: string, @Param("order_id", ParseUUIDPipe) order_id: string) {
        return await this.orderService.getuserOrdersItemsById(order_id, offset);
    }
 
     @Post('/total-records')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'totsl record for dashboard' })
     @ApiResponse({ status: 200, description: 'get total records' })
     @ApiResponse({ status: 400, description: 'get total records' })
     @ApiResponse({ status: 500, description: 'Internal server error' })
     async getTotalRecords(
         @Query('offset') offset: string
     ) {
         return await this.orderService.totalRecords(offset);
     }


     @Get('get-paydata/:orderid')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'To get all the products' })
     @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
     @ApiResponse({ status: 400, description: 'Bad Request' })
     @ApiResponse({ status: 500, description: 'Internal Server Error' })
     async getDetailpay(@Param("orderid") orderid: string) {
         return this.orderService.getDetailpay(orderid);
     }


}
