import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblproduct')
export class E_Product extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    code: string;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: null })
    description: string;

    @Column({ default: null })
    about: string;

    @Column({ default: null })
    features: string;

    @Column('uuid')
    category_id: string;

    @Column('uuid')
    subcategory_id: string;

    @Column('uuid')
    image_id: string;

    @Column({ default: null })
    color: string;

    @Column({ default: null })
    color_name: string;

    @Column({ default: null })
    size: string;

    @Column({ default: 0 })
    tax: number;

    @Column({ default: 0 })
    mrp: number;

    @Column({ default: 0 })
    selling_price: number;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}