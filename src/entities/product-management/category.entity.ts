import { ENUM_Flag } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblproduct_category')
export class E_ProductCategory extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    description: string;

    @Column({ default: null })
    features: string;

    @Column('uuid')
    image_id: string;

    @Column({
        type: 'enum',
        enum: ENUM_Flag,
        default: ENUM_Flag.Y
    })
    active_flag: ENUM_Flag;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}