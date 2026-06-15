import type {
  Category,
  Provider,
  Review,
  ServiceOffer,
  ServiceRequest,
  Session,
  User,
  UserRole,
} from "./types";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const SESSION_KEY = "conecta-local-session";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function loadSession(): Session | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as Session) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: Session | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const validation = body?.validation?.body?.message;
    throw new ApiError(body?.message ?? validation ?? "Não foi possível concluir a operação.", response.status);
  }

  return response.json() as Promise<T>;
}

const body = (value: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(value),
});

const put = (value: unknown): RequestInit => ({
  method: "PUT",
  body: JSON.stringify(value),
});

export const api = {
  login: (email: string, password: string) =>
    request<Session>("/sessions", body({ email, password })),
  register: (data: { name: string; email: string; password: string; role: UserRole }) =>
    request<User>("/users", body(data)),
  updateUser: (id: string, data: Partial<User> & { password?: string }, token: string) =>
    request<User>(`/users/${id}`, put(data), token),

  categories: () => request<Category[]>("/categories"),
  createCategory: (data: { name: string; description?: string }, token: string) =>
    request<Category>("/categories", body(data), token),

  providers: () => request<Provider[]>("/providers"),
  provider: (id: string) => request<Provider>(`/providers/${id}`),
  createProvider: (data: Omit<Provider, "id">, token: string) =>
    request<Provider>("/providers", body(data), token),
  updateProvider: (id: string, data: Partial<Provider>, token: string) =>
    request<Provider>(`/providers/${id}`, put(data), token),

  offers: () => request<ServiceOffer[]>("/service-offers"),
  createOffer: (data: Omit<ServiceOffer, "id">, token: string) =>
    request<ServiceOffer>("/service-offers", body(data), token),
  updateOffer: (id: string, data: Partial<ServiceOffer>, token: string) =>
    request<ServiceOffer>(`/service-offers/${id}`, put(data), token),

  requests: () => request<ServiceRequest[]>("/requests"),
  requestDetails: (id: string) => request<ServiceRequest>(`/requests/${id}`),
  createRequest: (
    data: { client_id: string; provider_id: string; service_offer_id: string; notes?: string },
    token: string,
  ) => request<ServiceRequest>("/requests", body(data), token),
  updateRequestStatus: (id: string, status: ServiceRequest["status"], token: string) =>
    request<ServiceRequest>(`/requests/${id}/status`, put({ status }), token),

  reviews: (providerId: string) => request<Review[]>(`/reviews/provider/${providerId}`),
  createReview: (
    data: { request_id: string; client_id: string; provider_id: string; rating: number; comment?: string },
    token: string,
  ) => request<Review>("/reviews", body(data), token),
};

