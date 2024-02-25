import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblproduct_image')
export class E_ProductImage extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    front_side: string;

    @Column({ default: null })
    left_side: string;

    @Column({ default: null })
    right_side: string;

    @Column({ default: null })
    back_side: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}