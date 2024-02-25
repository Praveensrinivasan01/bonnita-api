import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tblproduct_favourites')
export class E_ProductFavourites extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    product_id: string;

    @Column({ default: false })
    favourite: boolean;

    @Column("uuid")
    user_id: string;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}