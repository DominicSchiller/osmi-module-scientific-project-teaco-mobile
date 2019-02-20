import {APIConfig, Environment} from "./environment.definition";

/**
 * The  development mode environment settings.
 */
export const ENV: Environment = {
  mode: "Development Mode",
  api: {
    baseURL: "http://localhost:3000/api/"
  },
  firebase: {
    apiKey: "AIzaSyDN9yDCSL-GgQegw85oclpQgDwRe68PiwU",
    authDomain: "teaco-thb.firebaseapp.com",
    databaseURL: "https://teaco-thb.firebaseio.com",
    projectId: "teaco-thb",
    storageBucket: "teaco-thb.appspot.com",
    messagingSenderId: "422344910128"
  }
};
