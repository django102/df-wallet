import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import StateLGA from "./StateLGA";


@Entity({ name: "users" })
export default class User {
    @Column()
    @PrimaryGeneratedColumn("uuid")
        id?: string;

    @Column()
    @Index({ unique: true })
        email: string;

    @Column()
        password: string;

    @Column()
    @Index()
        firstName: string;

    @Column()
    @Index()
        lastName: string;

    @Column()
        address: string;

    @Column()
        phoneNumber: string;

    @Column({ type: "integer" })
        stateLgaId: number;

    @Column({ nullable: true })
        profilePicture?: string;

    @Column({ type: "integer", default: 1 })
    @Index()
        tier?: number;

    @Column({ nullable: true })
        pin?: string;

    @Column({ default: false })
    @Index()
        isValidated?: boolean;

    @Column({ default: false })
    @Index()
        isActive?: boolean;

    @Column({ default: false })
    @Index()
        isEnabled?: boolean;

    @Column({ default: false })
    @Index()
        isDeleted?: boolean;

    @CreateDateColumn()
    @Index()
        createdAt?: string;

    @UpdateDateColumn()
    @Index()
        lastUpdatedAt?: Date;


    // ======== JOINS =========

    @ManyToOne(() => StateLGA, (stateLga) => stateLga.id)
        stateLga?: StateLGA;
}