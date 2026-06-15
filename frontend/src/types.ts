export type UserRole = "client" | "provider";
export type RequestStatus = "pending" | "accepted" | "completed" | "canceled";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Provider {
  id: string;
  user_id: string;
  bio: string | null;
  phone: string | null;
  availability: string | null;
  user?: User;
  service_offers?: ServiceOffer[];
}

export interface ServiceOffer {
  id: string;
  provider_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number | string;
  availability: string | null;
  provider?: Provider;
  category?: Category;
}

export interface Review {
  id: string;
  request_id: string;
  client_id: string;
  provider_id: string;
  rating: number;
  comment: string | null;
  client?: User;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  provider_id: string;
  service_offer_id: string;
  status: RequestStatus;
  notes: string | null;
  created_at: string;
  client?: User;
  provider?: Provider;
  service_offer?: ServiceOffer;
  review?: Review | null;
}

export interface Session {
  user: User;
  token: string;
}

