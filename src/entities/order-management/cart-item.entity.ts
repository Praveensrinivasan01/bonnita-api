import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblcartitem')
export class E_ProductCartItem extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    user_id: string;

    @Column("uuid")
    product_id: string;

    @Column({ default: 0 })
    quantity: number;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}