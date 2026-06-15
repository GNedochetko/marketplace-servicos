<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { loadSession, saveSession } from "./api";

const router = useRouter();
const session = ref(loadSession());
const installEvent = ref<Event | null>(null);
const installed = ref(window.matchMedia("(display-mode: standalone)").matches);
const menuOpen = ref(false);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installEvent.value = event;
});
window.addEventListener("appinstalled", () => {
  installed.value = true;
  installEvent.value = null;
});

function updateSession(value: ReturnType<typeof loadSession>) {
  session.value = value;
  saveSession(value);
}

function logout() {
  updateSession(null);
  router.push("/");
}

async function installApp() {
  const event = installEvent.value as Event & { prompt?: () => Promise<void> };
  await event?.prompt?.();
}
</script>

<template>
  <header class="site-header">
    <div class="nav-wrap">
      <RouterLink class="brand" to="/" @click="menuOpen = false">
        <span class="brand-mark">CL</span>
        <span>Conecta<span>Local</span></span>
      </RouterLink>
      <button class="menu-button" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>
      <nav :class="{ open: menuOpen }" @click="menuOpen = false">
        <RouterLink to="/">Serviços</RouterLink>
        <button v-if="installEvent && !installed" class="nav-install" @click="installApp">Instalar app</button>
        <template v-if="session">
          <RouterLink to="/painel">Meu painel</RouterLink>
          <RouterLink to="/conta">Conta</RouterLink>
          <button class="nav-logout" @click="logout">Sair</button>
        </template>
        <template v-else>
          <RouterLink to="/entrar">Entrar</RouterLink>
          <RouterLink class="button button-small" to="/cadastro">Criar conta</RouterLink>
        </template>
      </nav>
    </div>
  </header>
  <RouterView :session="session" @session="updateSession" />
  <footer>
    <div>
      <RouterLink class="brand brand-footer" to="/">
        <span class="brand-mark">CL</span>
        <span>Conecta<span>Local</span></span>
      </RouterLink>
      <p>Serviços de confiança, perto de você.</p>
    </div>
    <p>Projeto acadêmico de Engenharia de Software II.</p>
  </footer>
</template>
