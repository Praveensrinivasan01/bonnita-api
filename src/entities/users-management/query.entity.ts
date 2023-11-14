import { Exclude } from "class-transformer";
import { ENUM_Flag, ENUM_Query, ENUM_UserStatus } from "src/enum/common.enum";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Index } from "typeorm";


@Entity('tblquery')
export class E_Query extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    mobile: string;

    @Column({ default: null })
    email: string;

    @Column({ default: null })
    query: string;

    @Column({ default: null })
    comments: string;

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
    status: ENUM_Flag;

    @CreateDateColumn()
    createdat: string;
}