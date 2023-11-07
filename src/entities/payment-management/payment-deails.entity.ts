import { ENUM_PaymentStatus } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('tblpayment')
export class E_Payment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    order_id: string;

    @Column("uuid")
    amount: number;

    @Column({
        type: 'enum',
        enum: ENUM_PaymentStatus,
    })
    status: ENUM_PaymentStatus;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}