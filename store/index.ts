import { combineReducers, configureStore } from "@reduxjs/toolkit";

import type { ThemeMode, UserProfile } from "../types";
import { appReducer, createInitialAppState, type AppState } from "./slices/appSlice";

export const HOSPITAL_STORE_KEY = "mediora-hospital-dashboard:v1";

type PersistedAppState = Pick<
  AppState,
  | "patients"
  | "doctors"
  | "appointments"
  | "beds"
  | "medicines"
  | "invoices"
  | "notifications"
  | "authUser"
  | "isAuthenticated"
  | "theme"
>;

interface PersistedStoreEnvelope {
  version: 1;
  app: PersistedAppState;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const loadPersistedAppState = (): AppState | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const serialized = window.localStorage.getItem(HOSPITAL_STORE_KEY);
    if (!serialized) return undefined;

    const envelope: unknown = JSON.parse(serialized);
    if (!isRecord(envelope) || envelope.version !== 1 || !isRecord(envelope.app)) {
      return undefined;
    }

    const persisted = envelope.app;
    const fallback = createInitialAppState();
    const authUser =
      persisted.authUser === null || isRecord(persisted.authUser)
        ? (persisted.authUser as UserProfile | null)
        : fallback.authUser;
    const isAuthenticated = persisted.isAuthenticated === true && authUser !== null;
    const theme: ThemeMode = persisted.theme === "dark" ? "dark" : "light";

    return {
      ...fallback,
      patients: Array.isArray(persisted.patients) ? persisted.patients : fallback.patients,
      doctors: Array.isArray(persisted.doctors) ? persisted.doctors : fallback.doctors,
      appointments: Array.isArray(persisted.appointments)
        ? persisted.appointments
        : fallback.appointments,
      beds: Array.isArray(persisted.beds) ? persisted.beds : fallback.beds,
      medicines: Array.isArray(persisted.medicines) ? persisted.medicines : fallback.medicines,
      invoices: Array.isArray(persisted.invoices) ? persisted.invoices : fallback.invoices,
      notifications: Array.isArray(persisted.notifications)
        ? persisted.notifications
        : fallback.notifications,
      authUser,
      isAuthenticated,
      theme,
    } as AppState;
  } catch {
    return undefined;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
});

const persistedAppState = loadPersistedAppState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedAppState ? { app: persistedAppState } : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

let lastPersistedValue = "";

const persistStore = () => {
  if (typeof window === "undefined") return;

  const { app } = store.getState();
  const persisted: PersistedStoreEnvelope = {
    version: 1,
    app: {
      patients: app.patients,
      doctors: app.doctors,
      appointments: app.appointments,
      beds: app.beds,
      medicines: app.medicines,
      invoices: app.invoices,
      notifications: app.notifications,
      authUser: app.authUser,
      isAuthenticated: app.isAuthenticated,
      theme: app.theme,
    },
  };

  try {
    const serialized = JSON.stringify(persisted);
    if (serialized === lastPersistedValue) return;

    window.localStorage.setItem(HOSPITAL_STORE_KEY, serialized);
    lastPersistedValue = serialized;
  } catch {
    // Storage can be blocked or full. The in-memory Redux store remains usable.
  }
};

store.subscribe(persistStore);

export * from "./slices/appSlice";
