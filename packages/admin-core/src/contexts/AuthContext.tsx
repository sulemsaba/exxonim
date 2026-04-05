import type { PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { clearAuthSession, setAuthSession, subscribeAuthSession } from "../lib/authSession";
import { getAuthSession } from "../lib/authSession";
import { getAdminMe, loginAdmin } from "../services/adminAuthService";
import type { ApiAdminUser } from "../types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  admin: ApiAdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAdminProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
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

  const permissions = session.admin?.permissions ?? [];

  async function refreshAdminProfile() {
    const { accessToken } = getAuthSession();

    if (!accessToken) {
      return;
    }

    const admin = await getAdminMe();
    setAuthSession({
      ...getAuthSession(),
      admin,
    });
  }

  async function login(credentials: LoginCredentials) {
    const response = await loginAdmin(credentials);

    setAuthSession({
      admin: response.admin,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    });

    try {
      await refreshAdminProfile();
    } catch {
      // Keep the login usable even if the profile refresh fails.
    }
  }

  function logout() {
    clearAuthSession();
  }

  function hasPermission(permission: string) {
    return permissions.includes(permission);
  }

  function hasAnyPermission(...permissionValues: string[]) {
    return permissionValues.some((permission) => hasPermission(permission));
  }

  useEffect(() => {
    if (!session.accessToken) {
      return;
    }

    if ((session.admin?.permissions?.length ?? 0) > 0) {
      return;
    }

    void refreshAdminProfile().catch(() => {
      // Ignore initial profile refresh failures; route guards still rely on token presence.
    });
  }, [session.accessToken, session.admin?.id, session.admin?.permissions?.length]);

  return (
    <AuthContext.Provider
      value={{
        admin: session.admin,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        permissions,
        isAuthenticated: Boolean(session.admin && session.accessToken),
        login,
        logout,
        refreshAdminProfile,
        hasPermission,
        hasAnyPermission,
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
