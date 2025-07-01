<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <q-card>
          <q-card-section class="bg-primary text-center text-white">
            <span class="text-size-26 text-weight-medium">{{
              $t("Transportes")
            }}</span>
          </q-card-section>

          <q-card class="bg-fondo">
            <q-card-section>
              <div class="row text-left">
                <div class="col-12">
                  <q-btn color="positive" @click="mostrarCrearDialog">
                    <q-icon left name="fa fa-circle-plus" size="xs" />
                    {{ $t("Crear Transporte") }}
                  </q-btn>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-pa-md">
                <q-table
                  :rows="rows"
                  :columns="columns"
                  row-key="name"
                  selection="multiple"
                  v-model:selected="selected"
                  :filter="filter"
                  grid
                  hide-header
                  :loading="CargandoTareas"
                >
                  <template v-slot:top-right>
                    <q-input
                      borderless
                      dense
                      debounce="300"
                      v-model="filter"
                      placeholder="Search"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>

                  <template v-slot:item="props">
                    <div
                      class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    >
                      <q-card
                        bordered
                        flat
                        :class="
                          props.selected
                            ? $q.dark.isActive
                              ? 'bg-grey-9'
                              : 'bg-grey-2'
                            : ''
                        "
                      >
                        <q-card-section class="bg-light-blue-4 text-white">
                          <div class="row items-center no-wrap">
                            <div class="col-auto q-pr-md">
                              <q-icon name="fire_truck" size="180%"></q-icon>
                            </div>
                            <div class="col">
                              <div class="text-h6">{{ props.row.Nombre }}</div>
                              <!-- <div class="text-subtitle2">by John Doe</div> -->
                            </div>

                            <div class="col-auto">
                              <q-btn color="white" round flat icon="more_vert">
                                <q-menu cover auto-close>
                                  <q-list>
                                    <q-item
                                      clickable
                                      @click="onRowClick(props.row)"
                                    >
                                      <q-item-section avatar>
                                        <q-icon color="green" name="sensors" />
                                      </q-item-section>
                                      <q-item-section
                                        >Dispositivos conectados</q-item-section
                                      >

                                      <q-item-section side>
                                        <q-icon
                                          name="chevron_right"
                                          color="gray"
                                        />
                                      </q-item-section>
                                    </q-item>
                                    <q-item clickable  @click="mostrarCrearDialog(props.row,editar=true)">
                                      <q-item-section avatar>
                                        <q-icon color="primary" name="edit" />
                                      </q-item-section>
                                      <q-item-section>Editar</q-item-section>

                                      <q-item-section side>
                                        <q-icon
                                          name="chevron_right"
                                          color="gray"
                                        />
                                      </q-item-section>
                                    </q-item>
                                    <q-item clickable>
                                      <q-item-section avatar>
                                        <q-icon
                                          color="negative"
                                          name="delete"
                                        />
                                      </q-item-section>
                                      <q-item-section>Eliminar</q-item-section>

                                      <q-item-section side>
                                        <q-icon
                                          name="chevron_right"
                                          color="gray"
                                        />
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </div>
                          </div>
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                          <q-item
                            v-for="col in props.cols.filter(
                              (col) => col.name !== 'nombre'
                            )"
                            :key="col.name"
                          >
                            <q-item-section>
                              <q-item-label>
                                <q-icon
                                  name="device_thermostat"
                                  v-if="col.name == 'Temp'"
                                />
                                {{ col.label }} </q-item-label
                              >
                            </q-item-section>
                            <q-item-section class="width50" side>
                              <q-item-label caption>{{
                                col.value
                              }} </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </div>
            </q-card-section>
            <!-- Tabla que contiene todos los roles. Falta realizar la logica de seleccion -->
          </q-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, createApp } from "vue";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useQuasar, QSpinnerGears } from "quasar";
import CustomFormDialog from "src/components/CustomFormDialog.vue";
import VerDetallesTrasporteDialog from "src/pages/Trasportes/Componets/VerDetallesTrasporteDialog.vue";
import NuevaTareaDialog from "src/pages/Trasportes/Componets/TareaDialog.vue";
import { tareasApi } from "src/api";
import { store } from "quasar/wrappers";
import SensorHub from "src/utils/SensorHub";
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
});
defineOptions({
  name: "TrasportesPage",
});
const $q = useQuasar();

const filter = ref("");
const CargandoTareas = ref(false);

const columns = [
  // {
  //   name: "desc",
  //   required: true,
  //   label: "Dessert (100g serving)",
  //   align: "left",
  //   field: (row) => row.name,
  //   format: (val) => `${val}`,
  //   sortable: true,
  // },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.Nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "notas",
    align: "center",
    label: "Notas",
    field: "Notas",
    sortable: true,
  },
  {
    name: "Temp",
    label: "Maxima",
    field: "Temperatura_Maxima",
    sortable: true,
  },
  { name: "Temp", label: "Minima", field: "Temperatura_Minima" },
];

const rows = ref([]);

const ObtenerTareas = async () => {
  CargandoTareas.value = true;

  const resp = await tareasApi.listar();
  CargandoTareas.value = false;
  if (!resp.exito) {
    rows.value = [];
    return;
  }
  // console.log(resp);
  rows.value = resp.payload;
};




const onRowClickTarea = (row) => {
  // console.log("Row: ", row);

  $q.dialog({
    component: CustomFormDialog,
    componentProps: {
      formularioComponent: NuevaTareaDialog,
      formularioComponentProps: {
        tarea: row,
      },
    },
  });
};

const mostrarCrearDialog3 = (row,editar=false) => {
   console.log("Row: ", row);
  $q.dialog({
    component: CustomFormDialog,
    componentProps: {
      formularioComponent: NuevaTareaDialog,
      formularioComponentProps: {
        tarea: row,
        editar:editar
      },
    },
  });
};



const onRowClick = (row) => {
  // console.log("Row: ", row);

  $q.dialog({
    component: CustomFormDialog,
    componentProps: {
      formularioComponent: VerDetallesTrasporteDialog,
      formularioComponentProps: {
        tarea: row,
      },
    },
  },);

};


const mostrarCrearDialog = (row,editar=false) => {
   console.log("Row: ", row);
  $q.dialog({
    component: CustomFormDialog,
    componentProps: {
      formularioComponent: NuevaTareaDialog,
      formularioComponentProps: {
        tarea: row,
        editar:editar
      },
    },
  })
  .onCancel(() => {
    //al cerrar el modal se actualiza el listado
     ObtenerTareas();
  })







};



function dialogClosed(result) {
alert()
}

function executeSomeLogic(result) {
  console.log('L�gica ejecutada despu�s de cerrar el di�logo con resultado:', result);
}


onMounted(async () => {
  await ObtenerTareas();
  // SensorHub.start();
  SensorHub.client.on("ObtenerDatos", async function() {
    await ObtenerTareas();
  })
});
</script>

<style>
.width50{
  width: 80%;
}
</style>
