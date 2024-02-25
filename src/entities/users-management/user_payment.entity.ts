import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbluser_payment')
export class E_UserPayment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    user_id: string;

    @Column({ default: null })
    payment_type: string;

    @Column({ default: null })
    provider: string;

    @Column({ default: null })
    account_type: string;

    @Column({ default: null })
    account_no: string;

    @CreateDateColumn()
    expiry: string;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;
}