import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { E_Token } from 'src/entities/token.entity';
import { E_User } from 'src/entities/users-management/users.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CommonService } from 'src/common/common.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, OTP_VERIFICATION_DTO, ResetPasswordDto, SignupUserDto, USERLoginUserDto, UserDetailsDto } from 'src/dto/common.dto';
import { E_UserAddress } from 'src/entities/users-management/user_address.entity';
import { ENUM_Flag } from 'src/enum/common.enum';
import { MailService } from 'src/mail/mail.service';
import { E_Otp } from 'src/entities/users-management/otp.entity';

@Injectable()
export class UsersService {

    constructor(private readonly jwtService: JwtService,
        @InjectDataSource() private dataSource: DataSource,
        @InjectRepository(E_User)
        private userRepository: Repository<E_User>,
        @InjectRepository(E_Token)
        private tokenRepository: Repository<E_Token>,
        @InjectRepository(E_UserAddress)
        private userAddressRepository: Repository<E_UserAddress>,
        private readonly mailService: MailService,
        @InjectRepository(E_Otp)
        private otpRepository: Repository<E_Otp>,
    ) {

        // this.sendOtp()

    }

    async signUp(signupUserDto: SignupUserDto) {
        try {
            let user = new E_User();
            let Existuser = await this.dataSource.query(`select id,firstname,lastname,email,password from "tbluser" where mobile ='+91${signupUserDto.mobile}'`)
            //newuser signup
            if (Existuser.length == 0) {
                user.firstname = signupUserDto.firstname;
                user.lastname = signupUserDto.lastname;
                user.mobile = `+91${signupUserDto.mobile}`;
                user.email = signupUserDto.email;
                //password hash
                const salt = await bcrypt.genSalt();
                // const hasheshPassword = await bcrypt.hash(signupUserDto.password, salt);
                user.salt = salt;
                // user.password = hasheshPassword;
                user.createdat = new Date().toISOString().split('T')[0]
                await this.userRepository.save(user)

                console.log()
                await this.mailService.sendWelcomeEmail(5448139, user)
                return {
                    statusCode: 200,
                    user: Existuser[0],
                    message: 'user created'
                }
            }
            else {
                return {
                    statusCode: 400,
                    message: 'User Already Exists'
                }
            }
        } catch (err) {
            console.log("error", err)
            return CommonService.error(err)
        }
    }

    // async sendOtp() {
    //     const data = await this.mailService.sendSms()
    //     return data
    // }

    async signInWithOtp(loginUserDto: USERLoginUserDto) {
        console.log(await this.dataSource.query(`select * from tbluser`))
        let user = await this.dataSource.query(`select * from tbluser where mobile='+91${loginUserDto.mobile}'`);
        if (!user.length) {
            return {
                statusCode: 400, message: 'Invalid mobile number'
            }
        }
        await this.dataSource.query(`delete from tblotp where user_id='${user.id}'`);
        // let pwdChk = user.length ? await bcrypt.compare(loginUserDto.password, user[0].password) : false;
        if (user.length) {
            const randomNum = Math.random() * 9000
            const token = Math.floor(1000 + randomNum).toString()
            const newOtp = new E_Otp()
            newOtp.otp = token;
            newOtp.user_id = user[0]['id'];
            await this.otpRepository.save(newOtp);

            await this.mailService.sendSms(loginUserDto.mobile, token)
            // const jwtPayLoad = { email: user[0].email };
            // const jwtToken = await this.jwtService.signAsync(jwtPayLoad, { expiresIn: '1d' });
            return {
                statusCode: 200, token, message: 'Otp send successfull', user
            }
        } else {
            return {
                statusCode: 310, message: 'Invalid credentials'
            }
        }
    }


    async verifyWithOtp(loginUserDto: OTP_VERIFICATION_DTO) {
        let user = await this.dataSource.query(`select * from tblotp where user_id='${loginUserDto.user_id}' and otp = '${loginUserDto.otp}'`);
        if (!user.length) {
            return {
                statusCode: 400, message: 'Invalid Otp'
            }
        }
        let userDetails = await this.dataSource.query(`select * from tbluser where id='${loginUserDto.user_id}'`);
        if (user.length) {
            const jwtPayLoad = { email: user.email };
            const jwtToken = await this.jwtService.signAsync(jwtPayLoad, { expiresIn: '1d' });
            await this.dataSource.query(`delete from tblotp where user_id='${user[0].id}'`);
            return {
                statusCode: 200, token: jwtToken, user: userDetails.length ? userDetails[0] : [], message: 'Login Successfull'
            }
        } else {
            return {
                statusCode: 310, message: 'Invalid credentials'
            }
        }
    }

    // async signIn(loginUserDto: LoginUserDto) {
    //     let user = await this.dataSource.query(`select * from tbluser where email='${loginUserDto.email}'`)
    //     let pwdChk = user.length ? await bcrypt.compare(loginUserDto.password, user[0].password) : false;
    //     if (user.length && pwdChk) {
    //         const jwtPayLoad = { email: loginUserDto.email };
    //         const jwtToken = await this.jwtService.signAsync(jwtPayLoad, { expiresIn: '1d' });
    //         return {
    //             statusCode: 200, token: jwtToken, user: user[0], message: 'Login Successfull'
    //         }
    //     } else {
    //         return {
    //             statusCode: 310, message: 'Invalid credentials'
    //         }
    //     }
    // }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        try {
            let checkUser = await this.dataSource.query(`select * from "tbluser" where email ='${forgotPasswordDto.email}'`)
            if (checkUser.length) {
                let checkToken = await this.tokenRepository.findOne({ where: { id: checkUser[0].id } })
                if (checkToken) {
                    await this.tokenRepository.delete({ id: checkUser[0].id })
                }
                const resetToken = crypto.randomBytes(32).toString('hex');
                const hash = await bcrypt.hash(
                    resetToken, 10
                );
                const tokenEntity = new E_Token();
                tokenEntity.id = checkUser[0].id;
                tokenEntity.token = hash;

                await this.tokenRepository.save(tokenEntity);

                const link = `${process.env.FE_URL}reset-password?token=${resetToken}&id=${checkUser[0].id}`;
                await this.mailService.forgotPassword(link, checkUser[0])
                console.log("password reset link", link)
                // this.mailService.passwordResetMail(forgotPasswordDto.email, link);
                return {
                    link,
                    statusCode: 200,
                    message: ['Reset password link sent Successfully'],
                };
            } else {
                return {
                    statusCode: 100,
                    message: ['User does not exist'],
                    error: 'Bad Request',
                };
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error)
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
        try {
            let checkUser = await this.userRepository.findOne({ where: { id: resetPasswordDto.user_id } })
            if (checkUser) {
                const salt = await bcrypt.genSalt();
                const hasheshPassword = await bcrypt.hash(resetPasswordDto.password, salt);
                await this.userRepository.update({ id: checkUser.id },
                    { password: hasheshPassword, salt: salt });
                return {
                    statusCode: 200,
                    message: "password changed successfully"
                }
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<any> {
        try {
            let checkUser = await this.userRepository.findOne({ where: { id: changePasswordDto.user_id } })
            if (checkUser) {
                if (await bcrypt.compare(changePasswordDto.current_password, checkUser.password)) {
                    const salt = await bcrypt.genSalt();
                    const hasheshPassword = await bcrypt.hash(changePasswordDto.new_password, salt);
                    await this.userRepository.update({ id: checkUser.id },
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

    async addUserDetails(userDetailsDto: UserDetailsDto) {
        let { user_id, room_no, address_line1, address_line2, city, zip_code, state, country, } = userDetailsDto
        try {
            let checkUser = await this.userAddressRepository.findOne({ where: { user_id: userDetailsDto.user_id } })
            if (checkUser) {
                await this.userAddressRepository.update(user_id, { room_no, address_line1, address_line2, city, zip_code, state, country });
                return {
                    statusCode: 200,
                    message: "user address updated successfully"
                }
            } else {
                const newUser = new E_UserAddress();
                newUser.room_no = room_no;
                newUser.address_line1 = address_line1;
                newUser.address_line2 = address_line2;
                newUser.city = city
                newUser.zip_code = zip_code;
                newUser.state = state.trim().toUpperCase();
                newUser.country = country;
                newUser.user_id = user_id;

                await this.userAddressRepository.save(newUser)
                return{
                    statusCode: 200,
                    message: "user address created successfully"
                }
            } 
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getAllCustomers(){
        try {
            const customers = await this.dataSource.query(`select t.id,concat(t.firstname,' ', t.lastname) as username,
           t.email,t.mobile,TO_CHAR(t.createdat ::timestamp, 'mm-dd-yyyy') as created_date,
           coalesce(sum(t2.total),0) as total_sum,
           coalesce(sum(t2.quantity), 0) as total_quantity
          from tbluser t left join tblorder_details t2 on t2.user_id = t.id
          group by t.id`)
         return {
            statusCode:200,
            message:"fetched all users",
             customers
         }

        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }

    }

    async sendLoginOtp(userDetailsDto: UserDetailsDto){

    }
}
