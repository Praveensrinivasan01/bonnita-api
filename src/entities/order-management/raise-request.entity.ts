import { ENUM_COMPLAINT_REASON } from './../../enum/common.enum';
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD, ENUM_RAISE_REQUEST } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblraise_request')
export class E_RAISE_REQUEST extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    user_id: string;

    @Column("uuid")
    order_id: string;

    @Column({ default: null })
    reason: string;

    @Column({ default: null })
    image_id: string;

    @Column({
        type: "enum",
        enum: ENUM_COMPLAINT_REASON,
        default: ENUM_COMPLAINT_REASON.RETURN
    })
    complaint_type: ENUM_COMPLAINT_REASON;

    @Column({ default: null })
    response: string;

    @Column({
        type: "enum",
        enum: ENUM_RAISE_REQUEST,
        default: ENUM_RAISE_REQUEST.PENDING
    })
    status: ENUM_RAISE_REQUEST;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}