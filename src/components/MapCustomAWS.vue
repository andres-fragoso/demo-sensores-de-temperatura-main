<template>
  <div id="app">
    <p class="btn1" @click="toggleText" v-if="!isHomePage">
      {{ treal == false ? "Activar tiempo real" : "Detener tiempo real" }}
    </p> <!-- -->
    <!-- <div id="map" style="height: 500px; width: 100%"></div> -->
    <div id="map" style="width: 100%"></div>
  </div>
  <q-dialog v-model="modalOpen" persistent>
    <q-card class="modal-card">
      <q-card-section class="modal-content">
        <div class="">
          <div class="modal-header">
            <img
              class="modal-icon"
              src="https://cdn-icons-png.flaticon.com/512/709/709806.png"
              alt="Camión"
            />
          </div>
          <div class="modal-titulo">{{ LocacionSeleccionada.NombreTarea }}</div>

          <p class="modal-nota">{{ LocacionSeleccionada.Notas }}</p>
          <!-- <p class="popup-description">${HTMLSensor}</p> -->

          <div
            class="item"
            v-for="(item, index) in LocacionSeleccionada.ListaSensores"
            :key="index"
          >
            <q-card
              :class="{
                cold:
                  item.Temperatura < LocacionSeleccionada.Temperatura_Minima,
                warm:
                  item.Temperatura >= LocacionSeleccionada.Temperatura_Minima &&
                  item.Temperatura <= LocacionSeleccionada.Temperatura_Maxima,
                hot: item.Temperatura > LocacionSeleccionada.Temperatura_Maxima,
              }"
            >
              <q-card-section>
                <div class="item-titulo">Sensor: {{ item.NombreSensor }}</div>

                <div class="item-temperatura">
                  Temperatura: {{ item.Temperatura }} °C
                </div>
                <div class="item-bateria">Bateria: {{ item.Bateria }} %</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- <div class="text-h6">Título del Modal</div>
        <div>Este es el contenido del modal.</div> -->
      </q-card-section>

      <q-card-actions>
        <q-btn @click="modalOpen = false" label="Cerrar" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";
import maplibregl from "maplibre-gl";
import icon1 from "../assets/PointMarket.png";
import SensorHub from "src/utils/SensorHub";

const props = defineProps({
  ubicacion: {
    type: Array,
    required: true,
  },
});

const { ubicacion } = props;

import { tareasApi } from "src/api";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
//APIKEY
const apiKey =
  "v1.public.eyJqdGkiOiJhMTZlYjYzNC0zZWNjLTRiNTItYTA1OC1kNjJjZTVmNWUzNjkifUz1WDp6Yfr7TXixXH3J6nq9VHbwW_pcuMMfwIB-qqW1wHDkj4NFEjDv-zSbavOEtnwpz1PsItUZZzdqZrQ0T7gGZeo167Saiccwhas6Icjl_jV1vwFNtXiTo5CDyxQFpCTSYBHEXb9mspRhbq5MvM4i9120_uB0Ro8T38ZZ-JHoRo-xPSNoLKCjxAwZcq36tMuQTb_NMUytoUxkkgRk1saR-dj0HjymDOeitwESqIq91u_N0t4qzXNJy44S92T0VxPa3Pn4PefiuWbjat3YTg9Q_D-4TAd4Api3X3kCiJTNaNGdUcVb_353S9rXKQYLQ0xV90xM5wHDzNu1w0_1tVQ.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx";
const mapName = "MapaTest2";
const region = "us-east-1";
const markers = ref([]);
const route = useRoute(); // Obtiene la ruta actual
const isHomePage = route.path === "/"; // Compara con la ruta principal
defineOptions({
  name: "MapaCustomAWS",
});

let treal = true;

let map = null;
let _latitud = ref(parseFloat(localStorage.getItem("_lat")) || 0);
let _longitud = ref(parseFloat(localStorage.getItem("_lon")) || 0);
let marker1 = null;

const toggleText = () => {
  treal = !treal;
  // console.log(treal);
};
const places = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        message: "Baz",
        iconSize: [2, 2],
      },
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  ],
};
function onPopupOpen() {
  alert();
  // Aquí puedes añadir más lógica
}
//////////////////////////INICIO FUNCIONES PANTALLA PRINCIPAL////////////////////////
const modalOpen = ref(false); //modal //
let LocacionSeleccionada = ref({});
let locaciones = [];
let openPopup = null; // Para almacenar el popup abierto
let openMarker = null; // Para almacenar el marcador que tiene el popup abierto
//FUNCION PARA AGREGAR LOS PUNTOS EN EL MAPA
function addMarkers(puntos) {
  if (markers.value) {
    markers.value.forEach((marker) => marker.remove());
  }

  puntos.forEach((point) => {
    if ((point.Longitud == null) & (point.Latitud == null)) {
    } else {
      //Local Shipping
      //Local Fire Department//Batery Std//Batery 3 bar//Batery 5 Bar

      let HTMLSensor = ``;
      // VALIDAMOS QUE LA TAREA TENGA SENSORES
      if (point.Sensores) {
        //DESERIALIZAMOS LOS SENSORES LIGADOS A LA TAREA
        const sensores = JSON.parse(point.Sensores);
        // console.log(JSON.parse(point.Sensores));
        sensores.forEach((sensor) => {
          const color = ref("");
          const icon = ref("");
          //  // contendrá informacion de los sensores y será inyectado
          if (sensor.Temperatura < point.Temperatura_Minima) {
            color.value = "#3294ff"; // Frío
            icon.value = "icecream";
          } else if (
            sensor.Temperatura >= point.Temperatura_Minima &&
            sensor.Temperatura < point.Temperatura_Maxima
          ) {
            color.value = "#4aa452"; // Templado
            icon.value = "done outline";
          } else {
            color.value = "#ff6b6b"; // Caliente
            icon.value = "whatshot";
            // icon.value='Sick';
          }

          HTMLSensor += `<div style="border: 2px solid ${color.value};padding: 10px;margin: 10px;border-radius: 15px;background: radial-gradient(circle, #ffffff 40%, ${color.value} 250%)""><p><div class="popup-temperature">Sensor: ${sensor.NombreSensor}</div></p>
                       <p><div class="popup-temperature"><font style="color:${color.value}">Temperatura:<strong> ${sensor.Temperatura} °C</strong></font></div></p>
                       <p class="popup-battery">Batería: <strong>${sensor.Bateria}%</strong></p>`;
          HTMLSensor += `</div>`;
        });
      }
      const popupContent = `
          <div class="popup-content">
            <div class="popup-header">
              <img src="https://cdn-icons-png.flaticon.com/512/709/709806.png" alt="Camión" class="popup-icon" />
            </div>
            <h2 class="popup-title">${point.NombreTarea}</h2>
            <p class="popup-description">${point.Notas}</p>
             <p class="popup-description">${HTMLSensor}</p>


          </div>
        `;
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${icon1})`;
      el.style.width = `2vw`;
      el.style.height = `2vw`;
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.Longitud, point.Latitud])
        .setPopup(new maplibregl.Popup({ offset: 25 }))
        .addTo(map);

      if (modalOpen.value) {
        if (LocacionSeleccionada.value.Id == point.Id) {
          LocacionSeleccionada.value = point;

          LocacionSeleccionada.value.ListaSensores = JSON.parse(point.Sensores);
        }
      }
      marker.getElement().addEventListener("click", () => {
        LocacionSeleccionada.value = point;
        LocacionSeleccionada.value.ListaSensores = JSON.parse(point.Sensores);
        modalOpen.value = true;
      });
      markers.value.push(marker); // Almacenar el marcador en el arreglo
    }
  });
}

//// ACTUALIZA LOS PUNNTOS EN EL MAPA AL CARGARLOS NUEVAMENTE
function updatePoints(newPoints) {
  addMarkers(newPoints);
  // markers.value.forEach((marker) => marker.remove());
  // markers.value = []; // Reiniciar el array de marcadores

  // newPoints.forEach((point) => {});
}

function updatePoints2(newPoints) {
  locaciones = newPoints; // Actualizar los puntos con los nuevos datos
  locaciones.forEach((locacion, index) => {
    // Si el marcador ya existe, actualizar su posición
    if ((locacion.Longitud == null) & (locacion.Latitud == null)) {
    } else {
      //DESERIALIZAMOS LOS SENSORES LIGADOS A LA TAREA
      const sensores = JSON.parse(locacion.Sensores);
      let HTMLSensor = ``;
      /// si la tarea tiene sensores va a enlistar los sensores diponibles
      if (sensores) {
        // console.log(sensores);
        sensores.forEach((sensor) => {
          const color = ref("");
          const icon = ref("");
          //
          if (sensor.Temperatura < locacion.Temperatura_Minima) {
            color.value = "#3294ff"; // Frío
            icon.value = "icecream";
          } else if (
            sensor.Temperatura >= locacion.Temperatura_Minima &&
            sensor.Temperatura < locacion.Temperatura_Maxima
          ) {
            color.value = "#4aa452"; // Templado
            icon.value = "done outline";
          } else {
            color.value = "#ff6b6b"; // Caliente
            icon.value = "whatshot";
            // icon.value='Sick';
          }

          HTMLSensor += `<div style="border: 2px solid ${color.value};padding: 10px;margin: 10px;border-radius: 15px;background: radial-gradient(circle, #ffffff 40%, ${color.value} 250%)""><p><div class="popup-temperature">Sensor: ${sensor.NombreSensor}</div></p>
                       <p><div class="popup-temperature"><font style="color:${color.value}">Temperatura:<strong> ${sensor.Temperatura} °C</strong></font></div></p>
                       <p class="popup-battery">Batería: <strong>${sensor.Bateria}%</strong></p>

                       `;
          HTMLSensor += `</div>`;
        });
      }
      const popupContent = `
          <div class="popup-content">
            <div class="popup-header">
              <img src="https://cdn-icons-png.flaticon.com/512/709/709806.png" alt="Camión" class="popup-icon" />
            </div>
            <h2 class="popup-title">${locacion.NombreTarea}</h2>
            <p class="popup-description">${locacion.Notas}</p>
             <p class="popup-description">${HTMLSensor}</p>
          </div>
        `;

      if (markers[index]) {
        markers[index].setLngLat([locacion.Longitud, locacion.Latitud]);
        markers[index].getPopup();

        if (LocacionSeleccionada.value) {
          if (LocacionSeleccionada.value.Id == locacion.Id) {
            LocacionSeleccionada.value = locacion;
            LocacionSeleccionada.value.ListaSensores = JSON.parse(
              locacion.Sensores
            );
          }
        }

        // Si el popup está abierto en este marcador, mantenerlo abierto
        if (markers[index].getPopup().isOpen()) {
          // openPopup.setHTML(popupContent); // Actualizar la descripción
          // openPopup = markers[index].getPopup(); // Mantener la referencia al popup abierto
          //markers[index].getPopup().addTo(map); // Asegurarse de que el popup permanezca abierto
        }
      } else {
        // Si no existe, crear un nuevo marcador
        const newMarker = new maplibregl.Marker()
          .setLngLat([locacion.Longitud, locacion.Latitud])
          .setPopup(new maplibregl.Popup().setHTML(popupContent))
          .addTo(map); // Asegúrate de tener la referencia al mapa
        // Almacenar el nuevo marcador
        markers.value.push(newMarker);
      }
    }
  });

  // Si hay más marcadores que locaciones, eliminarlos
  if (markers.value.length > locaciones.length) {
    markers.value.slice(locaciones.length).forEach((marker) => {
      marker.remove(); // Eliminar el marcador del mapa
    });
    markers.value = markers.value.slice(0, locaciones.length); // Ajustar el array de marcadores
  }
}

////OBTIENE LAS TAREAS EN LA PANTALLA PRINCIPAL
const getTareas = () => {
  return tareasApi
    .tareasIndex(0)
    .then((resp) => {
      // Verifica si la respuesta es exitosa
      if (!resp.exito) {
        return null; // Devuelve null o cualquier valor que quieras
      }
      return resp; // Devuelve la respuesta completa si es exitosa
    })
    .catch((error) => {
      console.error("Error al obtener tareas:", error);
      return null; // Manejo de errores, puedes devolver un valor diferente si lo deseas
    });
};

//Carga el mapa en la pantalla principal
const pantallaPrincipal = async () => {
  //OBTENEMOS LA LOCALIZACION
  // NO PROCEDE SI NO HAY UBICACION ACTUAL
  getCurrentLocation((location) => {
    // AL TRAER LAS TAREAS COMIENA A MARCAR EL MAPA
    getTareas().then((resultado) => {
      if (resultado) {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          map = new maplibregl.Map({
            container: "map",
            style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
            center: [location.longitude, location.latitude], // Longitud y latitud inicial
            //  center: [-110.960287, 29.080444],// Longitud y latitud inicial
            zoom: 12,
          });
          // Crear un control personalizado (dropdown)
          class CustomDropdown {
            onAdd(map) {
              this.map = map;
              this.container = document.createElement("div");
              this.container.className = "custom-dropdown";

              const select = document.createElement("select");
              select.innerHTML = `
                    <option value="">Selecciona una ciudad</option>
                    <option value="newyork">Nueva York</option>
                    <option value="losangeles">Los Ángeles</option>
                    <option value="chicago">Chicago</option>
                `;

              select.onchange = (e) => {
                const value = e.target.value;
                let coords;
                switch (value) {
                  case "newyork":
                    coords = [-74.006, 40.7128];
                    break;
                  case "losangeles":
                    coords = [-118.2437, 34.0522];
                    break;
                  case "chicago":
                    coords = [-87.6298, 41.8781];
                    break;
                  default:
                    return;
                }
                this.map.flyTo({
                  center: coords,
                  essential: true, // `essential: true` para animaciones
                });
                select.value = ""; // Resetear el dropdown
              };

              this.container.appendChild(select);
              return this.container;
            }

            onRemove() {
              this.container.parentNode.removeChild(this.container);
              this.map = undefined;
            }
          }

          // Instanciar y agregar el control personalizado al mapa
          //const customDropdown = new CustomDropdown();
          // map.addControl(customDropdown);
          //       map.addControl(customDropdown, "top-left");
          //   const customControl = new CustomControl();
          // map.addControl(customControl,"top-left");
          //map.addControl(new maplibregl.navigator('<button>boton</button>'), "top-left");
          map.addControl(new maplibregl.NavigationControl(), "top-left");
          map.addControl(new maplibregl.GeolocateControl(), "top-left");

          addMarkers(resultado.payload);
        } else {
          console.log("Map container not found!");
        }
        console.log("Tareas cargadas:", resultado);
      } else {
        console.log("No se pudieron cargar las tareas.");
      }
    });
    //FIN getTareas
    // setInterval(() => {
    //   getTareas().then((resultado) => {
    //     updatePoints(resultado.payload);
    //   });
    // }, 5000);
    //  setInterval(() => {

    //  }, 5000);
      SensorHub.client.on("ObtenerSensor", async function () {
        getTareas().then((resultado) => {
            updatePoints(resultado.payload);
        });
    });
      SensorHub.client.on("ObtenerLatLon", async function () {
        getTareas().then((resultado) => {
            updatePoints(resultado.payload);
        });
    });

    // Actualiza cada 5 segundos
  });
};
//FUNCION PARA OBTENER LA UBICACION
function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        callback(location); // Llamar a la función de callback con la ubicación
      },
      (error) => {
        alert(getErrorMessage(error.code));
      }
    );
  } else {
    alert("La geolocalización no es soportada por este navegador.");
  }
}
//FUNCION ERROR DE UBICACION
function getErrorMessage(code) {
  switch (code) {
    case 1:
      return "Permiso denegado por el usuario.";
    case 2:
      return "Posición no disponible.";
    case 3:
      return "Tiempo de espera excedido.";
    default:
      return "Error desconocido.";
  }
}
//////////////////////////FIN FUNCIONES PANTALLA PRINCIPAL////////////////////////
onMounted(async () => {
  // validacion para cargar el mapa en la pantalla principal
  if (isHomePage) {
    //se ejecuta la funcion por primera vez

    await pantallaPrincipal();
    //se detienen los procesos que no son de la pantalla principal
    return false;
  }
  // const mapElement = document.getElementById("map");
  // if (mapElement) {
  // }

  await cargarMapa();
  await funcionLocalizacion(_latitud.value, _longitud.value);
  actualizarPosicionConSignalR();
});
// Almacenar el marcador

// Función para cargar el mapa
async function cargarMapa() {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    const apiKey =
      "v1.public.eyJqdGkiOiJhMTZlYjYzNC0zZWNjLTRiNTItYTA1OC1kNjJjZTVmNWUzNjkifUz1WDp6Yfr7TXixXH3J6nq9VHbwW_pcuMMfwIB-qqW1wHDkj4NFEjDv-zSbavOEtnwpz1PsItUZZzdqZrQ0T7gGZeo167Saiccwhas6Icjl_jV1vwFNtXiTo5CDyxQFpCTSYBHEXb9mspRhbq5MvM4i9120_uB0Ro8T38ZZ-JHoRo-xPSNoLKCjxAwZcq36tMuQTb_NMUytoUxkkgRk1saR-dj0HjymDOeitwESqIq91u_N0t4qzXNJy44S92T0VxPa3Pn4PefiuWbjat3YTg9Q_D-4TAd4Api3X3kCiJTNaNGdUcVb_353S9rXKQYLQ0xV90xM5wHDzNu1w0_1tVQ.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx";
    const mapName = "MapaTest2";
    const region = "us-east-1";

    map = new maplibregl.Map({
      container: "map",
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [_longitud.value, _latitud.value],
      zoom: 13,
    });

    map.on("style.load", () => {
      map.addControl(new maplibregl.NavigationControl(), "top-right");
    });

    map.on("error", (e) => {
      console.error("Map error:", e);
    });
  } else {
     console.log("Map container not found!");
  }
}

// Función para actualizar la localización en el mapa
async function funcionLocalizacion(lat, lon) {
  if (map) {
    if (!marker1) {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${icon1})`;
      el.style.width = "30px";
      el.style.height = "30px";

      // Crear el marcador inicial
      marker1 = new maplibregl.Marker({ element: el })
        .setLngLat([lon, lat])
        .addTo(map);
    } else {
      // Si ya existe un marcador, moverlo a la nueva posición
      marker1.setLngLat([lon, lat]);
    }

    // Centrar el mapa en la nueva localización
    map.panTo([lon, lat]);
  }
}

// Función para manejar el evento de SignalR
async function actualizarPosicionConSignalR() {
  SensorHub.client.on("ObtenerLatLon", async function () {
      var arr = await tareasApi.tareaId(ubicacion.Id);
      _latitud.value = arr.payload[0].Latitud;
      _longitud.value = arr.payload[0].Longitud;
      localStorage.setItem("_lat", arr.payload[0].Latitud);
      localStorage.setItem("_lon", arr.payload[0].Longitud);
      await funcionLocalizacion(arr.payload[0].Latitud, arr.payload[0].Longitud);
  });
}


// onMounted(async () => {
//   // Posición inicial
//   console.log(localStorage.getItem("_lat"));
//   // props.ubicacion.map(item => {
//   //    _latitud.value=item.Latitud;
//   //    _longitud.value=item.Longitud;
//   // })
//   await cargarMapa();
//   await funcionLocalizacion(_latitud.value, _longitud.value);
//   actualizarPosicionConSignalR();
// });
</script>

<style>
#app {
  height: 55vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btn1 {
  cursor: pointer;
  color: blue;
}
.marker {
  display: block;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  background-size: cover;
  background-position: center;
  background-color: white;
}

.popup-container {
  max-width: 200px;

  padding: 10px;
  background-color: #fff;
  border: 3px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
/* estilo popup pantalla principal */

.item {
  padding-bottom: 10px;
}
.item-temperatura,
.item-bateria {
  margin: 5px 0;
  font-size: 10px;
  text-align: center; /* Centra el texto */
}
.item-titulo {
  margin: 5px 0;
  font-size: 12px;
  text-align: center; /* Centra el texto */
}
.popup-header {
  display: flex;
  justify-content: center;
}
/* //boton custom del mapa */
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.modal-icon {
  width: 30px; /* Ajusta el tamaño del icono */
  height: 30px;
}

.modal-titulo {
  margin: 0 0 5px;
  font-size: 14px;
  color: #333;
  text-align: center; /* Centra el texto */ /* Centra el texto */
}

.modal-nota {
  margin: 0 0 10px;
  font-size: 110x;
  color: #666;
  text-align: center; /* Centra el texto */
}

.cold {
  border: 2px solid #3294ff;
  background: radial-gradient(circle, #ffffff 40%, #3294ff 250%);
}

.warm {
  border: 2px solid #4aa452;
  background: radial-gradient(circle, #ffffff 40%, #4aa452 250%);
}

.hot {
  border: 2px solid #ff6b6b;
  background: radial-gradient(circle, #ffffff 40%, #ff6b6b 250%);
}
.modal-card {
  width: 90vw; /* 90% del ancho de la ventana */
  max-width: 600px; /* Ancho máximo */
  height: auto; /* Altura automática */
  max-height: 80vh; /* Altura máxima */
  display: flex;
  flex-direction: column;
}

.modal-content {
  overflow-y: auto; /* Desplazamiento vertical para el contenido */
  flex: 1; /* Permitir que el contenido ocupe el espacio disponible */
  padding: 16px; /* Espaciado interno */
}

.inner-card {
  margin: 16px 0; /* Espacio entre el card anidado y el resto del contenido */
}

.inner-content {
  display: flex;
  flex-direction: column; /* Coloca el contenido en columna */
  align-items: center; /* Centra horizontalmente */
  justify-content: center; /* Centra verticalmente */
  text-align: center; /* Alinea el texto al centro */
  padding: 16px; /* Espaciado interno */
}
@media (max-width: 600px) {
  .modal-card {
    width: 95vw; /* Aumentar el ancho en pantallas pequeñas */
  }

  .inner-card {
    margin: 10px 0; /* Reducir el margen en pantallas pequeñas */
  }
}
</style>
