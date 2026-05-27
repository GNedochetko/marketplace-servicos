import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Provider from "@modules/providers/typeorm/entities/Provider";
import Request from "@modules/requests/typeorm/entities/Request";
import User from "@modules/users/typeorm/entities/User";

@Entity("reviews")
@Check(`"rating" >= 1 AND "rating" <= 5`)
class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    request_id: string;

    @OneToOne(() => Request, request => request.review)
    @JoinColumn({ name: "request_id" })
    request: Request;

    @Column()
    client_id: string;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: "client_id" })
    client: User;

    @Column()
    provider_id: string;

    @ManyToOne(() => Provider, provider => provider.reviews)
    @JoinColumn({ name: "provider_id" })
    provider: Provider;

    @Column({ type: "int" })
    rating: number;

    @Column({ type: "text", nullable: true })
    comment: string | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Review;
