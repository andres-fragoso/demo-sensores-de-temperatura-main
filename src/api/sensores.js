import { api } from "boot/axios";
import * as httpErrorCatcher from "src/utils/httpErrorCatcher.js";
import * as httpSuccessCatcher from "src/utils/httpSuccessCatcher.js";

export const listarByTarea = async (idTarea) => {
  try {
    // console.log("Entro a la peticion");

    const resp = await api.get(`/sensor_idTarea`, {
      params: {
        _idTarea: idTarea,
      },
    });
    if (resp) {
      return httpSuccessCatcher.catchSuccess(resp.data);
    }
  } catch (err) {
    return httpErrorCatcher.catchError(err);
  }
};
