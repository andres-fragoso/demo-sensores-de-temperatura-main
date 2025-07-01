<template>
  <q-page class="flex-center">
    <div class="row items-center">
      <div class="col-12 justify-center text-center text-weight-bold">
        <q-tab-panel name="mapa">
          <mapa-custom-a-w-s />
        </q-tab-panel>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapaCustom from "src/components/MapCustom.vue";
import MapaCustomAWS from "src/components/MapCustomAWS.vue";

defineOptions({
  name: "IndexPage",
});

</script>


