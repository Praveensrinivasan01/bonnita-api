import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tblproduct_review')
export class E_ProductReview extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    product_id: string;

    @Column("uuid")
    user_id: string;

    @Column({ default: null })
    review: string;

    @Column({ default: 5 })
    rating: number;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}