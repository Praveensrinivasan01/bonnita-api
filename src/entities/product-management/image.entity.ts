import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tblimage')
export class E_Image extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    mimetype: string;

    @Column({ name: 'file_size', type: 'int' })
    size: number;

    @Column({ name: 'file_path', type: 'varchar', length: 255 })
    path: string;

    @Column({ default: null })
    imageData: string;

    @UpdateDateColumn()
    updatedat: string;

    @DeleteDateColumn()
    deletedat: string;
}