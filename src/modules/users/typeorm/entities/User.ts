import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Provider from "@modules/providers/typeorm/entities/Provider";
import Request from "@modules/requests/typeorm/entities/Request";
import Review from "@modules/reviews/typeorm/entities/Review";

export enum UserRole {
    CLIENT = "client",
    PROVIDER = "provider",
}

@Entity("users")
class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role: UserRole;

    @OneToOne(() => Provider, provider => provider.user)
    provider: Provider;

    @OneToMany(() => Request, request => request.client)
    requests: Request[];

    @OneToMany(() => Review, review => review.client)
    reviews: Review[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
