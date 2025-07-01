import { LocationClient } from '@aws-sdk/client-location';
import { SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

// Configura tus credenciales de AWS
// const client = new LocationClient({
//   region: 'us-east-1', // Cambia esto a tu región de AWS
//   credentials: {
//     accessKeyId: 'UserTest1',
//     secretAccessKey: 'OwB105=&',
//   },
// });

const client = new LocationClient({
    region: 'us-east-1', // Cambia esto a tu región de AWS
    credentials: {
      accessKeyId: 'AKIA4MTWLGE5MDRIFLOL',
      secretAccessKey: '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',
    },
  });
// const client = new LocationClient({
//   region: 'us-east-1', // Cambia esto a tu región de AWS
//   credentials: {
//     accessKeyId: 'ASIA4MTWLGE5EIEELKSG',
//     secretAccessKey: 'U4bFhX0ICIE/lTmNt/RfDSzn4QcQ/fMe2v2LJOkO',
//   },
// });

export default client;

 
