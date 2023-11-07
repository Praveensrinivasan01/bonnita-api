import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
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


}
