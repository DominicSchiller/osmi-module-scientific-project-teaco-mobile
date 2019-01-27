/**
 * Defines the environment configuration model.
 */
export interface Environment {
  mode: string;
  api: APIConfig;
  firebase: FirebaseConfig;
}

/**
 * Defines the environment's API configuration model.
 */
export interface APIConfig {
  baseURL: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}
