<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useSplashStore } from './stores/useSplashStore';

  const splashStore = useSplashStore();

  onMounted(() => {
    splashStore.setRendered();
  });
</script>

<template>
  <div>
    <SplashScreen />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
