import { ENUM_Flag } from "src/enum/common.enum";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('tblproduct_discount')
export class E_ProductDiscount extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    desc: string;

    @Column({ default: null })
    discount_percent: string;

    @Column({ default: 0 })
    amount: number;

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