import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import ServiceOffer from "@modules/service-offers/typeorm/entities/ServiceOffer";

@Entity("categories")
class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string | null;

    @OneToMany(() => ServiceOffer, serviceOffer => serviceOffer.category)
    service_offers: ServiceOffer[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Category;
