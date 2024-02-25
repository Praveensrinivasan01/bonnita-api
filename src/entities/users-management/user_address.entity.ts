import { Exclude } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbluser_address')
export class E_UserAddress extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    user_id: string;

    @Column({ default: null })
    room_no: string;

    @Column({ default: null })
    address_line1: string;

    @Column({ default: null })
    address_line2: string;

    @Column({ default: null })
    city: string;

    @Column({ default: null })
    zip_code: string;

    @Column({ default: null })
    state: string;

    @Column({ default: null })
    country: string;

    @CreateDateColumn()
    createdat: string;

    @UpdateDateColumn()
    updatedat: string;
}