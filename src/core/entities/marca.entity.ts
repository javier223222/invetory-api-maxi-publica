import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('marcas')
export class Marca {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column({ unique: true, nullable: false })
    nombre!: string;

    @CreateDateColumn()
    fechaDeAlta!: Date;

    @UpdateDateColumn()
    fechaDeModificacion!: Date;
}