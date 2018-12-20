/**
 * Defines the environment configuration model.
 */
export interface Environment {
  mode: string;
  api: APIConfig
}

/**
 * Defines the environment's API configuration model.
 */
export interface APIConfig {
  baseURL: string
}
