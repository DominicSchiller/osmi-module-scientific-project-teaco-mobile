import {APIConfig, Environment} from "./environment.definition";

/**
 * The  development mode environment settings.
 */
export const ENV: Environment = {
  mode: "Development Mode",
  api: {
    baseURL: "http://localhost:3000/api/"
  } as APIConfig
};
