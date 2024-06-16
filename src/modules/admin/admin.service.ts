import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AddWhyUsDto, ChangeCouponStatus, ChangeOrderStatus, ChangePasswordDto, CouponDto, DeliverDto, ForgotPasswordDto, LoginUserDto, NewsLetterDto, ResetPasswordDto, UserCouponDto } from 'src/dto/common.dto';
import { E_Admin } from 'src/entities/admin-management/admin.entity';
import { E_Token } from 'src/entities/token.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CommonService } from 'src/common/common.service';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_Coupon } from 'src/entities/order-management/coupon.entity';
import { E_OrderDetails } from 'src/entities/order-management/order-details.entity';
import { E_WhyUs } from 'src/entities/why-us/why-us.entity';
import { E_User } from 'src/entities/users-management/users.entity';
import { MailService } from 'src/mail/mail.service';
import { E_NewsLetter } from 'src/entities/admin-management/newsletter.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_UserCoupon } from 'src/entities/users-management/usercoupon.entity';
import { CouponArray } from 'src/interfaces/coupon.interface';
import { E_Deliver } from 'src/entities/delivery_charge.entity';

@Injectable()
export class AdminService {

    constructor(private readonly jwtService: JwtService,
        @InjectDataSource() private dataSource: DataSource,
        @InjectRepository(E_Admin)
        private adminRepository: Repository<E_Admin>,
        @InjectRepository(E_Coupon)
        private couponRepository: Repository<E_Coupon>,
        @InjectRepository(E_Token)
        private tokenRepository: Repository<E_Token>,
        @InjectRepository(E_OrderDetails)
        private orderRepository: Repository<E_OrderDetails>,
        @InjectRepository(E_WhyUs)
        private whyUsRepository: Repository<E_WhyUs>,
        @InjectRepository(E_User)
        private userRepository: Repository<E_User>,
        // private readonly mailService: MailService
        @InjectRepository(E_ProductSubCategory)
        protected subCategoryRepository: Repository<E_ProductSubCategory>,
        @InjectRepository(E_NewsLetter)
        protected newsRepository: Repository<E_NewsLetter>,
        private readonly mailService: MailService,
        @InjectRepository(E_Product)
        protected productRepository: Repository<E_Product>,
        @InjectRepository(E_UserCoupon)
        protected userCouponRepository: Repository<E_UserCoupon>,
        @InjectRepository(E_Deliver)
        protected deliverRepository: Repository<E_Deliver>,
    ) { }

    async signIn(loginUserDto: LoginUserDto) {
        try {
            let admin = await this.dataSource.query(`select firstname,lastname,mobile,email,password from tbladmin where email='${loginUserDto.email}'`)
            let pwdChk = admin.length ? await bcrypt.compare(loginUserDto.password, admin[0].password) : false;
            if (admin.length && pwdChk) {
                const jwtPayLoad = { email: loginUserDto.email };
                const jwtToken = await this.jwtService.signAsync(jwtPayLoad, { expiresIn: '1d' });
                return {
                    statusCode: 200, token: jwtToken, user: admin[0], message: 'Login Successfull'
                }
            } else {
                return {
                    statusCode: 310, message: 'Invalid credentials'
                }
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error)
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        try {
            let checkAdmin = await this.dataSource.query(`select * from tbladmin where email ='${forgotPasswordDto.email}'`)
            if (checkAdmin.length) {
                let checkToken = await this.tokenRepository.findOne({ where: { id: checkAdmin[0].id } })
                if (checkToken) {
                    await this.tokenRepository.delete({ id: checkAdmin[0].id })
                }
                const resetToken = crypto.randomBytes(32).toString('hex');
                const hash = await bcrypt.hash(
                    resetToken, 10
                );
                const tokenEntity = new E_Token();
                tokenEntity.id = checkAdmin[0].id;
                tokenEntity.token = hash;

                await this.tokenRepository.save(tokenEntity);

                const link = `${process.env.FE_URL}admin/reset-password?token=${resetToken}&id=${checkAdmin[0].id}`;
                console.log("password reset link", link)
                // this.mailService.passwordResetMail(forgotPasswordDto.email, link);
                return {
                    link,
                    statusCode: 200,
                    message: 'Reset password link sent Successfully',
                };
            } else {
                return {
                    statusCode: 400,
                    message: 'Admin does not exist',
                    error: 'Bad Request',
                };
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error)
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        try {
            let checkAdmin = await this.adminRepository.findOne({ where: { id: resetPasswordDto.user_id } })
            if (checkAdmin) {
                const salt = await bcrypt.genSalt();
                const hasheshPassword = await bcrypt.hash(resetPasswordDto.password, salt);
                await this.adminRepository.update({ id: checkAdmin.id },
                    { password: hasheshPassword, salt: salt });
                return {
                    statusCode: 200,
                    message: "admin password changed successfully"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<any> {
        try {
            let checkAdmin = await this.adminRepository.findOne({ where: { id: changePasswordDto.user_id } })
            if (checkAdmin) {
                if (await bcrypt.compare(changePasswordDto.current_password, checkAdmin.password)) {
                    const salt = await bcrypt.genSalt();
                    const hasheshPassword = await bcrypt.hash(changePasswordDto.new_password, salt);
                    await this.adminRepository.update({ id: checkAdmin.id },
                        { password: hasheshPassword, salt: salt });
                    return {
                        statusCode: 200,
                        message: "password changed successfully"
                    }
                } else {
                    return {
                        statusCode: 400,
                        message: "Invalid Password"
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async topRecord(): Promise<any> {
        try {
            const topStates = [];
            const topProducts = [];
            const topCustomers = [];
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getAllCategory(search, offset) {
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = ` where (tc."name" ilike '%${search}%' )`
            }
            const count = await this.dataSource.query(`select tc."name",tc.description,ti."imageData",tc.id as category_id  
            from tblproduct_category tc 
            join tblimage ti on ti.id = tc.image_id ${searchVariable}`)
            const category = await this.dataSource.query(`select tc."name",tc.description,ti."imageData",tc.id as category_id  
            from tblproduct_category tc 
            join tblimage ti on ti.id = tc.image_id ${searchVariable}  offset ${offset ? offset : 0} limit 15`)
            if (!category.length) { console.log("no category for now, please add some."); return { statusCode: 400, message: "no category for now, please add some." } }
            return {
                statusCode: 200,
                message: "all category fetched successfully",
                data: category,
                count: count.length ?? 0
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getAllSubCategory(category_id, search, offset) {
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = ` and (tc."name" ilike '%${search}%')`
            }
            const subCategory = await this.dataSource.query(`select tc."name",tc.description,tc.id as subcategory_id  
            from tblproduct_subcategory tc where tc.category_id ='${category_id}' ${searchVariable}  
            offset ${offset ? offset : 0} limit 15`)
            if (!subCategory.length) { console.log("no subCategory for now, please add some."); return { statusCode: 400, data: [], message: "no subCategory for now, please add some." } }
            return {
                statusCode: 200,
                message: "all sub subCategory fetched successfully",
                data: subCategory
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getAllCustomers(search, offset) {
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = `and (t."firstname" ilike '%${search}%' or t."lastname" ilike '%${search}%'  or t."mobile" ilike '%${search}%'  or t."email" ilike '%${search}%' )`
            }
            const count = await this.dataSource.query(`select t.id,concat(t.firstname,' ', t.lastname) as username,
            t.email,t.mobile,TO_CHAR(t.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
            sum(case when t2.status ='DELIVERED' then  t2.total  else 0 end)  as total_sum,
            sum(case when t2.status ='DELIVERED' then  t2.quantity  else 0 end)  as total_quantity
           from tbluser t
           left join tblorder_details t2 on t2.user_id = t.id
           left join tblpayment tp on tp.order_id = t2.id ${searchVariable} 
           group by t.id `)
            const customers = await this.dataSource.query(`select t.id,concat(t.firstname,' ', t.lastname) as username,
            t.email,t.mobile,TO_CHAR(t.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
            sum(case when t2.status ='DELIVERED' then  t2.total  else 0 end)  as total_sum,
            sum(case when t2.status ='DELIVERED' then  t2.quantity  else 0 end)  as total_quantity
           from tbluser t
           left join tblorder_details t2 on t2.user_id = t.id
           left join tblpayment tp on tp.order_id = t2.id ${searchVariable} 
           group by t.id offset ${offset ? offset : 0} limit 15`)
            return {
                statusCode: 200,
                message: "fetched all users",
                customers,
                count: count.length ?? 0
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async getAllOrders(search, offset, status) {
        console.log("status", status)
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = ` and (t."firstname" ilike '%${search}%' or t."lastname" ilike '%${search}%'  or t."mobile" ilike '%${search}%'  or t."email" ilike '%${search}%' )`
            }
            const count = await this.dataSource.query(`select t2.id as "order_id" ,concat(t.firstname,' ', t.lastname) as username,
            t.email,TO_CHAR(t2.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           t2.total,t2.quantity,t2.status 
           from tbluser t left join tblorder_details t2 on t2.user_id = t.id
           where  case when 'all' = '${status}' then t2.status in ('PENDING','PACKED','READYTOSHIP','ONTHEWAY','DELIVERED','RETURN','REFUNDED','CANCELLED','RAISEDAREQUEST')  
           else t2.status ='${status == 'all' ? 'PENDING' : status}' end 
           ${searchVariable} order by t2.createdat desc`)
            const customers = await this.dataSource.query(`select t2.id as "order_id" ,concat(t.firstname,' ', t.lastname) as username,
            t.email,TO_CHAR(t2.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           t2.total,t2.quantity,t2.status ,(t2.createdat::time) AS order_time
           from tbluser t left join tblorder_details t2 on t2.user_id = t.id
           where  case when 'all' = '${status}' then t2.status in ('PENDING','PACKED','READYTOSHIP','ONTHEWAY','DELIVERED','RETURN','REFUNDED','CANCELLED','RAISEDAREQUEST')  
           else t2.status ='${status == 'all' ? 'PENDING' : status}' end 
           ${searchVariable} order by t2.createdat desc offset ${offset ? offset : 0}  limit 15`)
            return {
                statusCode: 200,
                message: "fetched all orders",
                customers,
                count: count.length ?? 0
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getOrderDetails(order_id) {
        try {
            const customers = await this.dataSource.query(`select ti.quantity,ti.price ,td.total ,td.quantity as total_quantity,td.mode_of_payment ,td.status ,
            tmi.front_side,t.color,ti.order_id,t.size,TO_CHAR(td.createdat ::timestamp, 'mm-dd-yyyy') as createdat,
            concat('INV-BON',substring(EXTRACT(EPOCH FROM td.createdat)::varchar,1,8)) as invoice_num,(t.tax * ti.quantity) as tax,
            tua.room_no ,tua.address_line1 ,tua.address_line2 ,tua.city ,tua.country ,tua.zip_code,tua.state,
            concat(tu.firstname,' ',tu.lastname) as username ,t."name"  from tblorder_details td 
                 join tblorder_item ti on ti.order_id = td.id 
                 join tbluser tu on tu.id = td.user_id
                 join tbluser_address tua on tua.user_id::uuid = tu.id
                 join tblproduct t on t.id = ti.product_id  
                 join tblproduct_image tmi on tmi.id = t.image_id 
            where td.id = '${order_id}'`)
            return {
                statusCode: 200,
                message: "fetched order successfully",
                customers
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async getAllProduct(search,offset) {
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = ` where (t."name" ilike '%${search}%' or t."code" ilike '%${search}%' or tc."name" ilike '%${search}%' or ts."name" ilike '%${search}%' )`
            }
            const count = await this.dataSource.query(`select t.*,tc.name as categoryname,ts.name as subcategoryname ,
            coalesce(sum(ti.quantity),0) as order_quantity 
            from tblproduct t 
            join tblproduct_category tc on tc.id = t.category_id 
            join tblproduct_subcategory ts on ts.id = t.subcategory_id
            left join tblorder_item ti on ti.product_id = t.id
            ${searchVariable} group by t.id,tc.id,ts.id,t.code `)
            const products = await this.dataSource.query(`select t.*,tc.name as categoryname,ts.name as subcategoryname ,
          coalesce(sum(ti.quantity),0) as order_quantity 
          from tblproduct t 
          join tblproduct_category tc on tc.id = t.category_id 
          join tblproduct_subcategory ts on ts.id = t.subcategory_id
          left join tblorder_item ti on ti.product_id = t.id
          ${searchVariable} group by t.id,tc.id,ts.id,t.code order by t.createdat desc offset ${offset ? offset : 0} limit 15`)
          if (!products.length) {
            console.log('no products for now, please add some.');
            return {
              statusCode: 400,
              message: 'no products for now, please add some.',
            };
          }
    
          return {
            statusCode: 200,
            message: 'all products fetched successfully',
            data: products,
              count: count.length ?? 0
          };
        } catch (error) {
          console.log(error);
          return CommonService.error(error);
        }
      }

    async getTopRecords(sort, offset) {
        try {
            let records = []
            let count = []
            if (sort == 'top_products') {
                count = await this.dataSource.query(`select t.name as product_name,
                t.code ,
                sum(ti.quantity) as quantity, sum(ti.price) as price
         from tblproduct t join tblorder_item ti on t.id = ti.product_id
         join tblorder_details td on td.id = ti.order_id 
    left join tblpayment tp on tp.order_id = td.id
         where  (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or
                (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
         group by t.id order by quantity desc`)
                records = await this.dataSource.query(`select t.name as product_name,
                t.code ,
                sum(ti.quantity) as quantity, sum(ti.price) as price
         from tblproduct t join tblorder_item ti on t.id = ti.product_id
         join tblorder_details td on td.id = ti.order_id 
    left join tblpayment tp on tp.order_id = td.id
         where  (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or
                (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
         group by t.id order by quantity desc  offset ${offset} limit 15`)
                if (!records.length) {
                    console.log('no top products for now');
                    return {
                        statusCode: 400,
                        message: 'no top products for now.',
                    };
                }
            } else if (sort == 'sales_by_location') {
                count = await this.dataSource.query(`select  sum(ti.quantity) as quantity,ta.state,sum(td.total) as total
                from  tblorder_item ti 
                join tblorder_details td on td.id = ti.order_id
                join tbluser_address ta on td.user_id = ta.user_id::uuid 
                 left join tblpayment tp on tp.order_id = td.id
                where (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or 
                      (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
                group by ta.state 
                order by total desc`)
                records = await this.dataSource.query(`         select  sum(ti.quantity) as quantity,ta.state,sum(td.total) as total
                from  tblorder_item ti 
                join tblorder_details td on td.id = ti.order_id
                join tbluser_address ta on td.user_id = ta.user_id::uuid 
                 left join tblpayment tp on tp.order_id = td.id
                where (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or 
                      (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
                group by ta.state 
                order by total desc offset ${offset} limit 15`)
                if (!records.length) {
                    console.log('no sales by location for now');
                    return {
                        statusCode: 400,
                        message: 'no sales by location for now.',
                    };
                }
            } else if (sort == 'top_customers') {
                count = await this.dataSource.query(`select concat(tu.firstname,' ',tu.lastname) as username ,sum(td.quantity) as quantity,sum(td.total) as total
                from tblorder_details td left join tblpayment t on t.order_id = td.id 
                     join tbluser tu on tu.id = td.user_id 
                where 
                       td.user_id =tu.id
                       and (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or 
                           (td.mode_of_payment = 'E_PAY' and t.status='PAID')
                           group by tu.id order by total desc`)
                records = await this.dataSource.query(`select concat(tu.firstname,' ',tu.lastname) as username ,sum(td.quantity) as quantity,sum(td.total) as total
                from tblorder_details td left join tblpayment t on t.order_id = td.id 
                     join tbluser tu on tu.id = td.user_id 
                where 
                       td.user_id =tu.id
                       and (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or 
                           (td.mode_of_payment = 'E_PAY' and t.status='PAID')
                           group by tu.id order by total desc offset ${offset} limit 15`)
                if (!records.length) {
                    console.log('no top customers for now');
                    return {
                        statusCode: 400,
                        message: 'no top customers for now.',
                    };
                }
            }

            if (records.length) {
                return {
                    statusCode: 200,
                    message: 'records successfully',
                    data: records,
                    count: count.length ?? 0
                };
            } else {
                return {
                    statusCode: 400,
                    message: 'no records found',
                    data: records,
                };
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async getAllCoupons(offset) {
        try {
            const coupons = await this.couponRepository.find({ skip: offset, take: 15 })

            if (coupons.length) {
                return {
                    statusCode: 200,
                    message: 'coupon fecthed successfully',
                    data: coupons,
                };
            } else {
                return {
                    statusCode: 400,
                    message: 'no coupons found',
                };
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async checkCoupon(dto) {
        try {
            const coupons = await this.couponRepository.find({ where: { coupon_name: dto.coupon_name } })

            if (coupons.length) {
                return {
                    statusCode: 200,
                    message: 'coupon applied successfully',
                    data: coupons,
                };
            } else {
                return {
                    statusCode: 400,
                    message: 'no coupons found',
                };
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async AddCoupon(addCouponDto: CouponDto) {
        try {
            let checkAdmin = await this.couponRepository.findOne({ where: { coupon_name: addCouponDto.coupon_name } })
            if (!checkAdmin) {

                const newCoupon = new E_Coupon();
                newCoupon.coupon_name = addCouponDto.coupon_name;
                newCoupon.discount_percent = addCouponDto.discount_percent;
                const saveCoupon = await this.couponRepository.save(newCoupon)

                return {
                    statusCode: 200,
                    message: "Coupon added successfully",
                    data: saveCoupon
                }
            } else {
                return {
                    statusCode: 400,
                    message: "Coupon already exists"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async changeCouponStatus(couponStatusDto: ChangeCouponStatus) {
        try {
            let checkAdmin = await this.couponRepository.findOne({ where: { id: couponStatusDto.coupon_id } })
            if (checkAdmin) {

                const updateCoupon = await this.couponRepository.update({ id: checkAdmin.id }, { status: couponStatusDto.status })

                return {
                    statusCode: 200,
                    message: "Coupon status updated successfully",
                    data: updateCoupon
                }
            } else {
                return {
                    statusCode: 400,
                    message: "Coupon does not exists"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async deleteCoupon(coupon_id: string) {
        try {
            let checkAdmin = await this.couponRepository.findOne({ where: { id: coupon_id } })
            if (checkAdmin) {
                const deleteCoupon = await this.couponRepository.delete({ id: checkAdmin.id })
                return {
                    statusCode: 200,
                    message: "Coupon deleted successfully"
                }
            } else {
                return {
                    statusCode: 400,
                    message: "Coupon does not exists"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getQueryCount() {
        try {
            const query = await this.dataSource.query(`select count(*) from tblquery where status ='pending'`)

            if (!query.length) {
                return {
                    statusCode: 400,
                    message: "no query found",
                }
            }
            return {
                statusCode: 200,
                message: "query update successfully",
                data: query[0]
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async changeOrderStatus(orderStatus: ChangeOrderStatus) {
        try {
            let checkAdmin = await this.orderRepository.findOne({ where: { id: orderStatus.order_id } })
            if (checkAdmin) {

                if (orderStatus.status === "CANCELLED" || orderStatus.status === "REFUNDED") {
                    const orderItems = await this.dataSource.query(`select * from tblorder_item ti where ti.order_id='${orderStatus.order_id}'`)
                    if (orderItems.length) {
                        for (let i = 0; i < orderItems.length; i++) {
                            const product = await this.productRepository.findOne({ where: { id: orderItems[i].product_id } })
                            const quantity = product.quantity + orderItems[i].quantity
                            const id = orderItems[i].product_id
                            const check = await this.productRepository.update({ id: id }, { quantity: quantity })
                        }
                    }
                }

                const user = await this.userRepository.findOne({ where: { id: checkAdmin.user_id } })
                if (checkAdmin.status == "DELIVERED") {
                    await this.userRepository.update({ id: checkAdmin.user_id }, { bonus_points: user.bonus_points - Math.floor(checkAdmin.total / 20) })
                }
                if (orderStatus.status == "DELIVERED") {
                    await this.userRepository.update({ id: checkAdmin.user_id }, { bonus_points: user.bonus_points + Math.floor(checkAdmin.total / 20) })
                }
                const updateStatus = await this.orderRepository.update({ id: orderStatus.order_id }, { status: orderStatus.status })
                return {
                    statusCode: 200,
                    message: "Order Status updated successfully",
                    data: updateStatus
                }
            } else {
                return {
                    statusCode: 400,
                    message: "Order does not exists"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async addWhyUs(addWhyUsDto: Omit<AddWhyUsDto, 'whyus_id'>) {
        try {


            const newWhyUs = new E_WhyUs();
            newWhyUs.image_id = addWhyUsDto.image_id
            newWhyUs.left_content = addWhyUsDto.left_content
            newWhyUs.right_content = addWhyUsDto.right_content

            await this.whyUsRepository.save(newWhyUs)

            return {
                statusCode: 200,
                message: "Why Us created successfully",
                data: newWhyUs
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async updateWhyUs(addWhyUsDto: AddWhyUsDto) {
        try {
            const check = await this.whyUsRepository.findOne({ where: { id: addWhyUsDto.whyus_id } })
            if (!check) {
                return {
                    statusCode: 400,
                    message: "Id doesnot exists",
                }
            }

            const updateWhyUs = await this.whyUsRepository.update({ id: addWhyUsDto.whyus_id }, {
                image_id: addWhyUsDto.image_id,
                left_content: addWhyUsDto.left_content,
                right_content: addWhyUsDto.right_content
            })
            return {
                statusCode: 200,
                message: "Why Us updated successfully",
                data: updateWhyUs
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async newsLetterDto(addNewsLetter: NewsLetterDto) {
        try {

            const userEmail = await this.userRepository.find({ order: { createdat: "desc" } });
            const news = await this.dataSource.query(`select * from tblnewsletter td where createdat >= current_date `)
            if (news.length) {
                return {
                    statusCode: 400,
                    message: "You already sent the newsletters today."
                }
            }
            if (userEmail.length) {
                for (let i = 0; i < userEmail.length; i++) {
                    await this.mailService.newsLetter(userEmail[i], addNewsLetter)
                }
            }
            const newsLetter = new E_NewsLetter();
            newsLetter.createdat = new Date()
            const create = await this.newsRepository.save(newsLetter)
            console.log(create)
            return {
                statusCode: 200,
                message: "News Letter sent successfully."
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async assignCoupon(userCouponDto: UserCouponDto) {
        try {
            await this.userCouponRepository.delete({ user_id: userCouponDto.user_id });
            if (userCouponDto.coupons.length) {
                for (let i = 0; i < userCouponDto.coupons.length; i++) {
                    const newCoupon = new E_UserCoupon()
                    newCoupon.coupon_id = userCouponDto.coupons[i]
                    newCoupon.user_id = userCouponDto.user_id
                    await this.userCouponRepository.save(newCoupon);
                }
                return {
                    statusCode: 200,
                    message: "Coupons assigned successfully"
                }
            }

            if (!userCouponDto.coupons.length) {
                return {
                    statusCode: 200,
                    message: "Coupons unassigned sucessfully"
                }
            }


        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getAssignedCoupons(userCouponDto: Pick<UserCouponDto, 'user_id'>) {

        try {
            const userCoupons: CouponArray | [] = await this.dataSource.query(`select tc.id,tc.coupon_name,tc.discount_percent,tuc.user_id 
            from tblcoupon tc join tblusercoupon tuc on tuc.coupon_id = tc.id 
            where tuc.user_id ='${userCouponDto.user_id}' and tc.status='active' `);

            return {
                statusCode: 400,
                data: userCoupons.length ? userCoupons : []
            }
        } catch (error) {
            console.log("ERROR", error.message)
            return {
                statusCode: 400,
                message: error.message
            }
        }
    }

    async deleteAssignedCoupon(userCouponDto: UserCouponDto): Promise<any> {
        const deleteCoupon = await this.userCouponRepository.delete({ id: userCouponDto.user_id, coupon_id: userCouponDto.coupon_id })
        return {
            statusCode: 200,
            message: "coupon deleted."
        }
    }

    async getWholeAssignedCoupons(offset: string) {
        const count = await this.dataSource.query(`select  tu.id, tu.firstname ,tu.lastname ,sum(td.total) as total
        from tbluser tu
        join tblusercoupon tuc on tu.id = tuc.user_id      
        left join tblorder_details td on td.user_id = tu.id
        left join tblpayment tp on tp.order_id = td.id
   where  (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or
          (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
        group by tu.id`)
        const wholeAssignedCoupons = await this.dataSource.query(`select  tu.id, tu.firstname ,tu.lastname ,sum(td.total) as total
        from tbluser tu
        join tblusercoupon tuc on tu.id = tuc.user_id      
        left join tblorder_details td on td.user_id = tu.id
        left join tblpayment tp on tp.order_id = td.id
   where  (td.status ='DELIVERED' and td.mode_of_payment = 'CASHONDELIVERY') or
          (td.mode_of_payment = 'E_PAY' and tp.status='PAID')
        group by tu.id offset ${offset} limit 15`)

        if (!wholeAssignedCoupons.length) {
            return {
                statusCode: 400,
                data: [],
                count: count.length ?? 0
            }
        }
        return {
            statusCode: 200,
            data: wholeAssignedCoupons,
            count: count.length ?? 0
        }
    }

    async addDeliver(deliverDto: Omit<DeliverDto, 'id'>) {
        try {


            const deliver = new E_Deliver();
            deliver.state = deliverDto.state
            deliver.amount = deliverDto.amount

            await this.deliverRepository.save(deliver)

            return {
                statusCode: 200,
                message: "Delivery charge created successfully",
                data: deliver
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async updateDeliver(deliverDto: DeliverDto) {
        try {

            const check = await this.deliverRepository.findOne({ where: { id: deliverDto.id } })
            if (!check) {
                return {
                    statusCode: 400,
                    message: "State not found",
                }
            }

            const deliver = await this.deliverRepository.update({ id: deliverDto.id }, { amount: deliverDto.amount, state: deliverDto.state })

            return {
                statusCode: 200,
                message: "Deliver charge updated successfully",
                data: deliver
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getDeliverCharges() {
        const data = await this.dataSource.query(`select * from tbldeliver`)
        if (!data.length) {
            return {
                statusCode: 400,
                data: [],
                messages: "No delivery states"

            }
        }
        return {
            statusCode: 200,
            data: data,
        }
    }

    async deleteDeliveryCharge(id: any) {
        if (id["id"]) {
            id = id["id"]
        }
        try {
            let checkDeliveryRecord = await this.deliverRepository.findOne({ where: { id: id } })
            if (checkDeliveryRecord) {
                const deleteCoupon = await this.deliverRepository.delete({ id: checkDeliveryRecord.id })
                return {
                    statusCode: 200,
                    message: "Coupon deleted successfully"
                }
            } else {
                return {
                    statusCode: 400,
                    message: "Coupon does not exists"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }
}


