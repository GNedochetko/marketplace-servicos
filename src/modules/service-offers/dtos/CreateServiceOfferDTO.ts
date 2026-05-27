export default interface CreateServiceOfferDTO {
    provider_id: string;
    category_id: string;
    title: string;
    description: string;
    price: number;
    availability?: string;
}
