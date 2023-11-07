import { Exclude } from "class-transformer";
import { ENUM_Flag } from "src/enum/common.enum";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Index } from "typeorm";


@Entity('tbluser')
@Index(["email"], { unique: true })
export class E_User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    firstname: string;

    @Column({ default: null })
    lastname: string;

    @Column({ default: null })
    mobile: string;

    @Column({ default: null })
    email: string;

    @Column({ default: 0 })
    bonus_points: number;

    @Exclude()
    @Column({ default: null })
    password: string;

    @Exclude()
    @Column({ default: null })
    salt: string;

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