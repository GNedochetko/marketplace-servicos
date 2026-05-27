import {
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
import ServiceOffer from "@modules/service-offers/typeorm/entities/ServiceOffer";
import User from "@modules/users/typeorm/entities/User";
import Review from "@modules/reviews/typeorm/entities/Review";

export enum RequestStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    COMPLETED = "completed",
    CANCELED = "canceled",
}

@Entity("requests")
class Request {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    client_id: string;

    @ManyToOne(() => User, user => user.requests)
    @JoinColumn({ name: "client_id" })
    client: User;

    @Column()
    provider_id: string;

    @ManyToOne(() => Provider, provider => provider.requests)
    @JoinColumn({ name: "provider_id" })
    provider: Provider;

    @Column()
    service_offer_id: string;

    @ManyToOne(() => ServiceOffer, serviceOffer => serviceOffer.requests)
    @JoinColumn({ name: "service_offer_id" })
    service_offer: ServiceOffer;

    @Column({
        type: "enum",
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    })
    status: RequestStatus;

    @Column({ type: "text", nullable: true })
    notes: string | null;

    @OneToOne(() => Review, review => review.request)
    review: Review;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Request;
