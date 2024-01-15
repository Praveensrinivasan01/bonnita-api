import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AddorUpdatePaymentDetails } from 'src/dto/payment.dto';
import { AddorUpdateProductDto } from 'src/dto/product.dto';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_Payment } from 'src/entities/payment-management/payment-deails.entity';
import { MailService } from 'src/mail/mail.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(E_Payment)
        protected paymentRepository: Repository<E_Payment>,
        @InjectDataSource()
        protected dataSource: DataSource,
        @InjectRepository(E_OrderDetails)
        private orderRepository: Repository<E_OrderDetails>,
        private readonly mailService: MailService
    ) { }



    async addPaymentDetails(paymentDetails: AddorUpdatePaymentDetails) {


        const order_id = await this.orderRepository.findOne({ where: { id: paymentDetails.order_id } })
        if (!order_id) {
            return {
                statusCode: 400,
                message: "No order id found"
            }
        }

        const newPayment = new E_Payment()
        newPayment.amount = paymentDetails.amount;
        newPayment.cashfree_id = paymentDetails.cashfree_id;
        newPayment.order_id = paymentDetails.order_id;
        newPayment.raw_response = paymentDetails.raw_response;
        newPayment.user_id = paymentDetails.user_id
        newPayment.status = paymentDetails.status;

        const savepayment = await this.paymentRepository.save(newPayment)

        return {
            statusCode: 200,
            message: "your payment has been done successfull",
            data: savepayment
        }

    }

    async triggerEmailOnSuccess(data) {
        await this.mailService.orderedSuccesfull(data)
        return {
            message: "order details has been sent via email, please check your email",
            statusCode: 200
        }
    }

}
