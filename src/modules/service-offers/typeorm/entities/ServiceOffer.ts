import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Category from "@modules/categories/typeorm/entities/Category";
import Provider from "@modules/providers/typeorm/entities/Provider";
import Request from "@modules/requests/typeorm/entities/Request";

@Entity("service_offers")
class ServiceOffer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => Provider, provider => provider.service_offers)
    @JoinColumn({ name: "provider_id" })
    provider: Provider;

    @Column()
    category_id: string;

    @ManyToOne(() => Category, category => category.service_offers)
    @JoinColumn({ name: "category_id" })
    category: Category;

    @Column()
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ type: "varchar", nullable: true })
    availability: string | null;

    @OneToMany(() => Request, request => request.service_offer)
    requests: Request[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default ServiceOffer;
