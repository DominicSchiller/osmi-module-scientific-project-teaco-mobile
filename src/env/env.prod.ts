import {APIConfig, Environment} from "./environment.definition";

/**
 * The production mode environment settings.
 */
export const ENV: Environment = {
  mode: "Production Mode",
  api: {
    baseURL: "no production endpoint specified"
  } as APIConfig
};
