<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { api, ApiError } from "../api";
import type { Category, Provider, ServiceOffer, ServiceRequest, Session, UserRole } from "../types";

const props = defineProps<{ view: string; session?: Session | null }>();
const emit = defineEmits<{ session: [value: Session | null] }>();
const router = useRouter();

const busy = ref(false);
const loading = ref(true);
const message = ref("");
const error = ref("");
const query = ref("");
const categoryFilter = ref("");
const selectedOffer = ref<ServiceOffer | null>(null);
const reviewTarget = ref<ServiceRequest | null>(null);
const editOfferId = ref("");
const categories = ref<Category[]>([]);
const providers = ref<Provider[]>([]);
const offers = ref<ServiceOffer[]>([]);
const requests = ref<ServiceRequest[]>([]);
const reviews = ref<Record<string, Awaited<ReturnType<typeof api.reviews>>>>({});
const profileImages = {
  client: "/profiles/client.jpg",
  provider: "/profiles/provider.jpg",
} as const;

const authForm = reactive({ name: "", email: "", password: "", role: "client" as UserRole });
const accountForm = reactive({ name: "", email: "", password: "" });
const providerForm = reactive({ bio: "", phone: "", availability: "" });
const categoryForm = reactive({ name: "", description: "" });
const offerForm = reactive({ category_id: "", title: "", description: "", price: "", availability: "" });
const requestNotes = ref("");
const reviewForm = reactive({ rating: 5, comment: "" });

const myProvider = computed(() => providers.value.find((item) => item.user_id === props.session?.user.id));
const filteredOffers = computed(() => offers.value.filter((offer) => {
  const text = `${offer.title} ${offer.description} ${offer.category?.name ?? ""} ${providerName(offer.provider_id)}`.toLowerCase();
  return (!query.value || text.includes(query.value.toLowerCase()))
    && (!categoryFilter.value || offer.category_id === categoryFilter.value);
}));
const myRequests = computed(() => {
  if (props.session?.user.role === "client") return requests.value.filter((item) => item.client_id === props.session?.user.id);
  return requests.value.filter((item) => item.provider_id === myProvider.value?.id);
});
const myOffers = computed(() => offers.value.filter((item) => item.provider_id === myProvider.value?.id));

onMounted(loadData);
watch(() => props.view, () => {
  error.value = "";
  message.value = "";
  if (props.view === "account" && props.session) {
    accountForm.name = props.session.user.name;
    accountForm.email = props.session.user.email;
  }
});
watch(myProvider, (value) => {
  if (value) {
    providerForm.bio = value.bio ?? "";
    providerForm.phone = value.phone ?? "";
    providerForm.availability = value.availability ?? "";
  }
}, { immediate: true });

async function loadData() {
  loading.value = true;
  try {
    [categories.value, providers.value, offers.value, requests.value] = await Promise.all([
      api.categories(), api.providers(), api.offers(), api.requests(),
    ]);
  } catch (cause) {
    showError(cause);
  } finally {
    loading.value = false;
  }
}

function providerName(id: string) {
  return providers.value.find((item) => item.id === id)?.user?.name ?? "Prestador local";
}
function providerAvatar(id: string) {
  return profileImages.provider;
}
function userAvatar(role?: UserRole) {
  return role === "provider" ? profileImages.provider : profileImages.client;
}
function avatarStyle(src: string) {
  return { backgroundImage: `url(${src})` };
}
function statusLabel(status: ServiceRequest["status"]) {
  return { pending: "Pendente", accepted: "Aceito", completed: "Concluído", canceled: "Cancelado" }[status];
}
function money(value: number | string) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function date(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}
function showError(cause: unknown) {
  error.value = cause instanceof ApiError ? cause.message : "Não foi possível conectar ao servidor.";
  message.value = "";
}
function success(value: string) {
  message.value = value;
  error.value = "";
}
async function run(action: () => Promise<void>) {
  busy.value = true;
  error.value = "";
  try { await action(); } catch (cause) { showError(cause); } finally { busy.value = false; }
}
function requireSession() {
  if (!props.session) {
    router.push("/entrar");
    return false;
  }
  return true;
}

async function submitAuth() {
  await run(async () => {
    if (props.view === "register") {
      await api.register(authForm);
      success("Conta criada. Agora entre com seus dados.");
      await router.push("/entrar");
      return;
    }
    const session = await api.login(authForm.email, authForm.password);
    emit("session", session);
    await router.push("/painel");
  });
}

async function saveAccount() {
  if (!props.session) return;
  await run(async () => {
    const data = { name: accountForm.name, email: accountForm.email, ...(accountForm.password ? { password: accountForm.password } : {}) };
    const user = await api.updateUser(props.session!.user.id, data, props.session!.token);
    emit("session", { ...props.session!, user });
    accountForm.password = "";
    success("Conta atualizada.");
  });
}

async function saveProvider() {
  if (!props.session) return;
  await run(async () => {
    if (myProvider.value) await api.updateProvider(myProvider.value.id, providerForm, props.session!.token);
    else await api.createProvider({ user_id: props.session!.user.id, ...providerForm }, props.session!.token);
    await loadData();
    success("Perfil profissional salvo.");
  });
}

async function createCategory() {
  if (!props.session) return;
  await run(async () => {
    await api.createCategory(categoryForm, props.session!.token);
    categoryForm.name = ""; categoryForm.description = "";
    await loadData();
    success("Categoria criada.");
  });
}

function editOffer(offer: ServiceOffer) {
  editOfferId.value = offer.id;
  offerForm.category_id = offer.category_id;
  offerForm.title = offer.title;
  offerForm.description = offer.description;
  offerForm.price = String(offer.price);
  offerForm.availability = offer.availability ?? "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function clearOfferForm() {
  editOfferId.value = "";
  Object.assign(offerForm, { category_id: "", title: "", description: "", price: "", availability: "" });
}
async function saveOffer() {
  if (!props.session || !myProvider.value) return;
  await run(async () => {
    const data = { ...offerForm, provider_id: myProvider.value!.id, price: Number(offerForm.price) };
    if (editOfferId.value) await api.updateOffer(editOfferId.value, data, props.session!.token);
    else await api.createOffer(data, props.session!.token);
    clearOfferForm();
    await loadData();
    success("Serviço salvo.");
  });
}

async function openOffer(offer: ServiceOffer) {
  selectedOffer.value = offer;
  requestNotes.value = "";
  if (!reviews.value[offer.provider_id]) {
    reviews.value[offer.provider_id] = await api.reviews(offer.provider_id).catch(() => []);
  }
}
async function requestService() {
  if (!requireSession() || !selectedOffer.value || props.session?.user.role !== "client") return;
  await run(async () => {
    await api.createRequest({
      client_id: props.session!.user.id,
      provider_id: selectedOffer.value!.provider_id,
      service_offer_id: selectedOffer.value!.id,
      notes: requestNotes.value,
    }, props.session!.token);
    selectedOffer.value = null;
    await loadData();
    success("Solicitação enviada ao prestador.");
  });
}
async function setStatus(item: ServiceRequest, status: ServiceRequest["status"]) {
  if (!props.session) return;
  await run(async () => {
    await api.updateRequestStatus(item.id, status, props.session!.token);
    await loadData();
    success(`Solicitação marcada como ${statusLabel(status).toLowerCase()}.`);
  });
}
async function openReview(item: ServiceRequest) {
  const details = await api.requestDetails(item.id);
  if (details.review) {
    success("Esta solicitação já foi avaliada.");
    return;
  }
  reviewTarget.value = item;
  reviewForm.rating = 5; reviewForm.comment = "";
}
async function submitReview() {
  if (!props.session || !reviewTarget.value) return;
  await run(async () => {
    await api.createReview({
      request_id: reviewTarget.value!.id,
      client_id: props.session!.user.id,
      provider_id: reviewTarget.value!.provider_id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    }, props.session!.token);
    reviewTarget.value = null;
    success("Avaliação publicada. Obrigado!");
  });
}
</script>

<template>
  <main>
    <div v-if="message || error" class="toast" :class="{ error }">
      <span>{{ error || message }}</span><button @click="message = ''; error = ''">×</button>
    </div>

    <template v-if="view === 'home'">
      <section class="hero">
        <div class="hero-content">
          <p class="eyebrow">Serviços locais, sem complicação</p>
          <h1>Encontre quem resolve.<br><em>Perto de você.</em></h1>
          <p class="hero-copy">Profissionais locais para cuidar do que importa, com preço e disponibilidade transparentes.</p>
          <div class="hero-search">
            <input v-model="query" placeholder="O que você precisa hoje?" aria-label="Buscar serviço">
            <button class="button">Buscar serviços</button>
          </div>
          <div class="hero-stats"><span><strong>{{ offers.length }}</strong> serviços</span><span><strong>{{ providers.length }}</strong> profissionais</span><span><strong>{{ categories.length }}</strong> categorias</span></div>
        </div>
        <div class="hero-art">
          <div class="art-card art-card-main"><span class="avatar avatar-photo" :style="avatarStyle(profileImages.provider)">PR</span><div><strong>Profissionais locais</strong><small>Disponíveis na sua região</small></div><span class="online"></span></div>
          <div class="art-card art-card-price"><small>A partir de</small><strong>{{ offers[0] ? money(offers[0].price) : 'R$ 80' }}</strong></div>
          <div class="art-shape"><span>✓</span></div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div><p class="eyebrow">Explore</p><h2>Serviços para cada necessidade</h2></div>
          <select v-model="categoryFilter"><option value="">Todas as categorias</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option></select>
        </div>
        <div v-if="loading" class="loading-grid"><span v-for="n in 3" :key="n"></span></div>
        <div v-else-if="filteredOffers.length" class="card-grid">
          <article v-for="offer in filteredOffers" :key="offer.id" class="service-card" @click="openOffer(offer)">
            <div class="service-top"><span class="category-pill">{{ offer.category?.name ?? "Serviço local" }}</span><span class="card-arrow">↗</span></div>
            <h3>{{ offer.title }}</h3><p>{{ offer.description }}</p>
            <div class="provider-row"><span class="avatar avatar-photo" :style="avatarStyle(providerAvatar(offer.provider_id))">{{ providerName(offer.provider_id).slice(0, 2).toUpperCase() }}</span><div><strong>{{ providerName(offer.provider_id) }}</strong><small>{{ offer.availability || "Consulte disponibilidade" }}</small></div></div>
            <div class="service-footer"><span>A partir de</span><strong>{{ money(offer.price) }}</strong></div>
          </article>
        </div>
        <div v-else class="empty"><span>⌕</span><h3>Nenhum serviço encontrado</h3><p>Tente outro termo ou categoria.</p></div>
      </section>

      <section class="how"><p class="eyebrow">Como funciona</p><h2>Da busca ao serviço feito</h2><div class="steps"><article><b>01</b><h3>Escolha</h3><p>Encontre o profissional ideal e veja todos os detalhes.</p></article><article><b>02</b><h3>Solicite</h3><p>Conte o que precisa e envie sua solicitação.</p></article><article><b>03</b><h3>Avalie</h3><p>Depois do serviço, compartilhe sua experiência.</p></article></div></section>
    </template>

    <section v-else-if="view === 'login' || view === 'register'" class="auth-page">
      <div class="auth-aside"><p class="eyebrow">ConectaLocal</p><h1>{{ view === 'login' ? 'Bom ter você de volta.' : 'Comece a conectar.' }}</h1><p>Um jeito simples de encontrar oportunidades e resolver necessidades perto de casa.</p></div>
      <form class="form-card" @submit.prevent="submitAuth">
        <div><p class="eyebrow">{{ view === "login" ? "Acessar conta" : "Nova conta" }}</p><h2>{{ view === "login" ? "Entre para continuar" : "Crie sua conta" }}</h2></div>
        <label v-if="view === 'register'">Nome completo<input v-model="authForm.name" required minlength="2" autocomplete="name"></label>
        <label>E-mail<input v-model="authForm.email" required type="email" autocomplete="email"></label>
        <label>Senha<input v-model="authForm.password" required type="password" minlength="6" autocomplete="current-password"></label>
        <fieldset v-if="view === 'register'" class="role-choice"><legend>Quero usar como</legend><label><input v-model="authForm.role" type="radio" value="client"><span><strong>Cliente</strong><small>Quero contratar serviços</small></span></label><label><input v-model="authForm.role" type="radio" value="provider"><span><strong>Prestador</strong><small>Quero oferecer serviços</small></span></label></fieldset>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button class="button button-full" :disabled="busy">{{ busy ? "Aguarde..." : view === "login" ? "Entrar" : "Criar conta" }}</button>
        <p class="form-switch">{{ view === "login" ? "Ainda não tem conta?" : "Já tem uma conta?" }} <RouterLink :to="view === 'login' ? '/cadastro' : '/entrar'">{{ view === "login" ? "Cadastre-se" : "Entrar" }}</RouterLink></p>
      </form>
    </section>

    <section v-else-if="view === 'account'" class="section narrow">
      <div v-if="!session" class="empty"><h2>Entre para acessar sua conta</h2><RouterLink class="button" to="/entrar">Entrar</RouterLink></div>
      <template v-else><div class="page-heading"><p class="eyebrow">Configurações</p><h1>Minha conta</h1><p>Atualize seus dados de acesso.</p></div><form class="form-card plain" @submit.prevent="saveAccount"><label>Nome<input v-model="accountForm.name" required minlength="2"></label><label>E-mail<input v-model="accountForm.email" required type="email"></label><label>Nova senha <small>(opcional)</small><input v-model="accountForm.password" type="password" minlength="6"></label><button class="button" :disabled="busy">Salvar alterações</button></form></template>
    </section>

    <section v-else class="section dashboard">
      <div v-if="!session" class="empty"><h2>Seu painel espera por você</h2><p>Entre para acompanhar seus serviços.</p><RouterLink class="button" to="/entrar">Entrar</RouterLink></div>
      <template v-else>
        <div class="page-heading"><p class="eyebrow">{{ session.user.role === "client" ? "Área do cliente" : "Área profissional" }}</p><h1>Olá, {{ session.user.name.split(" ")[0] }}.</h1><p>{{ session.user.role === "client" ? "Acompanhe suas solicitações e avaliações." : "Gerencie seu perfil, serviços e solicitações." }}</p></div>

        <template v-if="session.user.role === 'provider'">
          <div class="dashboard-grid">
            <form class="form-card plain" @submit.prevent="saveProvider"><div class="form-title"><h2>Perfil profissional</h2><span :class="myProvider ? 'status active' : 'status'">{{ myProvider ? "Ativo" : "Pendente" }}</span></div><label>Sobre você<textarea v-model="providerForm.bio" rows="3" placeholder="Conte sua experiência"></textarea></label><label>Telefone<input v-model="providerForm.phone" placeholder="(00) 00000-0000"></label><label>Disponibilidade<input v-model="providerForm.availability" placeholder="Ex.: Segunda a sexta, 8h às 18h"></label><button class="button" :disabled="busy">Salvar perfil</button></form>
            <form class="form-card plain" @submit.prevent="createCategory"><div class="form-title"><h2>Nova categoria</h2></div><p class="muted">Não encontrou a categoria ideal? Crie uma para o catálogo.</p><label>Nome<input v-model="categoryForm.name" required minlength="2" placeholder="Ex.: Marcenaria"></label><label>Descrição<textarea v-model="categoryForm.description" rows="3"></textarea></label><button class="button button-secondary" :disabled="busy">Criar categoria</button></form>
          </div>
          <form v-if="myProvider" class="form-card plain offer-form" @submit.prevent="saveOffer"><div class="form-title"><h2>{{ editOfferId ? "Editar serviço" : "Novo serviço" }}</h2><button v-if="editOfferId" type="button" class="text-button" @click="clearOfferForm">Cancelar edição</button></div><div class="form-grid"><label>Categoria<select v-model="offerForm.category_id" required><option disabled value="">Selecione</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option></select></label><label>Título<input v-model="offerForm.title" required minlength="2"></label><label>Preço inicial<input v-model="offerForm.price" required type="number" min="0.01" step="0.01"></label><label>Disponibilidade<input v-model="offerForm.availability"></label><label class="span-2">Descrição<textarea v-model="offerForm.description" required rows="3"></textarea></label></div><button class="button" :disabled="busy">Salvar serviço</button></form>
          <div v-if="myProvider" class="panel-section"><div class="section-heading compact"><h2>Meus serviços</h2><span>{{ myOffers.length }} cadastrados</span></div><div class="mini-list"><article v-for="offer in myOffers" :key="offer.id"><div><span class="category-pill">{{ offer.category?.name }}</span><h3>{{ offer.title }}</h3><p>{{ money(offer.price) }}</p></div><button class="button button-ghost" @click="editOffer(offer)">Editar</button></article><div v-if="!myOffers.length" class="empty small"><p>Cadastre seu primeiro serviço acima.</p></div></div></div>
        </template>

        <div class="panel-section"><div class="section-heading compact"><div><h2>{{ session.user.role === "client" ? "Minhas solicitações" : "Solicitações recebidas" }}</h2><p>{{ myRequests.length }} registros</p></div><RouterLink v-if="session.user.role === 'client'" class="button button-secondary" to="/">Encontrar serviço</RouterLink></div>
          <div class="request-list"><article v-for="item in myRequests" :key="item.id" class="request-card"><div class="request-main"><div class="request-party"><span class="avatar avatar-photo" :style="avatarStyle(session.user.role === 'client' ? providerAvatar(item.provider_id) : userAvatar(item.client?.role))">{{ (session.user.role === "client" ? providerName(item.provider_id) : item.client?.name ?? "Cliente").slice(0, 2).toUpperCase() }}</span><div><span class="status" :class="item.status">{{ statusLabel(item.status) }}</span><h3>{{ item.service_offer?.title ?? "Serviço solicitado" }}</h3><p>{{ session.user.role === "client" ? providerName(item.provider_id) : item.client?.name }}</p></div></div><div class="request-meta"><span>{{ date(item.created_at) }}</span><strong>{{ item.service_offer ? money(item.service_offer.price) : "" }}</strong></div></div><p v-if="item.notes" class="request-notes">“{{ item.notes }}”</p><div class="request-actions"><button v-if="session.user.role === 'client' && item.status === 'pending'" class="button button-ghost" @click="setStatus(item, 'canceled')">Cancelar</button><button v-if="session.user.role === 'client' && item.status === 'completed'" class="button button-secondary" @click="openReview(item)">Avaliar serviço</button><button v-if="session.user.role === 'provider' && item.status === 'pending'" class="button" @click="setStatus(item, 'accepted')">Aceitar</button><button v-if="session.user.role === 'provider' && item.status === 'accepted'" class="button" @click="setStatus(item, 'completed')">Marcar como concluído</button></div></article><div v-if="!myRequests.length" class="empty small"><h3>Nenhuma solicitação por enquanto</h3><p>Novos pedidos aparecerão aqui.</p></div></div>
        </div>
      </template>
    </section>

    <div v-if="selectedOffer" class="modal-backdrop" @click.self="selectedOffer = null"><section class="modal"><button class="modal-close" @click="selectedOffer = null">×</button><span class="category-pill">{{ selectedOffer.category?.name }}</span><h2>{{ selectedOffer.title }}</h2><p>{{ selectedOffer.description }}</p><div class="detail-grid"><div class="detail-profile"><span class="avatar avatar-photo" :style="avatarStyle(providerAvatar(selectedOffer.provider_id))">{{ providerName(selectedOffer.provider_id).slice(0, 2).toUpperCase() }}</span><div><small>Profissional</small><strong>{{ providerName(selectedOffer.provider_id) }}</strong></div></div><div><small>Preço inicial</small><strong>{{ money(selectedOffer.price) }}</strong></div><div><small>Disponibilidade</small><strong>{{ selectedOffer.availability || "A combinar" }}</strong></div></div><div class="reviews"><h3>Avaliações</h3><article v-for="review in reviews[selectedOffer.provider_id]" :key="review.id"><span class="stars">{{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}</span><p>{{ review.comment || "Cliente satisfeito com o serviço." }}</p><small>{{ review.client?.name ?? "Cliente" }}</small></article><p v-if="!reviews[selectedOffer.provider_id]?.length" class="muted">Este profissional ainda não possui avaliações.</p></div><template v-if="session?.user.role === 'client'"><label>Conte brevemente o que precisa<textarea v-model="requestNotes" rows="3"></textarea></label><button class="button button-full" :disabled="busy" @click="requestService">Solicitar este serviço</button></template><RouterLink v-else-if="!session" class="button button-full" to="/entrar" @click="selectedOffer = null">Entre para solicitar</RouterLink></section></div>
    <div v-if="reviewTarget" class="modal-backdrop" @click.self="reviewTarget = null"><form class="modal" @submit.prevent="submitReview"><button type="button" class="modal-close" @click="reviewTarget = null">×</button><p class="eyebrow">Sua experiência</p><h2>Avaliar serviço</h2><label>Nota<select v-model="reviewForm.rating"><option v-for="rating in 5" :key="rating" :value="rating">{{ rating }} {{ rating === 1 ? "estrela" : "estrelas" }}</option></select></label><label>Comentário<textarea v-model="reviewForm.comment" rows="4" placeholder="Como foi o serviço?"></textarea></label><button class="button button-full" :disabled="busy">Publicar avaliação</button></form></div>
  </main>
</template>
