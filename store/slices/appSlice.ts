import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  appointments as seedAppointments,
  authUser as seedAuthUser,
  beds as seedBeds,
  doctors as seedDoctors,
  invoices as seedInvoices,
  medicines as seedMedicines,
  notifications as seedNotifications,
  patients as seedPatients,
} from "../../data/seed";
import type {
  AppNotification,
  Appointment,
  Bed,
  Doctor,
  EntityUpdate,
  Invoice,
  Medicine,
  NewAppointment,
  NewBed,
  NewDoctor,
  NewInvoice,
  NewMedicine,
  NewNotification,
  NewPatient,
  NewToast,
  Patient,
  ThemeMode,
  ToastMessage,
  UserProfile,
} from "../../types";

export interface AppState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  beds: Bed[];
  medicines: Medicine[];
  invoices: Invoice[];
  notifications: AppNotification[];
  authUser: UserProfile | null;
  isAuthenticated: boolean;
  theme: ThemeMode;
  toasts: ToastMessage[];
  isLoading: boolean;
  error: string | null;
}

const copySeedCollections = () => ({
  patients: seedPatients.map((patient) => ({ ...patient })),
  doctors: seedDoctors.map((doctor) => ({ ...doctor })),
  appointments: seedAppointments.map((appointment) => ({ ...appointment })),
  beds: seedBeds.map((bed) => ({ ...bed })),
  medicines: seedMedicines.map((medicine) => ({ ...medicine })),
  invoices: seedInvoices.map((invoice) => ({
    ...invoice,
    lineItems: invoice.lineItems.map((lineItem) => ({ ...lineItem })),
  })),
  notifications: seedNotifications.map((notification) => ({ ...notification })),
});

export const createInitialAppState = (): AppState => ({
  ...copySeedCollections(),
  authUser: null,
  isAuthenticated: false,
  theme: "light",
  toasts: [],
  isLoading: false,
  error: null,
});

export const initialAppState = createInitialAppState();

let fallbackIdSequence = 0;

const createEntityId = (prefix: string) => {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return `${prefix}-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  fallbackIdSequence += 1;
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${fallbackIdSequence}`;
};

const appSlice = createSlice({
  name: "app",
  initialState: initialAppState,
  reducers: {
    addPatient: {
      prepare(patient: NewPatient) {
        return { payload: { ...patient, id: patient.id ?? createEntityId("PAT") } as Patient };
      },
      reducer(state, action: PayloadAction<Patient>) {
        state.patients.unshift(action.payload);
      },
    },
    updatePatient(state, action: PayloadAction<EntityUpdate<Patient>>) {
      const patient = state.patients.find((item) => item.id === action.payload.id);
      if (patient) Object.assign(patient, action.payload.changes);
    },
    deletePatient(state, action: PayloadAction<string>) {
      state.patients = state.patients.filter((patient) => patient.id !== action.payload);
    },

    addDoctor: {
      prepare(doctor: NewDoctor) {
        return { payload: { ...doctor, id: doctor.id ?? createEntityId("DOC") } as Doctor };
      },
      reducer(state, action: PayloadAction<Doctor>) {
        state.doctors.unshift(action.payload);
      },
    },
    updateDoctor(state, action: PayloadAction<EntityUpdate<Doctor>>) {
      const doctor = state.doctors.find((item) => item.id === action.payload.id);
      if (doctor) Object.assign(doctor, action.payload.changes);
    },
    deleteDoctor(state, action: PayloadAction<string>) {
      state.doctors = state.doctors.filter((doctor) => doctor.id !== action.payload);
    },

    addAppointment: {
      prepare(appointment: NewAppointment) {
        return {
          payload: { ...appointment, id: appointment.id ?? createEntityId("APT") } as Appointment,
        };
      },
      reducer(state, action: PayloadAction<Appointment>) {
        state.appointments.unshift(action.payload);
      },
    },
    updateAppointment(state, action: PayloadAction<EntityUpdate<Appointment>>) {
      const appointment = state.appointments.find((item) => item.id === action.payload.id);
      if (appointment) Object.assign(appointment, action.payload.changes);
    },
    deleteAppointment(state, action: PayloadAction<string>) {
      state.appointments = state.appointments.filter((appointment) => appointment.id !== action.payload);
    },

    addBed: {
      prepare(bed: NewBed) {
        return { payload: { ...bed, id: bed.id ?? createEntityId("BED") } as Bed };
      },
      reducer(state, action: PayloadAction<Bed>) {
        state.beds.unshift(action.payload);
      },
    },
    updateBed(state, action: PayloadAction<EntityUpdate<Bed>>) {
      const bed = state.beds.find((item) => item.id === action.payload.id);
      if (bed) Object.assign(bed, action.payload.changes);
    },
    deleteBed(state, action: PayloadAction<string>) {
      state.beds = state.beds.filter((bed) => bed.id !== action.payload);
    },

    addMedicine: {
      prepare(medicine: NewMedicine) {
        return { payload: { ...medicine, id: medicine.id ?? createEntityId("MED") } as Medicine };
      },
      reducer(state, action: PayloadAction<Medicine>) {
        state.medicines.unshift(action.payload);
      },
    },
    updateMedicine(state, action: PayloadAction<EntityUpdate<Medicine>>) {
      const medicine = state.medicines.find((item) => item.id === action.payload.id);
      if (medicine) Object.assign(medicine, action.payload.changes);
    },
    deleteMedicine(state, action: PayloadAction<string>) {
      state.medicines = state.medicines.filter((medicine) => medicine.id !== action.payload);
    },

    addInvoice: {
      prepare(invoice: NewInvoice) {
        return { payload: { ...invoice, id: invoice.id ?? createEntityId("INV") } as Invoice };
      },
      reducer(state, action: PayloadAction<Invoice>) {
        state.invoices.unshift(action.payload);
      },
    },
    updateInvoice(state, action: PayloadAction<EntityUpdate<Invoice>>) {
      const invoice = state.invoices.find((item) => item.id === action.payload.id);
      if (invoice) Object.assign(invoice, action.payload.changes);
    },
    deleteInvoice(state, action: PayloadAction<string>) {
      state.invoices = state.invoices.filter((invoice) => invoice.id !== action.payload);
    },

    addNotification: {
      prepare(notification: NewNotification) {
        return {
          payload: {
            ...notification,
            id: notification.id ?? createEntityId("NOT"),
          } as AppNotification,
        };
      },
      reducer(state, action: PayloadAction<AppNotification>) {
        state.notifications.unshift(action.payload);
      },
    },
    updateNotification(state, action: PayloadAction<EntityUpdate<AppNotification>>) {
      const notification = state.notifications.find((item) => item.id === action.payload.id);
      if (notification) Object.assign(notification, action.payload.changes);
    },
    deleteNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((item) => item.id === action.payload);
      if (notification) notification.read = true;
    },
    markNotificationUnread(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((item) => item.id === action.payload);
      if (notification) notification.read = false;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },

    login: {
      prepare(user: UserProfile = seedAuthUser) {
        return { payload: { ...user } };
      },
      reducer(state, action: PayloadAction<UserProfile>) {
        state.authUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      },
    },
    logout(state) {
      state.authUser = null;
      state.isAuthenticated = false;
      state.toasts = [];
    },
    updateProfile(state, action: PayloadAction<Partial<Omit<UserProfile, "id">>>) {
      if (state.authUser) Object.assign(state.authUser, action.payload);
    },

    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    addToast: {
      prepare(toast: NewToast) {
        return {
          payload: {
            duration: 4000,
            ...toast,
            id: toast.id ?? createEntityId("TOAST"),
          } as ToastMessage,
        };
      },
      reducer(state, action: PayloadAction<ToastMessage>) {
        state.toasts.push(action.payload);
      },
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    resetDemoData(state) {
      Object.assign(state, copySeedCollections(), {
        isLoading: false,
        error: null,
        toasts: [],
      });
    },
  },
});

export const {
  addPatient,
  updatePatient,
  deletePatient,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  addBed,
  updateBed,
  deleteBed,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  addNotification,
  updateNotification,
  deleteNotification,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
  login,
  logout,
  updateProfile,
  setTheme,
  toggleTheme,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
  setError,
  clearError,
  resetDemoData,
} = appSlice.actions;

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
export default appSlice.reducer;

type StateWithApp = { app: AppState };

export const selectApp = (state: StateWithApp) => state.app;
export const selectPatients = (state: StateWithApp) => state.app.patients;
export const selectDoctors = (state: StateWithApp) => state.app.doctors;
export const selectAppointments = (state: StateWithApp) => state.app.appointments;
export const selectBeds = (state: StateWithApp) => state.app.beds;
export const selectMedicines = (state: StateWithApp) => state.app.medicines;
export const selectInvoices = (state: StateWithApp) => state.app.invoices;
export const selectNotifications = (state: StateWithApp) => state.app.notifications;
export const selectUnreadNotificationCount = (state: StateWithApp) =>
  state.app.notifications.reduce((count, notification) => count + (notification.read ? 0 : 1), 0);
export const selectAuthUser = (state: StateWithApp) => state.app.authUser;
export const selectIsAuthenticated = (state: StateWithApp) => state.app.isAuthenticated;
export const selectTheme = (state: StateWithApp) => state.app.theme;
export const selectToasts = (state: StateWithApp) => state.app.toasts;
