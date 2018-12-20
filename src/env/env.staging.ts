import {APIConfig, Environment} from "./environment.definition";

/**
 * The staging mode environment settings.
 */
export const ENV: Environment = {
    mode: "Staging Mode",
    api: {
        baseURL: "http://teaco6.th-brandenburg.de:3000/api/"
    } as APIConfig
};
