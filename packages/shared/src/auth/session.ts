import type { ApiAdminUser } from "../contracts/auth";

export interface AuthSessionState {
  admin: ApiAdminUser | null;
  hydrated: boolean;
}

type AuthSessionListener = () => void;

function emptyAuthSession(): AuthSessionState {
  return {
    admin: null,
    hydrated: false,
  };
}

let authSessionState: AuthSessionState = emptyAuthSession();

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
    ...getAuthSession(),
    ...partialState,
  });
}

export function markAuthSessionHydrated() {
  updateAuthSession({ hydrated: true });
}

export function clearAuthSession() {
  setAuthSession({
    admin: null,
    hydrated: true,
  });
}

export function resetAuthSession() {
  setAuthSession(emptyAuthSession());
}

export function subscribeAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
