import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UtcDateTransformer } from 'infrastructure/database/transformers/utc-date.transformer';
import { ObjectId } from 'mongodb';

@Entity('cars') 
export class Car {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column({ nullable: false })
    marca!: string;

    @Column({ nullable: false })
    modelo!: string;

    @Column({ nullable: false })
    año!: number;

    @Column({ type: 'double', nullable: false })
    precio!: number;

    @Column({ nullable: false })
    kilometraje!: number;

    @Column({ nullable: true }) 
    color?: string;

    @Column({ nullable: false })
    email!: string;

    @Column({ nullable: false })
    telefono!: string;

    @Column({ nullable: true }) 
    fotografia?: string;

    @CreateDateColumn({
        type: 'timestamp',
        transformer: new UtcDateTransformer()
    }) 
    fechaDeAlta!: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        transformer: new UtcDateTransformer()
    })  
    fechaDeModificacion!: Date;

    @Column({ type: 'timestamp', nullable: true }) 
    fechaDeEliminacion?: Date;
}