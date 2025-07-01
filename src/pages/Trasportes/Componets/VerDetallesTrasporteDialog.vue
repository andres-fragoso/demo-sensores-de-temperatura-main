<template>
  <q-card style="min-width: 70%">
    <q-card-section class="text-center">
      <span class="text-h5 text-uppercase text-weight-bold text-grey-8">{{
        "Detalles Transporte"
      }}</span>
    </q-card-section>

    <q-card-section>
      <q-tabs
        v-model="tab"
        narrow-indicator
        class="bg-grey-2"
        dense
        @update:model-value="onTabChange(tab)"
        align="justify"
      >
        <q-tab class="text-orange" name="general" icon="info" label="General" />
        <q-tab
          class="text-green"
          name="sensores"
          icon="sensors"
          label="Sensores"
        />
        <q-tab class="text-cyan" name="mapa" icon="map" label="Mapa" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <div class="text-h6">Información General</div>
          <q-card class="my-card text-grey-8 text-weight-medium">
            <q-card-section>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Nombre:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Nombre ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Notas:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Notas ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Temperatura Maxima:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Temperatura_Maxima
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Temperatura Minima:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Temperatura_Minima ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Segundos Intervalo:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Segundos_Interval ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Minutos Intervalo:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Minutos_Interval ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Segundos Maximos:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Segundos_Maximo ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Segundos Minimos:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Segundos_Minimo ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Minutos Maximos:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Minutos_Maximo ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{ "Minutos Minimos:" }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      tarea.Minutos_Minimo ?? "Sin Dato"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="sensores">
          <cargando v-if="CargandoSensores" />
          <no-data v-if="NoHayDatos" />

          <div v-show="!NoHayDatos">
            <q-carousel
              v-model="slide"
              swipeable
              animated
              control-type="flat"
              control-color="primary"
              navigation
              padding
              arrows
              @update:model-value="onSlideChange(slide)"
              class="text-grey-8 rounded-borders"
            >
              <!-- <div v-for="item in items" :key="item.Id">
                {{ item }}
              </div> -->
              <q-carousel-slide
                v-for="item in SensoresAsignado"
                :key="item.Id"
                :name="item.IdSensor"
              >
                <div class="column no-wrap flex-center">
                  <div>
                    <q-icon name="sensors" size="50px" color="green-5" />
                    <span class="q-pl-md text-weight-bold text-uppercase">{{
                      item.Nombre
                    }}</span>
                  </div>
                </div>
                <div class="q-mt-md">
                  <q-card class="my-card">
                    <q-card-section>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-weight-medium">{{
                              "Estatus:"
                            }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{
                              item.Estado
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-weight-medium">{{
                              "BaterÍa:"
                            }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption
                              >{{ item.Bateria }}%</q-item-label
                            >
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-weight-medium">{{
                              "Ultima Actualización:"
                            }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{
                              date.formatDate(
                                item.UltimaActualizacion,
                                "DD MMMM YYYY - HH:MM:SS"
                              )
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="column no-wrap flex-center">
                  <div class="q-pt-md">
                    <q-icon
                      name="device_thermostat"
                      size="46px"
                      color="red-5"
                    />
                    <span class="q-pl-md text-weight-bold text-uppercase"
                      >Registro Temperatura (24 HORAS)</span
                    >
                  </div>
                </div>
                <div class="q-mt-md row justify-center" v-if="dataSensor.length > 0">
                  <grafica-lineal :data="dataSensor" />
                </div>
                <div v-else>
                  No se encontraron valores.
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </q-tab-panel>

        <q-tab-panel name="mapa">
          <mapa-custom-a-w-s :ubicacion="tarea" />
          <!-- {{ UltimaDataSensor }} -->
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <!-- <q-btn flat label="Cancel" color="primary" @click="cancel" /> -->
      <q-btn flat label="Aceptar" color="primary" @click="confirm" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import MapaCustom from "src/components/MapCustom.vue";
import MapaCustomAWS from "src/components/MapCustomAWS.vue";
import GraficaLineal from "src/components/GraficaLineal.vue";
import GraficaCalor from "src/components/GraficaCalor.vue";
import { sensoresApi, valoresApi } from "src/api";
import { useQuasar, date, QSpinnerGears, LocalStorage } from "quasar";
import Cargando from "src/components/CargandoComponent.vue";
import NoData from "src/components/NoDataComponent.vue";
import SensorHub from "src/utils/SensorHub";
defineOptions({
  name: "VerDetallesTrasporteDialog",
});

const props = defineProps({
  propsCustomForm: {
    type: Object,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {
      tarea: {},
    },
  },
});

const {
  propsCustomForm: { tarea },
} = props;

const $q = useQuasar();

// console.log("Tarea: ", tarea);
const slide = ref("style");

const emit = defineEmits(["ok", "onDialogCancel"]);
const CargandoSensores = ref(false);
const NoHayDatos = ref(false);
const SensoresAsignado = ref([]);
const dataSensor = ref([]);
const UltimaDataSensor = ref([]);
const tabActual = ref("");

const confirm = () => {
  emit("onDialogCancel");
};

const cancel = () => {
  emit("onDialogCancel");
};

const tab = ref("general");

const onTabChange = async (newTab) => {
  tabActual.value = newTab;
  console.log("Tab cambiado:", tabActual.value);
  if (newTab === "sensores") {
    // Acción a ejecutar cuando se cambia al Tab mapa
    if(slide.value!=="style"){
      await onSlideChange(slide.value);
    }else{
      await ObtenerSensores();
    }
  } else if (newTab === "mapa") {
    // Acción a ejecutar cuando se cambia al Tab mapa
    await ObtenerUltimoRegistro();
  }
};

const onSlideChange = async (newSlide) => {
  //console.log("Slide cambiado:", newSlide);
  await ObtenerValoresSensor(newSlide);
};

const ObtenerUltimoRegistro = async () => {
  const resp = await sensoresApi.listarByTarea(tarea.IdTarea);
  if (!resp.exito) {
    SensoresAsignado.value = [];
    return;
  }
  SensoresAsignado.value = resp.payload;
  const resp2 = await valoresApi.verUltimoByIdTarea(
    SensoresAsignado.value[0].IdSensor,
    tarea.IdTarea
  );
  if (!resp2.exito) {
    UltimaDataSensor.value = [];
    return;
  }
  const nuevoArray = resp2.payload.map((obj) => ({
    ...obj, // Copia todos los otros campos
    Fecha: new Date(obj.Fecha), // Convierte 'fecha' a Date
  }));
  UltimaDataSensor.value = nuevoArray;
  //console.log(nuevoArray);
  localStorage.setItem("_lat", UltimaDataSensor.value[0].Latitud);
  localStorage.setItem("_lon", UltimaDataSensor.value[0].Longitud);
};

const ObtenerSensores = async () => {
  CargandoSensores.value = true;
  const resp = await sensoresApi.listarByTarea(tarea.IdTarea);
  CargandoSensores.value = false;
  if (!resp.exito) {
    SensoresAsignado.value = [];
    NoHayDatos.value = true;
    return;
  }
  SensoresAsignado.value = resp.payload;
  await ObtenerValoresSensor(SensoresAsignado.value[0].IdSensor);
  if(slide.value == "style"){
    slide.value = SensoresAsignado.value[0].IdSensor;
  }
  NoHayDatos.value = false;
};

const ObtenerValoresSensor = async (idSensor) => {
  CargandoSensores.value = true;
  const resp = await valoresApi.listarBySensorFecha(idSensor, tarea.IdTarea);
  //console.log(resp)
  CargandoSensores.value = false;
  if (!resp.exito) {
    dataSensor.value = [];
    return;
  }
  // Convertir el campo 'fecha' de String a Date
  const nuevoArray = resp.payload.map((obj) => ({
    ...obj, // Copia todos los otros campos
    Fecha: new Date(obj.Fecha), // Convierte 'fecha' a Date
  }));
  dataSensor.value = nuevoArray;
  // slide.value = dataSensor.value[0].IdSensor;
};

// const MostrarCargando = () => {
//   $q.loading.show({
//     spinner: QSpinnerGears,
//     spinnerColor: "red",
//     messageColor: "black",
//     backgroundColor: "yellow",
//     message: "Updated message",
//   });
// };

// const OcultarCargando = () => {
//   $q.loading.hide();
// };

onMounted(async () => {
  //   construirMapa();
      localStorage.setItem("_lat", tarea.Latitud);
      localStorage.setItem("_lon", tarea.Longitud);
        SensorHub.client.on("ObtenerRegistros", async function () {
          // SensoresAsignado.value = [];
          // NoHayDatos.value = null;
          // UltimaDataSensor.value = [];
          // await onTabChange(tabActual.value);
          await onSlideChange(slide.value);
        });
        SensorHub.client.on("ObtenerSensor", async function () {
          await ObtenerSensores();
          await onSlideChange(slide.value);
        });
});

</script>
