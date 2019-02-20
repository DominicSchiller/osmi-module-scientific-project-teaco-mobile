import {APIConfig, Environment} from "./environment.definition";

/**
 * The production mode environment settings.
 */
export const ENV: Environment = {
  mode: "Production Mode",
  api: {
    baseURL: "no production endpoint specified"
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
