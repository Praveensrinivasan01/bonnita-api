import { Injectable, Query } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { CommonService } from 'src/common/common.service';
import { AddOrUpdateOrderDto } from 'src/dto/order.dto';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_OrderItem } from 'src/entities/order-management/order-item.entity';
import { E_RAISE_REQUEST } from 'src/entities/order-management/raise-request.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductDiscount } from 'src/entities/product-management/discount.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_User } from 'src/entities/users-management/users.entity';
import { ENUM_COMPLAINT_REASON, ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD, ENUM_RAISE_REQUEST } from 'src/enum/common.enum';
import { MailService } from 'src/mail/mail.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderService {
    protected get favouritesRepository(): Repository<E_ProductFavourites> {
        return this._favouritesRepository;
    }
    protected set favouritesRepository(value: Repository<E_ProductFavourites>) {
        this._favouritesRepository = value;
    }

    constructor(
        @InjectRepository(E_Product)
        protected productRepository: Repository<E_Product>,
        @InjectRepository(E_ProductCategory)
        protected categoryRepository: Repository<E_ProductCategory>,
        @InjectRepository(E_ProductSubCategory)
        protected subCategoryRepository: Repository<E_ProductSubCategory>,
        @InjectRepository(E_ProductDiscount)
        protected discountRepository: Repository<E_ProductDiscount>,
        @InjectRepository(E_ProductFavourites)
        private _favouritesRepository: Repository<E_ProductFavourites>,
        @InjectRepository(E_ProductImage)
        protected productImageRepository: Repository<E_ProductImage>,
        @InjectRepository(E_Image)
        protected imageRepository: Repository<E_Image>,
        @InjectDataSource()
        protected dataSource: DataSource,
        @InjectRepository(E_ProductCartItem)
        private cartRepository: Repository<E_ProductCartItem>,
        @InjectRepository(E_ProductReview)
        private reviewRepository: Repository<E_ProductReview>,
        @InjectRepository(E_OrderDetails)
        private orderRepository: Repository<E_OrderDetails>,
        @InjectRepository(E_OrderItem)
        private orderItemRepository: Repository<E_OrderItem>,
        @InjectRepository(E_User)
        private userRepository: Repository<E_User>, 
        private readonly mailService: MailService,
        @InjectRepository(E_RAISE_REQUEST)
        private complaintRepository: Repository<E_RAISE_REQUEST>,
    ) { }


    async createOrder(addOrUpdateOrder: Omit<AddOrUpdateOrderDto, 'order_id'>) {
        try {
            console.log("CREATE ORDER DTO", addOrUpdateOrder, addOrUpdateOrder.shipping_amount)
            const { productdetails } = addOrUpdateOrder;

            const existUser = await this.dataSource.query(`select * from tbluser where id ='${addOrUpdateOrder.user_id}'`)

            if (!existUser.length) {
                return {
                    statusCode: 400,
                    message: "User does not exists"
                }
            }

            const newOrder = new E_OrderDetails()
            newOrder.user_id = addOrUpdateOrder.user_id;
            newOrder.discount = addOrUpdateOrder.discount;
            newOrder.total = addOrUpdateOrder.total_amount
            newOrder.bonus = addOrUpdateOrder.bonus
            newOrder.quantity = addOrUpdateOrder.quantity;
            newOrder.shipping_amount = addOrUpdateOrder.shipping_amount;
            newOrder.mode_of_payment = ENUM_PAYMENT_METHOD[addOrUpdateOrder.mode_of_payment]
            // newOrder.status = ENUM_ORDER_STATUS[addOrUpdateOrder.status];

            const saveOrder = await this.orderRepository.save(newOrder);
            let saveOrderItem = [];
            let updateQuantityArray = { query: "" };
            let totalAmount = 0;
            if (productdetails.length) {
                for (let ele = 0; ele < productdetails.length; ele++) {
                    const product = await this.productRepository.findOne({ where: { id: productdetails[ele].product_id } });
                    if (product.quantity < productdetails[ele].quantity) {
                        await this.orderRepository.delete({ id: saveOrder.id });
                        return {
                            statusCode: 400,
                            message: "The quantity is exceed for this product, please check and order again.",
                            product
                        }
                    } else {
                        updateQuantityArray['query'] += `update tblproduct set quantity = ${product['quantity'] - productdetails[ele].quantity} where id ='${product.id}';`
                    }

                    const newOrderItem = new E_OrderItem
                    newOrderItem.order_id = newOrder.id;
                    newOrderItem.product_id = productdetails[ele].product_id;
                    newOrderItem.quantity = productdetails[ele].quantity;
                    totalAmount += productdetails[ele].price * productdetails[ele].quantity;
                    newOrderItem.price = productdetails[ele].price * productdetails[ele].quantity
                    saveOrderItem.push(newOrderItem);
                }



                await this.orderItemRepository.save(saveOrderItem);

                await this.dataSource.query(updateQuantityArray['query'])
            }
            // const total_amount = totalAmount - addOrUpdateOrder.discount + (addOrUpdateOrder.shipping_amount ?? 0) - (addOrUpdateOrder.bonus ?? 0)
            // await this.orderRepository.update({ id: saveOrder.id }, { total: total_amount });
            await this.userRepository.update({ id: addOrUpdateOrder.user_id }, { bonus_points: existUser[0].bonus_points - addOrUpdateOrder.bonus })

            //Have to trigger a email
            // await this.mailService.congratulations(saveOrder, existUser[0].firstname)
            return {
                statusCode: 200,
                message: "order created successfully",
                order: saveOrder,
                order_details: saveOrderItem
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async updateOrderStatus(addOrUpdateOrder: Pick<AddOrUpdateOrderDto, 'status' | 'order_id'>) {
        try {

            const order = await this.orderRepository.findOne({ where: { id: addOrUpdateOrder?.order_id } })
            if (!order) return { statusCode: 400, message: "order does not found" }
            if (order) {
                const objUpdate = {
                    status: ENUM_ORDER_STATUS[addOrUpdateOrder.status],
                }
                const updateOrder = await this.orderRepository.update({ id: addOrUpdateOrder.order_id }, objUpdate)

                return {
                    statusCode: 200,
                    message: "order updated successfully",
                    data: updateOrder
                }

            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async getuserOrdersById(user_id, offset) {
        try {
            const count = await this.dataSource.query(`SELECT
            tod.user_id AS user_id,
            tod.id AS order_id,
            SUM(ti.quantity) AS total_quantity,
            tod.total,
            tod.status,
            TO_CHAR(tod.createdat::timestamp, 'mm-dd-yyyy') AS created_date,
            (
                SELECT DISTINCT ON (ti3.id) ti3.front_side
                FROM tblorder_details tod2
                JOIN tblorder_item ti2 ON tod2.id = ti2.order_id
                JOIN tblproduct t ON t.id = ti2.product_id
                JOIN tblproduct_image ti3 ON ti3.id = t.image_id
                WHERE tod2.user_id = tod.user_id
                LIMIT 1
            ) AS front_side,
            (
                SELECT
                    CASE
                        WHEN COUNT(DISTINCT t.name) = 1 THEN json_build_array(MAX(t.name))
                        ELSE json_agg(DISTINCT ts.name)
                    END
                FROM tblorder_details tod2
                JOIN tblorder_item ti2 ON tod2.id = ti2.order_id
                JOIN tblproduct t ON t.id = ti2.product_id
                JOIN tblproduct_subcategory ts ON ts.id = t.subcategory_id
                WHERE tod2.id = tod.id
            ) AS product_name
        FROM tblorder_details tod
        JOIN tblorder_item ti ON tod.id = ti.order_id
        WHERE tod.user_id = '${user_id}'
        GROUP BY tod.user_id, tod.id, tod.total, tod.status, tod.createdat`);
            const order = await this.dataSource.query(`SELECT
            tod.user_id AS user_id,
            tod.id AS order_id,
            SUM(ti.quantity) AS total_quantity,
            tod.total,
            tod.status,
            TO_CHAR(tod.createdat::timestamp, 'mm-dd-yyyy') AS created_date,
            (
                SELECT DISTINCT ON (ti3.id) ti3.front_side
                FROM tblorder_details tod2
                JOIN tblorder_item ti2 ON tod2.id = ti2.order_id
                JOIN tblproduct t ON t.id = ti2.product_id
                JOIN tblproduct_image ti3 ON ti3.id = t.image_id
                WHERE tod2.user_id = tod.user_id
                LIMIT 1
            ) AS front_side,
            (
                SELECT
                    CASE
                        WHEN COUNT(DISTINCT t.name) = 1 THEN json_build_array(MAX(t.name))
                        ELSE json_agg(DISTINCT ts.name)
                    END
                FROM tblorder_details tod2
                JOIN tblorder_item ti2 ON tod2.id = ti2.order_id
                JOIN tblproduct t ON t.id = ti2.product_id
                JOIN tblproduct_subcategory ts ON ts.id = t.subcategory_id
                WHERE tod2.id = tod.id
            ) AS product_name
        FROM tblorder_details tod
        JOIN tblorder_item ti ON tod.id = ti.order_id
        WHERE tod.user_id = '${user_id}'
        GROUP BY tod.user_id, tod.id, tod.total, tod.status, tod.createdat
        order by tod.createdat desc
        offset ${offset ? offset : 0} limit 15`);
            return {
                statusCode: 200,
                message: "order updated successfully",
                data: order,
                count: count.length ?? 0
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getuserOrdersItemsById(order_id, offset) {
        try {

            const order = await this.dataSource.query(`select t.name,t.tax,ti2.front_side ,ti.quantity ,ti.price ,ti.product_id ,ti.order_id ,tod.total,tod.quantity as total_quantity ,
            tod.discount ,tod.shipping_amount,
           TO_CHAR(tod.createdat ::timestamp, 'mm-dd-yyyy') as created_date,tod.status,
           concat(t2.firstname,' ',t2.lastname) as username,ta.room_no ,ta.address_line1 ,ta.address_line2,
           ta.city ,ta.zip_code ,ta.state ,ta.country ,TO_CHAR(tod.updatedat  ::timestamp, 'mm-dd-yyyy') as updated_at,
           t3.cashfree_id ,t3.amount ,t3.status as "payment_status" ,t3.raw_response ,
           t2.mobile , t2.email ,tod.mode_of_payment,
           (select sum(t4.selling_price) 
           from tblorder_details td3 
           join tblorder_item ti4 on ti4.order_id  = td3.id
           join tblproduct t4 on t4.id = ti4.product_id 
           where ti4.order_id = tod.id) as order_total
           from tblorder_details tod 
           join tbluser t2 on t2.id = tod.user_id 
           left join tbluser_address ta on ta.user_id::uuid= t2.id
           left join tblpayment t3 on t3.order_id  = tod.id
           join tblorder_item ti  on ti.order_id  = tod.id
           join tblproduct t on t.id = ti.product_id 
           join tblproduct_image ti2 on ti2.id = t.image_id where tod.id='${order_id}'`);

            const paymentInformation = await this.dataSource.query(`select  tod.total,tod.quantity as total_quantity ,
           tod.discount ,tod.shipping_amount,
           tod.bonus,
           tod.total ,
           TO_CHAR(tod.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           TO_CHAR(t3.createdat  ::timestamp, 'mm-dd-yyyy') as e_pay_date,
           TO_CHAR(tod.updatedat  ::timestamp, 'mm-dd-yyyy') as updated_at ,tod.mode_of_payment,
           t3.status as payment_status,tod.status,
           tod.payment_date,
           t3.amount ,t3.cashfree_id ,t3.raw_response ,
           sum(ti.price) as order_total
           from tblorder_details tod 
           left join tblpayment t3 on t3.order_id  = tod.id
           join tblorder_item ti  on ti.order_id  = tod.id
           where tod.id ='${order_id}' 
           group by tod.id,t3.order_id,t3.amount ,t3.cashfree_id,t3.raw_response,t3.status,e_pay_date  `)

            return {
                statusCode: 200,
                message: "order updated successfully",
                data: order,
                payments: paymentInformation
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getuserOrders(offset) {
        try {

            const order = await this.dataSource.query(`select total,quantity,status,concat(tu.firstname,' ',tu.lastname) as username,
            TO_CHAR(tod.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
            (select count(td.*)
from tblorder_details td join tbluser t on t.id = td.user_id
where td.createdat >= NOW() - INTERVAL '24 hours') as total_count
            from tblorder_details tod join tbluser tu on tu.id = tod.user_id offset ${offset ? offset : 0} limit 15`);

                return {
                    statusCode: 200,
                    message: "order updated successfully",
                    data: order
                }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

        

    }

    async totalRecords(offset) {
        try {

            const records = await this.dataSource.query(`select jsonb_build_object(
                'total_order',(select count(*) from tblorder_details),
                'total_users', (select count(*) from tbluser),
                'total_earned',(select coalesce(sum(td.total),0) as total_earned from tblorder_details td
                left join tblpayment t2 on t2.user_id = td.user_id  
                where (td.status ='DELIVERED' and td.mode_of_payment  ='CASHONDELIVERY') or 
                      (td.mode_of_payment  ='E_PAY' and t2.status='PAID')),
                'last24hrs_order',(select count(*) from tblorder_details t where t.status ='DELIVERED')	
                ) as total_records`);
            const count = await this.dataSource.query(`select TO_CHAR(td.createdat ::timestamp, 'mm-dd-yyyy') as created_date,td.*,concat(t.firstname,' ',t.lastname) as username,
(select count(td.*)
from tblorder_details td join tbluser t on t.id = td.user_id 
where td.createdat >= NOW() - INTERVAL '24 hours') as total_count
from tblorder_details td join tbluser t on t.id = td.user_id 
                                              where td.createdat >= NOW() - INTERVAL '24 hours'`)
            const last24hrs = await this.dataSource.query(`select TO_CHAR(td.createdat ::timestamp, 'mm-dd-yyyy') as created_date,td.*,concat(t.firstname,' ',t.lastname) as username,
            (select count(td.*)
from tblorder_details td join tbluser t on t.id = td.user_id 
where td.createdat >= NOW() - INTERVAL '24 hours') as total_count
            from tblorder_details td join tbluser t on t.id = td.user_id 
                                                          where td.createdat >= NOW() - INTERVAL '24 hours' order by td.createdat desc offset ${offset ? offset : 0} limit 15`);


                return {
                    statusCode: 200,
                    message: "order updated successfully",
                    data: records[0].total_records,
                    last24hrs_record: last24hrs,
                    count: count.length ?? 0
                }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getDetailpay(orderid) {
        try {
          const config = {
            method: 'GET',
              url: `https://api.cashfree.com/pg/orders/${orderid}`,
            headers: {
              'Content-Type': 'application/json',
              'x-api-version': '2022-09-01',
              'x-client-id': process.env.APPKEY,
              'x-client-secret': process.env.SECRET_KEY,
            },
          };
      
          const response = await axios(config);
          console.log(response.data);
      
          return {
            statusCode: 200,
            message: 'all products fetched successfully',
            data: response.data,
          };
        } catch (error) {
          console.error(error);
          return CommonService.error(error);
        }
      }
    
    async raisedARequest(data) {
        try {
            const order = await this.orderRepository.findOne({ where: { id: data.order_id } });
            if (!order) {
                return {
                    statusCode: 400,
                    message: "No order id found"
                }
            }
            const compaints = await this.complaintRepository.findOne({ where: { order_id: data.order_id, user_id: data.user_id, complaint_type: data.complaint_type } })
            if (compaints) {
                if (compaints.status == ENUM_RAISE_REQUEST.PENDING) {
                    return {
                        statusCode: 400,
                        message: "Complaint has been already raised for this order, please contact bonnita"
                    }
                }
            }


            const newComplaint = new E_RAISE_REQUEST()
            newComplaint.order_id = data.order_id;
            newComplaint.user_id = data.user_id;
            newComplaint.reason = data.reason;
            newComplaint.complaint_type = data.complaint_type;
            newComplaint.image_id = data.image_id

            const saveComplaint = await this.complaintRepository.save(newComplaint)
            const updateOrder = await this.orderRepository.update({ id: order.id }, { status: ENUM_ORDER_STATUS.RAISEDAREQUEST });

            return {
                message: "Complaint has been raised. Bonnita team will be contact you.",
                statusCode: 200,
                saveComplaint,
                updateOrder
            }

        } catch (error) {
            console.error(error);
            return CommonService.error(error);
        }
    }

    async getComplaints(order_id) {
        try {
            const compaints = await this.complaintRepository.findOne({ where: { order_id: order_id } });
            if (compaints) {
                const getImages = await this.imageRepository.findOne({ where: { id: compaints.image_id } })
                return {
                    message: "Complaints found for this order",
                    statusCode: 200,
                    compaints,
                    image: getImages ? getImages : {}
                }
            } else {
                return {
                    statusCode: 400,
                    message: "No complaints found"
                }
            }


        } catch (error) {
            console.error(error);
            return CommonService.error(error);
        }
    }

    async updateComplaint(data) {
        try {
            const order = await this.orderRepository.findOne({ where: { id: data.order_id } });
            const user = await this.userRepository.findOne({ where: { id: order.user_id } })
            if (!order) {
                return {
                    statusCode: 400,
                    message: "No order id found"
                }
            }
            const compaints = await this.complaintRepository.findOne({ where: { order_id: data.order_id } })
            if (compaints.status == "PENDING") {
                data.response  = data?.response ? data?.response:""
                const updateComplaint = await this.complaintRepository.update({ order_id: data.order_id }, { status: data.status=="REJECTED" ? ENUM_RAISE_REQUEST.REJECTED:ENUM_RAISE_REQUEST.APPROVED, response: data.response});
                console.log("updateComplaint",updateComplaint)
                let mailBody = {
                    email: user.email,
                    firstname: user.firstname,
                    header: "",
                    content1: "",
                    content2: "",
                    content3: ""
                }
                if (data.status === "REJECTED") {
                    mailBody.header = `Your ${compaints.complaint_type} Has Been Cancelled`
                    mailBody.content1 = `We regret to inform you that your ${compaints.complaint_type} request has been cancelled because it does not meet our ${compaints.complaint_type} policies.`
                    mailBody.content2 = `For further details contact Bonnita3182@gmail.com`
                    mailBody.content3 = data.response
                } else if (data.status === "APPROVED") {
                    mailBody.header = `Your ${compaints.complaint_type} Has Been Approved`
                    mailBody.content1 = `We are pleased to inform you that your ${compaints.complaint_type} request has been approved based on our ${compaints.complaint_type} policies.`
                    mailBody.content3 = data.response
                    mailBody.content2 = compaints.complaint_type == ENUM_COMPLAINT_REASON.RETURN ? "Your order will be returned with in 5-7 working days, Bonnita will be in contact with you!."
                        : "Your order will be refunded with in 5-7 working days, Bonnita will be in contact with you!."
                }
                await this.mailService.complaintContent(mailBody)
                return {
                    statusCode: 200,
                    message: "Complaint has been updated successfully."
                }
            }

        } catch (error) {
            console.error(error);
            return CommonService.error(error);
        }
    }

    async deleteOrderById(order_id: string) {
        try {
            const orderItems = await this.dataSource.query(`select * from tblorder_item ti where ti.order_id='${order_id}'`)
            const order = await this.orderRepository.findOne({ where: { id: order_id } });
            if (orderItems.length) {
                for (let i = 0; i < orderItems.length; i++) {
                    const product = await this.productRepository.findOne({ where: { id: orderItems[i].product_id } })
                    await this.productRepository.update({ id: orderItems[i].id }, { quantity: product.quantity + orderItems[i].quantity })
                }
            }
            if (!order) {
                return {
                    message: "No orders found",
                    statusCode: 400
                }

            }
            await this.orderRepository.delete({ id: order.id });
            return {
                message: "Order deleted successfully",
                statusCode: 200
            }
        } catch (error) {
            console.log(error)
            return {
                statusCode: 400,
                message: "Error in delete"
            }
        }
    }


}
