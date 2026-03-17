import type { ApiAdminUser } from "../contracts/auth";

export interface AuthSessionState {
  admin: ApiAdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

type AuthSessionListener = () => void;

let authSessionState: AuthSessionState = {
  admin: null,
  accessToken: null,
  refreshToken: null,
};

const listeners = new Set<AuthSessionListener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getAuthSession() {
  return authSessionState;
}

export function setAuthSession(nextState: AuthSessionState) {
  authSessionState = nextState;
  emitChange();
}

export function updateAuthSession(partialState: Partial<AuthSessionState>) {
  setAuthSession({
    ...authSessionState,
    ...partialState,
  });
}

export function clearAuthSession() {
  setAuthSession({
    admin: null,
    accessToken: null,
    refreshToken: null,
  });
}

export function subscribeAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
