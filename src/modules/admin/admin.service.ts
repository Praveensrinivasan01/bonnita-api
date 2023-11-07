import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from 'src/dto/common.dto';
import { E_Admin } from 'src/entities/admin-management/admin.entity';
import { E_Token } from 'src/entities/token.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CommonService } from 'src/common/common.service';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';

@Injectable()
export class AdminService {

    constructor(private readonly jwtService: JwtService,
        @InjectDataSource() private dataSource: DataSource,
        @InjectRepository(E_Admin)
        private adminRepository: Repository<E_Admin>,
        @InjectRepository(E_Token)
        private tokenRepository: Repository<E_Token>,
        // private readonly mailService: MailService
        @InjectRepository(E_ProductSubCategory)
        protected subCategoryRepository: Repository<E_ProductSubCategory>,
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
            const category = await this.dataSource.query(`select tc."name",tc.description,ti."imageData",tc.id as category_id  
            from tblproduct_category tc 
            join tblimage ti on ti.id = tc.image_id ${searchVariable}  offset ${offset ? offset : 0} limit 15`)
            if (!category.length) { console.log("no category for now, please add some."); return { statusCode: 400, message: "no category for now, please add some." } }
            return {
                statusCode: 200,
                message: "all category fetched successfully",
                data: category
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
                searchVariable = ` where (t."firstname" ilike '%${search}%' or t."lastname" ilike '%${search}%'  or t."mobile" ilike '%${search}%'  or t."email" ilike '%${search}%' )`
            }
            const customers = await this.dataSource.query(`select t.id,concat(t.firstname,' ', t.lastname) as username,
           t.email,t.mobile,TO_CHAR(t.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           coalesce(sum(t2.total),0) as total_sum,
           coalesce(sum(t2.quantity), 0) as total_quantity
          from tbluser t left join tblorder_details t2 on t2.user_id = t.id
          ${searchVariable}
          group by t.id offset ${offset ? offset : 0} limit 15`)
            return {
                statusCode: 200,
                message: "fetched all users",
                customers
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async getAllOrders(search, offset) {
        try {
            let searchVariable = '';
            if (search && search != undefined) {
                searchVariable = ` where (t."firstname" ilike '%${search}%' or t."lastname" ilike '%${search}%'  or t."mobile" ilike '%${search}%'  or t."email" ilike '%${search}%' )`
            }
            const customers = await this.dataSource.query(`select t2.id as "order_id" ,concat(t.firstname,' ', t.lastname) as username,
            t.email,TO_CHAR(t.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           t2.total,t2.quantity,t2.status 
           from tbluser t left join tblorder_details t2 on t2.user_id = t.id
           ${searchVariable} offset ${offset ? offset : 0} limit 15`)
            return {
                statusCode: 200,
                message: "fetched all orders",
                customers
            }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getOrderDetails(order_id) {
        try {
            const customers = await this.dataSource.query(`select * from tblorder_details td join tblorder_item ti on ti.order_id = td.id where td.id = '${order_id}'`)
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
          const products = await this.dataSource.query(`select t.*,tc.name as categoryname,ts.name as subcategoryname 
          from tblproduct t 
          join tblproduct_category tc on tc.id = t.category_id 
          join tblproduct_subcategory ts on ts.id = t.subcategory_id ${searchVariable} offset ${offset ? offset :0} limit 15`)
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
          };
        } catch (error) {
          console.log(error);
          return CommonService.error(error);
        }
      }

    async getTopRecords(sort, offset) {
        try {
            let records = []
            if (sort == 'top_products') {
                records = await this.dataSource.query(`select t.name as product_name,
                t.code ,
                sum(ti.quantity) as quantity
         from tblproduct t join tblorder_item ti on t.id = ti.product_id
         join tblorder_details td on td.id = ti.order_id 
         where td.status ='DELIVERED'
         group by t.id order by sum(ti.quantity) desc offset ${offset} limit 15`)
                if (!records.length) {
                    console.log('no top products for now');
                    return {
                        statusCode: 400,
                        message: 'no top products for now.',
                    };
                }
            } else if (sort == 'sales_by_location') {
                records = await this.dataSource.query(`     select  sum(ti.quantity) as quantity,ta.state,sum(td.total) as total
                from  tblorder_item ti 
                join tblorder_details td on td.id = ti.order_id
                join tbluser_address ta on td.user_id = ta.user_id::uuid 
                where td.status ='DELIVERED'
                group by ta.state 
                order by sum(td.total) desc offset ${offset} limit 15`)
                if (!records.length) {
                    console.log('no sales by location for now');
                    return {
                        statusCode: 400,
                        message: 'no sales by location for now.',
                    };
                }
            } else if (sort == 'top_customers') {
                records = await this.dataSource.query(` select  concat(ta.firstname,' ',ta.lastname) as username ,sum(ti.quantity) as quantity,sum(td.total) as total
                from  tblorder_item ti 
                join tblorder_details td on td.id = ti.order_id
                join tbluser ta on td.user_id = ta.id::uuid 
                where td.status ='DELIVERED'
                group by ta.id
                order by sum(td.total) desc offset ${offset} limit 15`)
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
}


