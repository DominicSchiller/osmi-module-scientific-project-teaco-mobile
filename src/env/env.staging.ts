import {APIConfig, Environment} from "./environment.definition";

/**
 * The staging mode environment settings.
 */
export const ENV: Environment = {
    mode: "Staging Mode",
    api: {
        baseURL: "http://teaco6.th-brandenburg.de:3000/api/"
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
