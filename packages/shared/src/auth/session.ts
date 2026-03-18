import type { ApiAdminUser } from "../contracts/auth";

export interface AuthSessionState {
  admin: ApiAdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

type AuthSessionListener = () => void;

const AUTH_SESSION_STORAGE_KEY = "exxonim-admin-auth-session";

function emptyAuthSession(): AuthSessionState {
  return {
    admin: null,
    accessToken: null,
    refreshToken: null,
  };
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeAuthSession(value: unknown): AuthSessionState {
  if (!value || typeof value !== "object") {
    return emptyAuthSession();
  }

  const candidate = value as Partial<AuthSessionState>;

  return {
    admin:
      candidate.admin && typeof candidate.admin === "object"
        ? (candidate.admin as ApiAdminUser)
        : null,
    accessToken:
      typeof candidate.accessToken === "string" ? candidate.accessToken : null,
    refreshToken:
      typeof candidate.refreshToken === "string" ? candidate.refreshToken : null,
  };
}

function readPersistedAuthSession() {
  if (!isBrowser()) {
    return emptyAuthSession();
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!rawValue) {
      return emptyAuthSession();
    }

    return normalizeAuthSession(JSON.parse(rawValue));
  } catch {
    return emptyAuthSession();
  }
}

function writePersistedAuthSession(state: AuthSessionState) {
  if (!isBrowser()) {
    return;
  }

  try {
    if (!state.admin && !state.accessToken && !state.refreshToken) {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures and keep the in-memory session usable.
  }
}

let authSessionState: AuthSessionState = emptyAuthSession();
let hasHydratedAuthSession = false;

function ensureHydratedAuthSession() {
  if (hasHydratedAuthSession) {
    return;
  }

  authSessionState = readPersistedAuthSession();
  hasHydratedAuthSession = true;
}

function getCurrentAuthSession() {
  ensureHydratedAuthSession();
  return authSessionState;
}

const listeners = new Set<AuthSessionListener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getAuthSession() {
  return getCurrentAuthSession();
}

export function setAuthSession(nextState: AuthSessionState) {
  ensureHydratedAuthSession();
  authSessionState = nextState;
  writePersistedAuthSession(nextState);
  emitChange();
}

export function updateAuthSession(partialState: Partial<AuthSessionState>) {
  setAuthSession({
    ...getCurrentAuthSession(),
    ...partialState,
  });
}

export function clearAuthSession() {
  setAuthSession(emptyAuthSession());
}

export function subscribeAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
