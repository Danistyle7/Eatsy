/**
 * Estado de autenticación persistido (se guarda en SecureStore)
 * @property {string | null} token - JWT de acceso
 * @property {boolean} isLoading - Flag de carga inicial
 */
export type PersistedAuthState = {
  token: string | null;
  isLoading: boolean;
};

export interface AuthState extends PersistedAuthState {
  initialize: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AUTH_TOKEN_KEY = "auth_token";
