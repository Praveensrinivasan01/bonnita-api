import { Exclude } from "class-transformer";
import { ENUM_Flag, ENUM_Query, ENUM_UserStatus } from "src/enum/common.enum";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Index } from "typeorm";


@Entity('tblotp')
export class E_Otp extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    user_id: string;

    @Column({ default: null })
    otp: string;

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

    @Column({
        type: 'enum',
        enum: ENUM_Query,
        default: ENUM_Query.PENDING
    })
    status: ENUM_Query;

    @CreateDateColumn()
    createdat: string;
}