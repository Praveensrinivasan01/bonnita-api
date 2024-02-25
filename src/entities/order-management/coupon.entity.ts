import { ENUM_UserStatus } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblcoupon')
export class E_Coupon extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 0 })
    discount_percent: number;

    @Column({ default: null })
    coupon_name: string

    @Column({
        type: "enum",
        enum: ENUM_UserStatus,
        default: ENUM_UserStatus.ACTIVE
    })
    status: ENUM_UserStatus

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}