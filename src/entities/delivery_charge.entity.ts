import { Exclude } from "class-transformer";
import { ENUM_Flag } from "src/enum/common.enum";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Index } from "typeorm";


@Entity('tbldeliver')
export class E_Deliver extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    state: string;

    @Column({ default: 0 })
    amount: number;

    @Column({
        type: 'enum',
        enum: ENUM_Flag,
        default: ENUM_Flag.Y
    })
    active_flag: ENUM_Flag;

    @Column({
        type: 'enum',
        enum: ENUM_Flag,
        default: ENUM_Flag.N
    })
    delete_flag: ENUM_Flag;

    @CreateDateColumn()
    createdat: string;
}