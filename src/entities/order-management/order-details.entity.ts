import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblorder_details')
export class E_OrderDetails extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    user_id: string;

    @Column({ default: 0 })
    total: number;


    @Column({ default: 0 })
    discount: number;

    @Generated("increment")
    ref_no: number;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    bonus: number;

    @Column({
        type: "enum",
        enum: ENUM_PAYMENT_METHOD,
        default: ENUM_PAYMENT_METHOD.COD
    })
    mode_of_payment: ENUM_PAYMENT_METHOD;

    @Column({ default: 0 })
    shipping_amount: number;

    @Column({
        type: "enum",
        enum: ENUM_ORDER_STATUS,
        default: ENUM_ORDER_STATUS.PENDING
    })
    status: ENUM_ORDER_STATUS;

    @Column({ default: null })
    cashfree_id: string;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @Column({ type: "date", default: null })
    payment_date: String

    @DeleteDateColumn()
    deletedat: string;
}