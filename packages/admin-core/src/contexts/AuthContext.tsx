import type { PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  clearAuthSession,
  getAuthSession,
  markAuthSessionHydrated,
  setAuthSession,
  subscribeAuthSession,
} from "../lib/authSession";
import { getAdminMe, loginAdmin, logoutAdmin } from "../services/adminAuthService";
import type { ApiAdminUser } from "../types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  admin: ApiAdminUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getServerSnapshot() {
  return {
    admin: null,
    hydrated: false,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const session = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSession,
    getServerSnapshot
  );
  const hydrationAttemptedRef = useRef(false);

  const permissions = session.admin?.permissions ?? [];

  async function refreshAdminProfile() {
    const admin = await getAdminMe();
    setAuthSession({
      admin,
      hydrated: true,
    });
  }

  async function login(credentials: LoginCredentials) {
    const response = await loginAdmin(credentials);

    setAuthSession({
      admin: response.admin,
      hydrated: true,
    });

    try {
      await refreshAdminProfile();
    } catch {
      // Keep the login usable even if the profile refresh fails.
    }
  }

  async function logout() {
    try {
      await logoutAdmin();
    } finally {
      clearAuthSession();
    }
  }

  function hasPermission(permission: string) {
    return permissions.includes(permission);
  }

  function hasAnyPermission(...permissionValues: string[]) {
    return permissionValues.some((permission) => hasPermission(permission));
  }

  useEffect(() => {
    if (hydrationAttemptedRef.current) {
      return;
    }

    hydrationAttemptedRef.current = true;

    void refreshAdminProfile().catch(() => {
      markAuthSessionHydrated();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin: session.admin,
        permissions,
        isAuthenticated: Boolean(session.admin),
        isHydrating: !session.hydrated,
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
