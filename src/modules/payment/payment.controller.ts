import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddorUpdatePaymentDetails } from 'src/dto/payment.dto';

@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    @Post('/save')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin Login' })
    @ApiResponse({ status: 200, description: 'Admin Logged In successfully' })
    @ApiResponse({ status: 400, description: 'Admin already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiBody({ type: AddorUpdatePaymentDetails })
    async signIn(
        @Body() paymentDetaiils: AddorUpdatePaymentDetails
    ) {
        return await this.paymentService.addPaymentDetails(paymentDetaiils);
    }

    @Post('/order-success')
    async triggerEmail(@Body() data: any) {
        return await this.paymentService.triggerEmailOnSuccess(data);
    }
}
