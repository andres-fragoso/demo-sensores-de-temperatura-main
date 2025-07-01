import { HubConnectionBuilder } from "@aspnet/signalr";

class SensorHub {
  constructor() {
    this.client = new HubConnectionBuilder()
     .withUrl("https://apipage.grupocubits.com/Hubs/Sensor")
    //.withUrl("https://localhost:7285/Hubs/Sensor")
    .build();
  }

  start() {
    this.client
      .start()
      .then(function () {
        console.log("Conectado en tiempo real");
      })
      .catch(function (err) {
        console.error("Error al conectar a SignalR:", err.toString());
      });
  }
}

export default new SensorHub();
