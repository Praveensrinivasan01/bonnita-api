import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tblwhyus' })
export class E_WhyUs extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    left_content: string;

    @Column()
    right_content: string;

    @Column("uuid")
    image_id: string;

    @CreateDateColumn()
    createdat: Date;
}