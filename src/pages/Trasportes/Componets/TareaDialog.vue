<template>
  <q-card style="min-width: 60%; min-height: 60%">
    <q-card-section class="text-center">
      <span
        class="text-h5 text-uppercase"
        v-if="!props.propsCustomForm.editar"
        >{{ "Nuevo" }}</span
      >
      <span
        class="text-h5 text-uppercase"
        v-if="props.propsCustomForm.editar"
        >{{ "Actualizar" }}</span
      >
    </q-card-section>

    <div class="q-pa-md">
      <div class="q-gutter-md text-h8">
        <div class="form-row">
          <q-container>
            <q-row>
              <form></form>

              <q-form
                @submit.prevent="Capturar"
                class="q-gutter-xs col-xs-12 col-sm-12 col-md-6"
              >
                <div class="form-group row">
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Nombre"
                      type="text"
                      dense
                      label="Nombre"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5"></div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Minutos_Interval"
                      min="0"
                      type="number"
                      label="Minutos Intervalos"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Segundos_Interval"
                      min="0"
                      type="number"
                      label="Segundos Intervalos"
                    />
                  </div>
                </div>

                <div class="form-group row">
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Temperatura_Minima"
                      type="number"
                      label="Temperatura Minima"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Temperatura_Maxima"
                      type="number"
                      label="Temperatura Maxima"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Minutos_Minimo"
                      min="0"
                      type="number"
                      label="Minutos Minimos"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Segundos_Minimo"
                      min="0"
                      type="number"
                      label="Segundos Minimos"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Minutos_Maximo"
                      min="0"
                      type="number"
                      label="Minutos Maximos"
                    />
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5">
                    <q-input
                      v-model="tareaForm.Segundos_Maximo"
                      min="0"
                      type="number"
                      label="Segundos Maximos"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <q-input
                      v-model="tareaForm.Notas"
                      type="textarea"
                      dense
                      label="Notas"
                    />
                  </div>
                </div>

                <!-- <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.Fecha"  label="Fecha" type="date"/>
              </div>
              <div class="col-sm-2"></div>

            </div> -->

                <br />
                <q-separator />
                <br />
                <div class="form-group row">
                  <div class="col-sm-8"></div>
                  <div class="col-sm-2">
                    <q-btn label="Guardar" color="primary" type="submit" />
                  </div>

                  <div class="col-sm-2">
                    <q-btn
                      label="Cancelar"
                      type="button"
                      @click="Limpiar"
                      color="amber"
                    />
                  </div>
                </div>
              </q-form>
            </q-row>
          </q-container>
        </div>
      </div>
    </div>

    <q-separator />
  </q-card>
</template>
<script setup>
import { ref, onMounted, defineProps } from "vue";
import { tareasApi } from "src/api";
import { object, type } from "@amcharts/amcharts5";
import { Notify } from "quasar";
// se via el mensaje, color de alerta y el icono de la alerta
// notify('algo salió mal','red','error');
//notify('advertencia','orange','warning');
//notify('muy bien','green','check_circle');
defineOptions({
  name: "NuevaTareaDialog",
});
const props = defineProps({
  propsCustomForm: {
    tarea: {
      type: object,
      // Verifica si la prop es obligatoria
      default: () => {}, // Evita errores si no se pasa el prop
    },
    editar: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
});

const emit = defineEmits(["ok", "onDialogCancel"]);

const tareaForm = ref({
  Id: 0,
  IdTarea: "",
  Nombre: "",
  Notas: "",
  Minutos_Interval: 0,
  Segundos_Interval: 0,
  Temperatura_Minima: 0,
  Temperatura_Maxima: 0,
  Minutos_Minimo: 0,
  Segundos_Minimo: 0,
  Minutos_Maximo: 0,
  Segundos_Maximo: 0,
});

//limpiamos el formulario el formulario
const Limpiar = () => {
  tareaForm.value = {
    Id: 0,
    IdTarea: "",
    Nombre: "",
    Notas: "",
    Minutos_Interval: 0,
    Segundos_Interval: 0,
    Temperatura_Minima: 0,
    Temperatura_Maxima: 0,
    Minutos_Minimo: 0,
    Segundos_Minimo: 0,
    Minutos_Maximo: 0,
    Segundos_Maximo: 0,
  };
  emit("onDialogCancel");
};

//capturar el formulario
const Capturar = () => {
  // Verifica si tareaForm está definido
  // Validación manual
  if (!tareaForm.value.Nombre) {
    notify("El nombre es obligatorio.", "orange", "warning");
    return;
  }

  if (
    tareaForm.value.Minutos_Interval < 0 ||
    tareaForm.value.Minutos_Interval == undefined
  ) {
    notify(
      "ingrese un valor que sea valido en minutos intervalos",
      "orange",
      "warning"
    );

    return;
  }
  if (
    tareaForm.value.Segundos_Interval < 0 ||
    tareaForm.value.Segundos_Interval == undefined
  ) {
    notify(
      "ingrese un valor que sea valido en segundos intervalos",
      "orange",
      "warning"
    );

    return;
  }
  if (
    tareaForm.value.Temperatura_Minima === "" ||
    tareaForm.value.Temperatura_Minima == undefined
  ) {
    notify("La temperatura mínima es obligatoria.", "orange", "warning");
    return;
  }
  if (
    tareaForm.value.Temperatura_Maxima === "" ||
    tareaForm.value.Temperatura_Maxima == undefined
  ) {
    notify("La temperatura máxima es obligatoria.", "orange", "warning");
    return;
  }
  // validar que los intervalos no sean negativos
  if (
    tareaForm.value.Minutos_Minimo < 0 ||
    tareaForm.value.Minutos_Minimo == undefined
  ) {
    notify("Los minutos minimos no pueden ser negativos.", "orange", "warning");
    return;
  }
  if (
    tareaForm.value.Segundos_Minimo < 0 ||
    tareaForm.value.Segundos_Minimo == undefined
  ) {
    notify(
      "Los segundos maximos no pueden ser negativos.",
      "orange",
      "warning"
    );
    return;
  }
  if (
    tareaForm.value.Minutos_Maximo < 0 ||
    tareaForm.value.Minutos_Maximo == undefined
  ) {
    notify("Los minutos Maximos no pueden ser negativos.", "orange", "warning");
    return;
  }
  if (
    tareaForm.value.Segundos_Maximo < 0 ||
    tareaForm.value.Segundos_Maximo == undefined
  ) {
    notify(
      "Los segundos de maximos no pueden ser negativos.",
      "orange",
      "warning"
    );

    return;
  }
  if (!props.propsCustomForm.editar) {
    agregar();
  } else {
    editar();
  }
};
const agregar = async () => {
  const jsonString = JSON.stringify(tareaForm.value);
  const resp = await tareasApi.agregartarea(jsonString);
  if (!resp.exito) {
    notify(`Error: ${resp.statusCode} ${resp.payload}`, "red", "error");
    //rows.value = [];
    return;
  }
  notify(`Guardado `, "green", "check_circle");
  Limpiar();
  // notify(`Datos enviados: ${data.message}`,'green','check_circle');
  console.log(resp);
  //rows.value = resp.payload;
};
const editar = async () => {
  const jsonString = JSON.stringify(tareaForm.value);
  const resp = await tareasApi.editar(jsonString);
  if (!resp.exito) {
    notify(`Error: ${resp.statusCode} ${resp.payload}`, "red", "error");
    //rows.value = [];
    return;
  }
  notify(`Actualizado `, "green", "check_circle");
  Limpiar();
  // notify(`Datos enviados: ${data.message}`,'green','check_circle');

  //rows.value = resp.payload;
};
const notify = (mensaje, color, icono) => {
  Notify.create({
    color: color,
    textColor: "white",
    icon: icono,
    message: mensaje,
    position: "top",
    classes: "custom-notify",
    timeout: 3000, // Tiempo en milisegundos antes de que se cierre
  });
};

onMounted(() => {
  if (!props.propsCustomForm.editar) {
    console.log("props");
    console.log(props.propsCustomForm.editar);
  } else {
    console.log("tarea");
    console.log(props.propsCustomForm.tarea);
    tareaForm.value = props.propsCustomForm.tarea;
    // CargarEditar(props.propsCustomForm.tarea);
  }
});
const dialog = ref(false);

const showDialog = () => {
  dialog.value = true;
};
</script>
