import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblshopping_session')
export class E_ShoppingSession extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    user_id: string;

    @Column({ default: 0 })
    amount: number;

    @Column({ default: 0 })
    amount_discounted: number;

    @Column({ default: 0 })
    total: number;

    @Column({ default: null })
    coupon_applied: string

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}