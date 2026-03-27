import type { PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";
import { clearAuthSession, setAuthSession, subscribeAuthSession } from "../lib/authSession";
import { getAuthSession } from "../lib/authSession";
import { loginAdmin } from "../services/adminAuthService";
import type { ApiAdminUser } from "../types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  admin: ApiAdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getServerSnapshot() {
  return {
    admin: null,
    accessToken: null,
    refreshToken: null,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const session = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSession,
    getServerSnapshot
  );

  async function login(credentials: LoginCredentials) {
    const response = await loginAdmin(credentials);

    setAuthSession({
      admin: response.admin,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    });
  }

  function logout() {
    clearAuthSession();
  }

  return (
    <AuthContext.Provider
      value={{
        admin: session.admin,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isAuthenticated: Boolean(session.admin && session.accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
