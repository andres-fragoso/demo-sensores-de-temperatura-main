<template>


    <q-card style="min-width: 60%; min-height: 60%">
      <q-card-section class="text-center">
        <span class="text-h5 text-uppercase">{{ "Nueva Tarea" }}</span>
      </q-card-section>


        <div class="q-pa-md">
    <div class="q-gutter-md text-h8" >
        <div class="form-row">
          <q-container>
         <q-row>
          <form>


</form>
    <q-form ref="tareaForm" @submit="Capturar" @reset="Limpiar"  class="q-gutter-xs col-xs-12 col-sm-12 col-md-6">

              <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.nombre"  type="text" dense label="Nombre"/>
                  <q-input v-model="tareaForm.id"  style="display: none;"  :disabled="isDisabled" type="number"  label="Id"/>
              </div>
              <div class="col-sm-2"></div>
            <div class="col-sm-5">

              </div>
          </div>
          <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.minutosIntervalos" min="0" type="number" label="Minutos Intervalos" />
              </div>
              <div class="col-sm-2"></div>
            <div class="col-sm-5">
              <q-input v-model="tareaForm.segundosIntervalos" min="0" type="number" label="Segundos Intervalos" />
              </div>
          </div>

          <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.temperaturaMinima"  type="number" label="Temperatura Minima" />
              </div>
              <div class="col-sm-2"></div>
            <div class="col-sm-5">
              <q-input v-model="tareaForm.temperaturaMaxima"  type="number" label="Temperatura Maxima" />
              </div>
          </div>
          <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.minutosMinimos" min="0"  type="number" label="Minutos Minimos" />
              </div>
              <div class="col-sm-2"></div>
            <div class="col-sm-5">
              <q-input v-model="tareaForm.segundosMinimos" min="0" type="number" label="Segundos Minimos" />
              </div>
          </div>
          <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.minutosMaximos" min="0" type="number" label="Minutos Maximos" />
              </div>
              <div class="col-sm-2"></div>
            <div class="col-sm-5">
              <q-input v-model="tareaForm.segundosMaximos" min="0" type="number" label="Segundos Maximos" />
              </div>
          </div>
          <div class="form-group row">
                <div class="col-sm-12">
                  <q-input v-model="tareaForm.notas"   type="textarea" dense label="Notas"/>
              </div>
          </div>

          <div class="form-group row">
                <div class="col-sm-5">
                  <q-input v-model="tareaForm.fecha"  label="Fecha" type="date"/>
              </div>
              <div class="col-sm-2"></div>

            </div>


            <div class="form-group row">
              <div class="col-sm-8"></div>
                <div class="col-sm-2">
                  <q-btn label="Guardar" color="primary" type="submit"  />
              </div>

            <div class="col-sm-2">
              <q-btn label="Cancelar" type="reset" color="amber"  />

              </div>
          </div>









    </q-form>
  </q-row>
  </q-container>
</div>
    </div>
  </div>

        <q-separator />



        <q-dialog v-model="dialog" persistent>
          <q-card>
            <q-card-section  class="text-center">
              {{ responseMessage }}
            </q-card-section>
            <q-card-actions  align="center">
              <q-btn label="OK" color="secondary" @click="dialog = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>


    </q-card>
  </template>
  <style>
  .custom-notify {
    font-size: 20px; /* Ajusta el tamaño de la letra aquí */
  }
  </style>
  <script  setup>
 import { ref, onMounted,defineProps  } from "vue";
 import axios from 'axios';
 const name = ref('');
 const responseMessage = ref('');
 import { Notify } from 'quasar';
 defineOptions({
  name: "NuevaTareaDialog",
});

 const emit = defineEmits(["ok", "onDialogCancel"]);

const confirm = () => {
  emit("ok");
};

const cancel = () => {

};
const date = new Date();

const tareaForm = ref({
   id:0,
   nombre:'',
   notas:'',
   fecha: date.toISOString().split('T')[0],
   minutosIntervalos:'',
   segundosIntervalos:'',
   temperaturaMinima:'',
   temperaturaMaxima:'',
   minutosMinimos:'',
   segundosMinimos:'',
   minutosMaximos:'',
   segundosMaximos:'',

});

//limpiamos el formulario el formulario
const Limpiar =() =>{
  tareaForm.value={
   id:0,
   nombre:'',
   notas:'',
   fecha: date.toISOString().split('T')[0],
   minutosIntervalos:'',
   segundosIntervalos:'',
   temperaturaMinima:'',
   temperaturaMaxima:'',
   minutosMinimos:'',
   segundosMinimos:'',
   minutosMaximos:'',
   segundosMaximos:'',
  }
  emit("onDialogCancel");
  // se via el mensaje, color de alerta y el icono de la alerta
  // notify('algo salió mal','red','error');
  //notify('advertencia','orange','warning');
  //notify('muy bien','green','check_circle');
  //showDialog()


}
const CargarTarea =() =>{
  tareaForm.value={
   id:0,
   nombre:'1',
   notas:'2',
   fecha: date.toISOString().split('T')[0],
   minutosIntervalos:'3',
   segundosIntervalos:'4',
   temperaturaMinima:'5',
   temperaturaMaxima:'6',
   minutosMinimos:'7',
   segundosMinimos:'8',
   minutosMaximos:'9',
   segundosMaximos:'10',
  }

  // se via el mensaje, color de alerta y el icono de la alerta
  // notify('algo salió mal','red','error');
  //notify('advertencia','orange','warning');
  //notify('muy bien','green','check_circle');
  //showDialog()


}

//capturar el formulario
const Capturar =() =>{
  // Verifica si tareaForm está definido


            // Validación manual
                if (!tareaForm.value.nombre) {
                  notify('El nombre es obligatorio.','orange','warning');
                    return;
                  }

                  if (!tareaForm.value.fecha) {
                    notify('La fecha es obligatoria.','orange','warning');
                    return;
                  }
                  if (tareaForm.value.minutosIntervalos < 0|| tareaForm.value.minutosIntervalos==undefined) {
                    notify('Los minutos de intervalos no pueden ser negativos.','orange','warning');

                    return;
                  }
                  if (tareaForm.value.segundosIntervalos < 0||tareaForm.value.segundosIntervalos==undefined) {
                    notify('Los segundos de intervalos no pueden ser negativos.','orange','warning');

                    return;
                  }
                  if (tareaForm.value.temperaturaMinima === ''||tareaForm.value.temperaturaMinima==undefined) {
                    notify('La temperatura mínima es obligatoria.','orange','warning');
                    return;
                  }
                  if (tareaForm.value.temperaturaMaxima === ''||tareaForm.value.temperaturaMaxima==undefined) {
                    notify('La temperatura máxima es obligatoria.','orange','warning');
                    return;
                  }
                  // validar que los intervalos no sean negativos
                  if (tareaForm.value.minutosMinimos < 0||tareaForm.value.minutosMinimos==undefined) {
                    notify('Los minutos minimos no pueden ser negativos.','orange','warning');

                    return;
                  }
                  if (tareaForm.value.segundosMinimos < 0||tareaForm.value.segundosMinimos==undefined) {
                    notify('Los segundos maximos no pueden ser negativos.','orange','warning');
                    return;
                  }
                  if (tareaForm.value.minutosMaximos < 0|| tareaForm.value.minutosMaximos==undefined) {
                    notify('Los minutos Maximos no pueden ser negativos.','orange','warning');

                    return;
                  }
                  if (tareaForm.value.segundosMaximos < 0||tareaForm.value.segundosMaximos==undefined ) {
                    notify('Los segundos de maximos no pueden ser negativos.','orange','warning');

                    return;
                  }
                  submitData()

}
const submitDatas = async () => {
  console.log(tarea.value)
}

const submitData = async () => {
  try {
    console.log(JSON.stringify(tareaForm.value))
    const response = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tareaForm.value)
    });

    if (!response.ok) {
      notify(`Error: ${response.status} ${response.statusText}`,'red','error');
    // throw new Error(`Error: ${response.status} ${response.statusText}`);

    }

    const data = await response.json();
    notify(`Datos enviados: ${data.message}`,'green','check_circle');
   // responseMessage.value = `Datos enviados: ${data.message}`;
  } catch (error) {
    notify(`Error: ${error.message}`,'red','error');

  }
};


//iniciar la fecha
const cargarFecha =() =>{

  tareaForm.value={
   fecha: date.toISOString().split('T')[0],
  }
}

const notify=(mensaje,color,icono)=>{

  Notify.create({
    color: color,
    textColor: 'white',
    icon: icono,
    message: mensaje,
    position:'top',
    classes:'custom-notify',
    timeout: 3000, // Tiempo en milisegundos antes de que se cierre
  });
};
//const props = defineProps({dataProps: Object,           // Datos adicionales
//});


const props = defineProps(['formularioComponentProps']);
//const props = defineProps({['text']});
//const props = defineProps(['formularioComponentProps']);
//const props = defineProps(['componentProps']);
//console.log('Props en el diálogo:', props); // Verifica aquí

//const props = defineProps(['componentProps']);

//const formData = ref({ props.formularioComponentProps.row }  );
onMounted(() => {
  cargarFecha();
  CargarTarea()

console.log('props');
  console.log(props);
});
const dialog = ref(false);

  const showDialog = () => {
    dialog.value = true;
  };

  </script>
