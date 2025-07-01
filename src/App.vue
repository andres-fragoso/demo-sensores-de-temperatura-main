<template>
  <router-view />
</template>

<script setup>
import {onMounted } from "vue";
import SensorHub from "src/utils/SensorHub";

defineOptions({
  name: "App",
});

onMounted(async () => {
  SensorHub.start();
});
</script>
