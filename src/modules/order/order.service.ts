import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { CommonService } from 'src/common/common.service';
import { AddOrUpdateOrderDto } from 'src/dto/order.dto';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_OrderItem } from 'src/entities/order-management/order-item.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductDiscount } from 'src/entities/product-management/discount.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from 'src/enum/common.enum';
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
    ) { }


    async createOrder(addOrUpdateOrder: Omit<AddOrUpdateOrderDto, 'order_id'>) {
        try {
            const { productdetails } = addOrUpdateOrder;

            const newOrder = new E_OrderDetails()
            newOrder.user_id = addOrUpdateOrder.user_id;
            newOrder.total = addOrUpdateOrder.total_amount;
            newOrder.quantity = addOrUpdateOrder.quantity;
            newOrder.mode_of_payment = ENUM_PAYMENT_METHOD[addOrUpdateOrder.mode_of_payment]
            // newOrder.status = ENUM_ORDER_STATUS[addOrUpdateOrder.status];
        

            console.log("newOrder", newOrder)

            const saveOrder = await this.orderRepository.save(newOrder);
            let saveOrderItem = [];
            if (productdetails.length) {
                productdetails.forEach((ele) => {
                    const newOrderItem = new E_OrderItem
                    newOrderItem.order_id = newOrder.id;
                    newOrderItem.product_id = ele.product_id;
                    newOrderItem.quantity = ele.quantity;
                    newOrderItem.price = ele.price
                    saveOrderItem.push(newOrderItem);
                })
                await this.orderItemRepository.save(saveOrderItem)
            }


            //Have to trigger a email

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
        GROUP BY tod.user_id, tod.id, tod.total, tod.status, tod.createdat offset ${offset ? offset : 0} limit 15`);
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

    async getuserOrdersItemsById(order_id, offset) {
        try {

            const order = await this.dataSource.query(`select t.name,ti2.front_side ,ti.quantity ,ti.price ,ti.product_id ,ti.order_id ,
            TO_CHAR(tod.createdat ::timestamp, 'mm-dd-yyyy') as created_date
            from tblorder_details tod 
            join tblorder_item ti  on ti.order_id  = tod.id
            join tblproduct t on t.id = ti.product_id 
            join tblproduct_image ti2 on ti2.id = t.image_id where tod.id='${order_id}' offset ${offset ? offset : 0} limit 15`);

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
                'total_earned',(select coalesce(sum(total),0) as total_earned from tblorder_details where status ='DELIVERED'),
                'last24hrs_order',(select count(*) from tblorder_details t where t.status ='DELIVERED')	
                ) as total_records`);

            const last24hrs = await this.dataSource.query(`select TO_CHAR(td.createdat ::timestamp, 'mm-dd-yyyy') as created_date,td.*,concat(t.firstname,' ',t.lastname) as username,
            (select count(td.*)
from tblorder_details td join tbluser t on t.id = td.user_id 
where td.createdat >= NOW() - INTERVAL '24 hours') as total_count
            from tblorder_details td join tbluser t on t.id = td.user_id 
                                                          where td.createdat >= NOW() - INTERVAL '24 hours' offset ${offset ? offset : 0} limit 15`);


                return {
                    statusCode: 200,
                    message: "order updated successfully",
                    data: records[0].total_records,
                    last24hrs_record: last24hrs
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
            url: `https://sandbox.cashfree.com/pg/orders/${orderid}`,
            headers :{
              'Content-Type': 'application/json',
              'x-api-version': '2022-09-01',
              'x-client-id': process.env.APPKEY,
              'x-client-secret': process.env.SECRET_KEY,
            }
      
          };
          let res
          axios(config)
            .then(function (response) {
              console.log(response.data);
               res=response.data
            })
            .catch(function (error) {
              console.error(error);
            });
          return {
            statusCode: 200,
            message: 'all products fetched successfully',
            data: res,
          };
        } catch (error) {
          console.log(error);
          return CommonService.error(error);
        }
      }
    



}
