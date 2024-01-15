import { ENUM_PaymentStatus } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('tblpayment')
export class E_Payment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    order_id: string;

    @Column("uuid")
    user_id: string;

    @Column({ default: null })
    cashfree_id: string

    @Column({ default: 0 })
    amount: number;

    @Column()
    raw_response: string;

    @Column({ default: null })
    status: string;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}