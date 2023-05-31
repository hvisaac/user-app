// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: "http://localhost:3000",
  firebaseConfig: {
    apiKey: "AIzaSyCi4w9Qi38heWpWUKoiLdqaG8CPwvt7oBY",
    authDomain: "app-municipio-navojoa.firebaseapp.com",
    projectId: "app-municipio-navojoa",
    storageBucket: "app-municipio-navojoa.appspot.com",
    messagingSenderId: "189270838107",
    appId: "1:189270838107:web:fe727a910892977e5e287e",
    measurementId: "G-4JKQXGPCPH"
  },
  firebasePath: 'debug'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
