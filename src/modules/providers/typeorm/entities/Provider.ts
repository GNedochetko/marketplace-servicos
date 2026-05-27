import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "@modules/users/typeorm/entities/User";
import ServiceOffer from "@modules/service-offers/typeorm/entities/ServiceOffer";
import Request from "@modules/requests/typeorm/entities/Request";
import Review from "@modules/reviews/typeorm/entities/Review";

@Entity("providers")
class Provider {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user_id: string;

    @OneToOne(() => User, user => user.provider)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ type: "text", nullable: true })
    bio: string | null;

    @Column({ type: "varchar", nullable: true })
    phone: string | null;

    @Column({ type: "varchar", nullable: true })
    availability: string | null;

    @OneToMany(() => ServiceOffer, serviceOffer => serviceOffer.provider)
    service_offers: ServiceOffer[];

    @OneToMany(() => Request, request => request.provider)
    requests: Request[];

    @OneToMany(() => Review, review => review.provider)
    reviews: Review[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Provider;
