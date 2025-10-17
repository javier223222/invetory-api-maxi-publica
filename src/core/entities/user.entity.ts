import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { ObjectId } from 'mongodb';
import {config} from "../../config"
import * as bcrypt from 'bcryptjs';
import "dotenv/config"


@Entity('users') 
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(config.SALTS_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
    }
}