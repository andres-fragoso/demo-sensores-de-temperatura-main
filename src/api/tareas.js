import { api } from "boot/axios";
import * as httpErrorCatcher from "src/utils/httpErrorCatcher.js";
import * as httpSuccessCatcher from "src/utils/httpSuccessCatcher.js";

export const listar = async () => {
  try {
    // console.log("Entro a la peticion");

    const resp = await api.get(`/tareas`);
    if (resp) {
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
export const agregartarea = async (tarea) => {
  try {
    const resp = await api.post(`/agregar_tarea`, tarea, {
      headers: {
        "Content-Type": "application/json", // Especificar el tipo de contenido
      },
    });
    if (resp) {
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};

export const editar = async (tarea) => {
  try {
    const resp = await api.post(`/editar_tarea`, tarea, {
      headers: {
        "Content-Type": "application/json", // Especificar el tipo de contenido
      },
    });
    if (resp) {
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
export const tareasIndex = async (limite) => {
  try {
    console.log("Entro a la peticion");

    const resp = await api.get(`/Tareas_Porlimite`, {
      params: {
        _limite: limite,
      },
    });
    if (resp) {
      console.log(resp);
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
export const tareaId = async (id) => {
  try {
    console.log("Entro a la peticion");

    const resp = await api.get(`/tarea_id`, {
      params: {
        _id: id,
      },
    });
    if (resp) {
      console.log(resp);
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
