import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'tbltoken' })
export class E_Token extends BaseEntity {

    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    createdat: Date;
}