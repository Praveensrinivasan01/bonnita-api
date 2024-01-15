import { Exclude } from "class-transformer";
import { ENUM_Flag } from "src/enum/common.enum";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity, Index } from "typeorm";


@Entity('tblnewsletter')
export class E_NewsLetter extends BaseEntity {
    @PrimaryGeneratedColumn()
    ref_no: number;
    @CreateDateColumn()
    createdat: Date;
}