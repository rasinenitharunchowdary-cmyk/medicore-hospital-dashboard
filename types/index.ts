export type Gender = "Male" | "Female" | "Non-binary" | "Prefer not to say";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type PatientStatus = "Stable" | "Critical" | "Under observation" | "Discharged";

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  avatar?: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  condition: string;
  status: PatientStatus;
  admissionDate: string;
  lastVisit: string;
  doctorId: string;
  assignedDoctor: string;
  emergencyContact: string;
}

export type DoctorStatus = "Available" | "In consultation" | "In surgery" | "Off duty" | "On leave";

export interface Doctor {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string;
  specialization: string;
  department: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  status: DoctorStatus;
  activePatients: number;
  rating: number;
  consultationFee: number;
  nextAvailable: string;
}

export type AppointmentStatus = "Scheduled" | "Confirmed" | "In progress" | "Completed" | "Cancelled";
export type AppointmentType = "Consultation" | "Follow-up" | "Emergency" | "Procedure" | "Video visit";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  room: string;
  notes?: string;
}

export type BedStatus = "Available" | "Occupied" | "Reserved" | "Maintenance";
export type BedType = "General" | "ICU" | "Private" | "Pediatric" | "Maternity";

export interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  floor: number;
  type: BedType;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  expectedDischarge?: string;
  dailyRate: number;
}

export type MedicineStatus = "In stock" | "Low stock" | "Out of stock" | "Expired";
export type DosageForm = "Tablet" | "Capsule" | "Syrup" | "Injection" | "Inhaler" | "Cream";

export interface Medicine {
  id: string;
  sku: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: DosageForm;
  strength: string;
  manufacturer: string;
  batchNumber: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate: string;
  supplier: string;
  status: MedicineStatus;
}

export type InvoiceStatus = "Paid" | "Pending" | "Partially paid" | "Overdue" | "Cancelled";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  issuedDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  paymentMethod?: "Cash" | "Card" | "UPI" | "Insurance" | "Bank transfer";
}

export type NotificationType = "appointment" | "patient" | "bed" | "pharmacy" | "billing" | "system";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export type UserRole = "Administrator" | "Doctor" | "Nurse" | "Receptionist" | "Pharmacist" | "Accountant";

export interface UserProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  avatar?: string;
  address?: string;
  joinedDate: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export type ThemeMode = "light" | "dark";

export type NewEntity<T extends { id: string }> = Omit<T, "id"> & { id?: string };

export type EntityUpdate<T extends { id: string }> = {
  id: T["id"];
  changes: Partial<Omit<T, "id">>;
};

export type NewPatient = NewEntity<Patient>;
export type NewDoctor = NewEntity<Doctor>;
export type NewAppointment = NewEntity<Appointment>;
export type NewBed = NewEntity<Bed>;
export type NewMedicine = NewEntity<Medicine>;
export type NewInvoice = NewEntity<Invoice>;
export type NewNotification = NewEntity<AppNotification>;
export type NewToast = NewEntity<ToastMessage>;
