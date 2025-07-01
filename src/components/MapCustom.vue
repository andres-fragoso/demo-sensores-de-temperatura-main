<template>
  <div id="app">
    <div id="map" style="height: 420px; width: 100%"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
defineOptions({
  name: "MapaCustom",
});

let map;

// Crear un nuevo ícono con la imagen del carrito
const carritoIcon = L.icon({
  iconUrl: "src/assets/PointMarket.png", // Cambia esta URL a la de tu imagen de carrito
  iconSize: [30, 30], // Ajusta el tamaño del ícono según la imagen
  iconAnchor: [25, 50], // Punto en el ícono que apunta a la ubicación (en este caso, el centro inferior)
  popupAnchor: [0, -50], // Punto desde donde emerge el popup
});

onMounted(() => {
  // Asegúrate de que el contenedor del mapa exista antes de inicializar Leaflet
  // console.log("Elemento: ");
  const mapElement = document.getElementById("map");
  // console.log("Elemento: ", mapElement);

  if (mapElement) {
    // Crear el mapa solo cuando el contenedor está presente
    map = L.map("map").setView([51.505, -0.09], 13);

    // Añadir el tile layer de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Crear un marcador en la posición inicial
    const marker = L.marker([51.505, -0.09], { icon: carritoIcon })
      .addTo(map)
      .bindPopup("Marcador en movimiento")
      .openPopup();

    // Mover el marcador
    let lat = 29.059;
    let lng = -110.97;
    setInterval(() => {
      lat += 0.001; // Movimiento al norte
      lng += 0.001; // Movimiento al este
      marker.setLatLng([lat, lng]); // Actualiza la posición del marcador
      map.panTo([lat, lng]); // Centrar el mapa en la nueva posición
    }, 1000);
  } else {
    console.error("Map container not found!");
  }
});
</script>

<style>
#app {
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
