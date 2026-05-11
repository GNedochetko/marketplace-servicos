<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
</script>

<template>
  <main class="shell">
    <section class="panel">
      <p class="eyebrow">Trabalho ES2</p>
      <h1>Frontend Vue 3 + Vite</h1>
      <p>
        Aplicacao pronta para conversar com o backend em
        <code>{{ apiUrl }}</code>.
      </p>
    </section>
  </main>
</template>
