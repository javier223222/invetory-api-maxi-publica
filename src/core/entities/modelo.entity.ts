import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('modelos')
export class Modelo {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column({ nullable: false })
    nombre!: string;
    @CreateDateColumn()
    fechaDeAlta!: Date;
    @UpdateDateColumn()
    fechaDeModificacion!: Date;

    @Column()
    marcaId!: ObjectId; 
}
