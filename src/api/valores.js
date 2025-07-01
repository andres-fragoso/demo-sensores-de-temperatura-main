import { api } from "boot/axios";
import * as httpErrorCatcher from "src/utils/httpErrorCatcher.js";
import * as httpSuccessCatcher from "src/utils/httpSuccessCatcher.js";

export const listarBySensorFecha = async (idSensor, idTarea) => {
  try {
    //console.log("Entro a la peticion");
    console.log(idSensor, idTarea);

    const resp = await api.get(`/valor_sensorFecha`, {
      params: {
        _sensor: idSensor,
        _tarea: idTarea,
      },
    });
    if (resp) {
      console.log(resp);
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    console.log(err);
    return httpErrorCatcher.catchError(err);
  }
};

export const verUltimoByIdTarea = async (idSensor, idTarea) => {
  try {
    //  console.log("Entro a la peticion");

    const resp = await api.get(`/ultimoValor_sensorTarea`, {
      params: {
        _sensor: idSensor,
        _tarea: idTarea,
      },
    });
    if (resp) {
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
export const agregarvalor = async (tarea) => {
  try {
    const resp = await api.post(`/agregar_valor`,tarea,{
      headers: {
        'Content-Type': 'application/json', // Especificar el tipo de contenido
      }
    });
      if (resp) {
        return httpSuccessCatcher.catchSuccess(resp.data);
      }
    } catch (err) {
      return httpErrorCatcher.catchError(err);
    }
};
