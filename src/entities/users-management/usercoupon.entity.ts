import { ENUM_UserStatus } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblusercoupon')
export class E_UserCoupon extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    coupon_id: string

    @Column('uuid')
    user_id: string

    @Column({ type: "boolean", default: false })
    isApplied: boolean

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}