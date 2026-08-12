"use client";

import { useMemo, useState } from "react";
import {
  BedDouble,
  Bell,
  CalendarCheck2,
  CheckCheck,
  CircleDollarSign,
  Clock3,
  IndianRupee,
  PackageCheck,
  PackageX,
  ReceiptIndianRupee,
  ShieldAlert,
  Stethoscope,
  Trash2,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EntityModule, type EntityField, type FormValues, type ModuleMetric } from "./entity-module";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addAppointment,
  addBed,
  addDoctor,
  addInvoice,
  addMedicine,
  addPatient,
  addToast,
  deleteAppointment,
  deleteBed,
  deleteDoctor,
  deleteInvoice,
  deleteMedicine,
  deleteNotification,
  deletePatient,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread,
  updateAppointment,
  updateBed,
  updateDoctor,
  updateInvoice,
  updateMedicine,
  updatePatient,
} from "@/store/slices/appSlice";
import type { AppNotification, Appointment, Bed, Doctor, Invoice, Medicine, Patient } from "@/types";
import type { TableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton, usePageReady } from "@/components/ui/feedback";

const today = () => new Date().toISOString().slice(0, 10);
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const displayDate = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

function PersonCell({ name, detail }: { name: string; detail: string }) {
  return <div className="flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[11px] font-bold text-[var(--primary)]">{name.split(" ").filter((part) => part !== "Dr.").map((part) => part[0]).slice(0, 2).join("")}</div><div className="min-w-0"><p className="truncate font-semibold text-[var(--foreground)]">{name}</p><p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">{detail}</p></div></div>;
}

function useNotifier() {
  const dispatch = useAppDispatch();
  return (kind: "success" | "error", message: string) => dispatch(addToast({ type: kind, message }));
}

export function PatientsPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const patients = useAppSelector((state) => state.app.patients);
  const doctors = useAppSelector((state) => state.app.doctors);
  const doctorNames = doctors.map((doctor) => doctor.name);
  const fields: EntityField[] = [
    { key: "name", label: "Full name", required: true, placeholder: "Patient name" },
    { key: "email", label: "Email", type: "email", required: true, placeholder: "patient@example.com" },
    { key: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91 98765 43210" },
    { key: "emergencyContact", label: "Emergency contact", type: "tel", required: true },
    { key: "age", label: "Age", type: "number", required: true, min: 0, max: 120 },
    { key: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
    { key: "bloodGroup", label: "Blood group", type: "select", required: true, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    { key: "status", label: "Clinical status", type: "select", required: true, options: ["Stable", "Critical", "Under observation", "Discharged"] },
    { key: "condition", label: "Condition / reason", required: true, span: 2, placeholder: "Primary diagnosis or reason for visit" },
    { key: "assignedDoctor", label: "Assigned doctor", type: "select", required: true, options: doctorNames },
    { key: "admissionDate", label: "Admission date", type: "date", required: true },
    { key: "address", label: "Address", type: "textarea", required: true, span: 2 },
  ];
  const columns: TableColumn<Patient>[] = [
    { key: "patient", label: "Patient", value: (row) => row.name, sortable: true, render: (row) => <PersonCell name={row.name} detail={`${row.mrn} · ${row.gender}, ${row.age}`} /> },
    { key: "contact", label: "Contact", value: (row) => row.email, render: (row) => <div><p>{row.phone}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.email}</p></div> },
    { key: "condition", label: "Condition", value: (row) => row.condition, sortable: true, render: (row) => <div><p className="font-medium">{row.condition}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.bloodGroup} blood group</p></div> },
    { key: "doctor", label: "Assigned doctor", value: (row) => row.assignedDoctor, sortable: true },
    { key: "status", label: "Status", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const metrics: ModuleMetric[] = [
    { label: "Total patients", value: String(patients.length), note: "All patient records", icon: <UsersRound size={20} />, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Currently admitted", value: String(patients.filter((p) => p.status !== "Discharged").length), note: "Receiving active care", icon: <UserCheck size={20} />, tone: "bg-sky-50 text-sky-700" },
    { label: "Critical care", value: String(patients.filter((p) => p.status === "Critical").length), note: "Requires close monitoring", icon: <ShieldAlert size={20} />, tone: "bg-red-50 text-red-700" },
    { label: "Discharged", value: String(patients.filter((p) => p.status === "Discharged").length), note: "Completed care", icon: <CheckCheck size={20} />, tone: "bg-violet-50 text-violet-700" },
  ];
  return <EntityModule eyebrow="Care registry" title="Patients" description="Maintain complete patient records, clinical status, and care assignments." singular="Patient" rows={patients} columns={columns} fields={fields} defaults={{ name: "", email: "", phone: "", emergencyContact: "", age: "", gender: "", bloodGroup: "", status: "Stable", condition: "", assignedDoctor: "", admissionDate: today(), address: "" }} metrics={metrics} searchPlaceholder="Search name, MRN, condition…" searchText={(row) => `${row.name} ${row.mrn} ${row.email} ${row.phone} ${row.condition} ${row.assignedDoctor}`} filterLabel="All clinical statuses" filterOptions={["Stable", "Critical", "Under observation", "Discharged"]} filterValue={(row) => row.status} displayName={(row) => row.name} toFormValues={(row) => ({ name: row.name, email: row.email, phone: row.phone, emergencyContact: row.emergencyContact, age: String(row.age), gender: row.gender, bloodGroup: row.bloodGroup, status: row.status, condition: row.condition, assignedDoctor: row.assignedDoctor, admissionDate: row.admissionDate, address: row.address })} buildRecord={(values, current) => { const doctor = doctors.find((item) => item.name === values.assignedDoctor); return { mrn: current?.mrn ?? `MRN-${Date.now().toString().slice(-6)}`, name: values.name, age: Number(values.age), gender: values.gender as Patient["gender"], bloodGroup: values.bloodGroup as Patient["bloodGroup"], phone: values.phone, email: values.email, address: values.address, condition: values.condition, status: values.status as Patient["status"], admissionDate: values.admissionDate, lastVisit: current?.lastVisit ?? today(), doctorId: doctor?.id ?? "", assignedDoctor: values.assignedDoctor, emergencyContact: values.emergencyContact }; }} onAdd={(record) => dispatch(addPatient(record))} onUpdate={(id, record) => dispatch(updatePatient({ id, changes: record }))} onDelete={(id) => dispatch(deletePatient(id))} onNotify={notify} />;
}

export function DoctorsPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const doctors = useAppSelector((state) => state.app.doctors);
  const fields: EntityField[] = [
    { key: "name", label: "Doctor name", required: true, placeholder: "Dr. Full name" },
    { key: "email", label: "Work email", type: "email", required: true },
    { key: "phone", label: "Phone", type: "tel", required: true },
    { key: "specialization", label: "Specialization", required: true },
    { key: "department", label: "Department", required: true },
    { key: "qualification", label: "Qualification", required: true },
    { key: "experienceYears", label: "Experience (years)", type: "number", required: true, min: 0, max: 60 },
    { key: "consultationFee", label: "Consultation fee (₹)", type: "number", required: true, min: 0 },
    { key: "status", label: "Availability", type: "select", required: true, options: ["Available", "In consultation", "In surgery", "Off duty", "On leave"] },
    { key: "nextAvailable", label: "Next available", type: "datetime-local", required: true },
  ];
  const columns: TableColumn<Doctor>[] = [
    { key: "doctor", label: "Doctor", value: (row) => row.name, sortable: true, render: (row) => <PersonCell name={row.name} detail={`${row.employeeId} · ${row.qualification}`} /> },
    { key: "department", label: "Department", value: (row) => row.department, sortable: true, render: (row) => <div><p className="font-medium">{row.specialization}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.department}</p></div> },
    { key: "experience", label: "Experience", value: (row) => row.experienceYears, sortable: true, render: (row) => <span>{row.experienceYears} years</span> },
    { key: "patients", label: "Active patients", value: (row) => row.activePatients, sortable: true },
    { key: "status", label: "Availability", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const onDuty = doctors.filter((d) => !["Off duty", "On leave"].includes(d.status)).length;
  return <EntityModule eyebrow="Clinical workforce" title="Doctors" description="Manage specialties, schedules, availability, and clinician profiles." singular="Doctor" rows={doctors} columns={columns} fields={fields} defaults={{ name: "", email: "", phone: "", specialization: "", department: "", qualification: "", experienceYears: "", consultationFee: "", status: "Available", nextAvailable: `${today()}T09:00` }} metrics={[{ label: "Total clinicians", value: String(doctors.length), note: "Across departments", icon: <Stethoscope size={20} />, tone: "bg-emerald-50 text-emerald-700" }, { label: "On duty", value: String(onDuty), note: "Available or in care", icon: <UserCheck size={20} />, tone: "bg-sky-50 text-sky-700" }, { label: "Available now", value: String(doctors.filter((d) => d.status === "Available").length), note: "Ready for consultation", icon: <Clock3 size={20} />, tone: "bg-violet-50 text-violet-700" }, { label: "Avg. rating", value: doctors.length ? (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1) : "—", note: "Patient experience score", icon: <CheckCheck size={20} />, tone: "bg-amber-50 text-amber-700" }]} searchPlaceholder="Search doctor, specialty, department…" searchText={(row) => `${row.name} ${row.employeeId} ${row.specialization} ${row.department} ${row.email}`} filterLabel="All availability" filterOptions={["Available", "In consultation", "In surgery", "Off duty", "On leave"]} filterValue={(row) => row.status} displayName={(row) => row.name} toFormValues={(row) => ({ name: row.name, email: row.email, phone: row.phone, specialization: row.specialization, department: row.department, qualification: row.qualification, experienceYears: String(row.experienceYears), consultationFee: String(row.consultationFee), status: row.status, nextAvailable: row.nextAvailable.slice(0, 16) })} buildRecord={(values, current) => ({ employeeId: current?.employeeId ?? `DOC-${Date.now().toString().slice(-4)}`, name: values.name, specialization: values.specialization, department: values.department, qualification: values.qualification, experienceYears: Number(values.experienceYears), phone: values.phone, email: values.email, status: values.status as Doctor["status"], activePatients: current?.activePatients ?? 0, rating: current?.rating ?? 5, consultationFee: Number(values.consultationFee), nextAvailable: values.nextAvailable })} onAdd={(record) => dispatch(addDoctor(record))} onUpdate={(id, record) => dispatch(updateDoctor({ id, changes: record }))} onDelete={(id) => dispatch(deleteDoctor(id))} onNotify={notify} />;
}

export function AppointmentsPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const appointments = useAppSelector((state) => state.app.appointments);
  const patients = useAppSelector((state) => state.app.patients);
  const doctors = useAppSelector((state) => state.app.doctors);
  const fields: EntityField[] = [
    { key: "patientName", label: "Patient", type: "select", required: true, options: patients.map((item) => item.name) },
    { key: "doctorName", label: "Doctor", type: "select", required: true, options: doctors.map((item) => item.name) },
    { key: "department", label: "Department", required: true },
    { key: "room", label: "Room", required: true, placeholder: "e.g. OPD-204" },
    { key: "date", label: "Date", type: "date", required: true, validate: (value, values) => values.status !== "Completed" && value < today() ? "Choose today or a future date" : undefined },
    { key: "time", label: "Time", type: "time", required: true },
    { key: "durationMinutes", label: "Duration (minutes)", type: "number", required: true, min: 10, max: 240 },
    { key: "type", label: "Appointment type", type: "select", required: true, options: ["Consultation", "Follow-up", "Emergency", "Procedure", "Video visit"] },
    { key: "status", label: "Status", type: "select", required: true, options: ["Scheduled", "Confirmed", "In progress", "Completed", "Cancelled"] },
    { key: "reason", label: "Reason for visit", type: "textarea", required: true, span: 2 },
  ];
  const columns: TableColumn<Appointment>[] = [
    { key: "patient", label: "Patient", value: (row) => row.patientName, sortable: true, render: (row) => <PersonCell name={row.patientName} detail={`${row.type} · ${row.id}`} /> },
    { key: "doctor", label: "Doctor", value: (row) => row.doctorName, sortable: true, render: (row) => <div><p className="font-medium">{row.doctorName}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.department}</p></div> },
    { key: "date", label: "Date & time", value: (row) => `${row.date} ${row.time}`, sortable: true, render: (row) => <div><p className="font-medium">{displayDate(row.date)}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.time} · {row.durationMinutes} min</p></div> },
    { key: "room", label: "Room", value: (row) => row.room, sortable: true },
    { key: "status", label: "Status", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const build = (values: FormValues, current?: Appointment): Omit<Appointment, "id"> => { const patient = patients.find((item) => item.name === values.patientName); const doctor = doctors.find((item) => item.name === values.doctorName); return { patientId: patient?.id ?? "", patientName: values.patientName, doctorId: doctor?.id ?? "", doctorName: values.doctorName, department: values.department || doctor?.department || "General Medicine", date: values.date, time: values.time, durationMinutes: Number(values.durationMinutes), type: values.type as Appointment["type"], status: values.status as Appointment["status"], reason: values.reason, room: values.room, notes: current?.notes ?? "" }; };
  return <EntityModule eyebrow="Care schedule" title="Appointments" description="Schedule, reschedule, and track consultations and procedures." singular="Appointment" rows={appointments} columns={columns} fields={fields} defaults={{ patientName: "", doctorName: "", department: "General Medicine", room: "OPD-101", date: today(), time: "09:00", durationMinutes: "30", type: "Consultation", status: "Scheduled", reason: "" }} metrics={[{ label: "All appointments", value: String(appointments.length), note: "Current schedule", icon: <CalendarCheck2 size={20} />, tone: "bg-emerald-50 text-emerald-700" }, { label: "Confirmed", value: String(appointments.filter((a) => a.status === "Confirmed").length), note: "Ready for arrival", icon: <CheckCheck size={20} />, tone: "bg-sky-50 text-sky-700" }, { label: "Completed", value: String(appointments.filter((a) => a.status === "Completed").length), note: "Care delivered", icon: <UserCheck size={20} />, tone: "bg-violet-50 text-violet-700" }, { label: "Cancelled", value: String(appointments.filter((a) => a.status === "Cancelled").length), note: "Needs follow-up", icon: <Clock3 size={20} />, tone: "bg-amber-50 text-amber-700" }]} searchPlaceholder="Search patient, doctor, reason…" searchText={(row) => `${row.patientName} ${row.doctorName} ${row.department} ${row.reason} ${row.room}`} filterLabel="All appointment statuses" filterOptions={["Scheduled", "Confirmed", "In progress", "Completed", "Cancelled"]} filterValue={(row) => row.status} displayName={(row) => `${row.patientName} with ${row.doctorName}`} toFormValues={(row) => ({ patientName: row.patientName, doctorName: row.doctorName, department: row.department, room: row.room, date: row.date, time: row.time, durationMinutes: String(row.durationMinutes), type: row.type, status: row.status, reason: row.reason })} buildRecord={build} onAdd={(record) => dispatch(addAppointment(record))} onUpdate={(id, record) => dispatch(updateAppointment({ id, changes: record }))} onDelete={(id) => dispatch(deleteAppointment(id))} onNotify={notify} />;
}

export function BedsPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const beds = useAppSelector((state) => state.app.beds);
  const patients = useAppSelector((state) => state.app.patients);
  const fields: EntityField[] = [
    { key: "bedNumber", label: "Bed number", required: true },
    { key: "ward", label: "Ward", required: true },
    { key: "floor", label: "Floor", type: "number", required: true, min: 0, max: 30 },
    { key: "type", label: "Bed type", type: "select", required: true, options: ["General", "ICU", "Private", "Pediatric", "Maternity"] },
    { key: "status", label: "Status", type: "select", required: true, options: ["Available", "Occupied", "Reserved", "Maintenance"] },
    { key: "patientName", label: "Assigned patient", type: "select", options: patients.map((item) => item.name), hint: "Required when marking a bed occupied" },
    { key: "dailyRate", label: "Daily rate (₹)", type: "number", required: true, min: 0 },
    { key: "expectedDischarge", label: "Expected discharge", type: "date" },
  ];
  const columns: TableColumn<Bed>[] = [
    { key: "bed", label: "Bed", value: (row) => row.bedNumber, sortable: true, render: (row) => <div><p className="font-semibold">{row.bedNumber}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">Floor {row.floor} · {row.type}</p></div> },
    { key: "ward", label: "Ward", value: (row) => row.ward, sortable: true },
    { key: "patient", label: "Assigned patient", value: (row) => row.patientName ?? "", sortable: true, render: (row) => row.patientName ? <PersonCell name={row.patientName} detail={`Admitted ${row.admissionDate ? displayDate(row.admissionDate) : "today"}`} /> : <span className="text-[var(--subtle)]">Not assigned</span> },
    { key: "rate", label: "Daily rate", value: (row) => row.dailyRate, sortable: true, render: (row) => money.format(row.dailyRate) },
    { key: "status", label: "Status", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const occupied = beds.filter((b) => b.status === "Occupied").length;
  return <EntityModule eyebrow="Capacity control" title="Bed management" description="Track occupancy, assign patients, release beds, and coordinate ward capacity." singular="Bed" rows={beds} columns={columns} fields={fields} defaults={{ bedNumber: "", ward: "General Ward", floor: "1", type: "General", status: "Available", patientName: "", dailyRate: "2500", expectedDischarge: "" }} metrics={[{ label: "Total beds", value: String(beds.length), note: "Across all wards", icon: <BedDouble size={20} />, tone: "bg-emerald-50 text-emerald-700" }, { label: "Occupied", value: String(occupied), note: `${beds.length ? Math.round(occupied / beds.length * 100) : 0}% occupancy`, icon: <UsersRound size={20} />, tone: "bg-violet-50 text-violet-700" }, { label: "Available", value: String(beds.filter((b) => b.status === "Available").length), note: "Ready for assignment", icon: <CheckCheck size={20} />, tone: "bg-sky-50 text-sky-700" }, { label: "Maintenance", value: String(beds.filter((b) => b.status === "Maintenance").length), note: "Temporarily offline", icon: <ShieldAlert size={20} />, tone: "bg-amber-50 text-amber-700" }]} searchPlaceholder="Search bed, ward, patient…" searchText={(row) => `${row.bedNumber} ${row.ward} ${row.type} ${row.patientName ?? ""}`} filterLabel="All bed statuses" filterOptions={["Available", "Occupied", "Reserved", "Maintenance"]} filterValue={(row) => row.status} displayName={(row) => row.bedNumber} validateForm={(values): Record<string, string> => values.status === "Occupied" && !values.patientName ? { patientName: "Assign a patient to an occupied bed" } : {}} toFormValues={(row) => ({ bedNumber: row.bedNumber, ward: row.ward, floor: String(row.floor), type: row.type, status: row.status, patientName: row.patientName ?? "", dailyRate: String(row.dailyRate), expectedDischarge: row.expectedDischarge ?? "" })} buildRecord={(values, current) => { const patient = patients.find((item) => item.name === values.patientName); const occupiedNow = values.status === "Occupied"; return { bedNumber: values.bedNumber, ward: values.ward, floor: Number(values.floor), type: values.type as Bed["type"], status: values.status as Bed["status"], patientId: occupiedNow ? patient?.id : undefined, patientName: occupiedNow ? values.patientName : undefined, admissionDate: occupiedNow ? current?.admissionDate ?? today() : undefined, expectedDischarge: occupiedNow && values.expectedDischarge ? values.expectedDischarge : undefined, dailyRate: Number(values.dailyRate) }; }} onAdd={(record) => dispatch(addBed(record))} onUpdate={(id, record) => dispatch(updateBed({ id, changes: record }))} onDelete={(id) => dispatch(deleteBed(id))} onNotify={notify} />;
}

export function PharmacyPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const medicines = useAppSelector((state) => state.app.medicines);
  const fields: EntityField[] = [
    { key: "name", label: "Medicine name", required: true },
    { key: "genericName", label: "Generic name", required: true },
    { key: "category", label: "Category", required: true },
    { key: "dosageForm", label: "Dosage form", type: "select", required: true, options: ["Tablet", "Capsule", "Syrup", "Injection", "Inhaler", "Cream"] },
    { key: "strength", label: "Strength", required: true, placeholder: "e.g. 500 mg" },
    { key: "stock", label: "Stock units", type: "number", required: true, min: 0 },
    { key: "reorderLevel", label: "Reorder level", type: "number", required: true, min: 0 },
    { key: "unitPrice", label: "Unit price (₹)", type: "number", required: true, min: 0, step: 0.01 },
    { key: "expiryDate", label: "Expiry date", type: "date", required: true },
    { key: "manufacturer", label: "Manufacturer", required: true },
    { key: "supplier", label: "Supplier", required: true },
    { key: "batchNumber", label: "Batch number", required: true },
  ];
  const columns: TableColumn<Medicine>[] = [
    { key: "medicine", label: "Medicine", value: (row) => row.name, sortable: true, render: (row) => <div><p className="font-semibold">{row.name} <span className="font-normal text-[var(--muted)]">{row.strength}</span></p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.genericName} · {row.sku}</p></div> },
    { key: "category", label: "Category", value: (row) => row.category, sortable: true, render: (row) => <div><p>{row.category}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">{row.dosageForm}</p></div> },
    { key: "stock", label: "Stock", value: (row) => row.stock, sortable: true, render: (row) => <div><p className="font-semibold">{row.stock} units</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">Reorder at {row.reorderLevel}</p></div> },
    { key: "price", label: "Unit price", value: (row) => row.unitPrice, sortable: true, render: (row) => money.format(row.unitPrice) },
    { key: "expiry", label: "Expiry", value: (row) => row.expiryDate, sortable: true, render: (row) => displayDate(row.expiryDate) },
    { key: "status", label: "Status", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const inventoryValue = medicines.reduce((sum, medicine) => sum + medicine.stock * medicine.unitPrice, 0);
  return <EntityModule eyebrow="Medication safety" title="Pharmacy" description="Monitor inventory, stock thresholds, batches, pricing, and medicine expiry." singular="Medicine" rows={medicines} columns={columns} fields={fields} defaults={{ name: "", genericName: "", category: "Antibiotic", dosageForm: "Tablet", strength: "", stock: "0", reorderLevel: "20", unitPrice: "", expiryDate: today(), manufacturer: "", supplier: "", batchNumber: "" }} metrics={[{ label: "Inventory items", value: String(medicines.length), note: "Active SKUs", icon: <PackageCheck size={20} />, tone: "bg-emerald-50 text-emerald-700" }, { label: "Low stock", value: String(medicines.filter((m) => m.stock > 0 && m.stock <= m.reorderLevel).length), note: "Reorder recommended", icon: <ShieldAlert size={20} />, tone: "bg-amber-50 text-amber-700" }, { label: "Out of stock", value: String(medicines.filter((m) => m.stock === 0).length), note: "Requires action", icon: <PackageX size={20} />, tone: "bg-red-50 text-red-700" }, { label: "Inventory value", value: money.format(inventoryValue), note: "At current unit price", icon: <IndianRupee size={20} />, tone: "bg-violet-50 text-violet-700" }]} searchPlaceholder="Search medicine, SKU, category…" searchText={(row) => `${row.name} ${row.genericName} ${row.sku} ${row.category} ${row.manufacturer}`} filterLabel="All stock statuses" filterOptions={["In stock", "Low stock", "Out of stock", "Expired"]} filterValue={(row) => row.status} displayName={(row) => row.name} toFormValues={(row) => ({ name: row.name, genericName: row.genericName, category: row.category, dosageForm: row.dosageForm, strength: row.strength, stock: String(row.stock), reorderLevel: String(row.reorderLevel), unitPrice: String(row.unitPrice), expiryDate: row.expiryDate, manufacturer: row.manufacturer, supplier: row.supplier, batchNumber: row.batchNumber })} buildRecord={(values, current) => { const stock = Number(values.stock); const reorder = Number(values.reorderLevel); const status: Medicine["status"] = values.expiryDate < today() ? "Expired" : stock === 0 ? "Out of stock" : stock <= reorder ? "Low stock" : "In stock"; return { sku: current?.sku ?? `MED-${Date.now().toString().slice(-5)}`, name: values.name, genericName: values.genericName, category: values.category, dosageForm: values.dosageForm as Medicine["dosageForm"], strength: values.strength, manufacturer: values.manufacturer, batchNumber: values.batchNumber, stock, reorderLevel: reorder, unitPrice: Number(values.unitPrice), expiryDate: values.expiryDate, supplier: values.supplier, status }; }} onAdd={(record) => dispatch(addMedicine(record))} onUpdate={(id, record) => dispatch(updateMedicine({ id, changes: record }))} onDelete={(id) => dispatch(deleteMedicine(id))} onNotify={notify} />;
}

export function BillingPage() {
  const dispatch = useAppDispatch();
  const notify = useNotifier();
  const invoices = useAppSelector((state) => state.app.invoices);
  const patients = useAppSelector((state) => state.app.patients);
  const fields: EntityField[] = [
    { key: "patientName", label: "Patient", type: "select", required: true, options: patients.map((item) => item.name) },
    { key: "issuedDate", label: "Issue date", type: "date", required: true },
    { key: "dueDate", label: "Due date", type: "date", required: true },
    { key: "total", label: "Invoice total (₹)", type: "number", required: true, min: 1, step: 0.01 },
    { key: "paidAmount", label: "Amount paid (₹)", type: "number", required: true, min: 0, step: 0.01 },
    { key: "status", label: "Status", type: "select", required: true, options: ["Paid", "Pending", "Partially paid", "Overdue", "Cancelled"] },
    { key: "paymentMethod", label: "Payment method", type: "select", options: ["Cash", "Card", "UPI", "Insurance", "Bank transfer"] },
    { key: "description", label: "Billing description", type: "textarea", required: true, span: 2, placeholder: "Consultation, procedure, medicine, or room charges" },
  ];
  const columns: TableColumn<Invoice>[] = [
    { key: "invoice", label: "Invoice", value: (row) => row.invoiceNumber, sortable: true, render: (row) => <div><p className="font-semibold">{row.invoiceNumber}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">Issued {displayDate(row.issuedDate)}</p></div> },
    { key: "patient", label: "Patient", value: (row) => row.patientName, sortable: true, render: (row) => <PersonCell name={row.patientName} detail={row.patientId} /> },
    { key: "total", label: "Total", value: (row) => row.total, sortable: true, render: (row) => <div><p className="font-semibold">{money.format(row.total)}</p><p className="mt-0.5 text-[11px] text-[var(--muted)]">Paid {money.format(row.paidAmount)}</p></div> },
    { key: "balance", label: "Balance", value: (row) => row.balance, sortable: true, render: (row) => <span className={row.balance > 0 ? "font-semibold text-[var(--danger)]" : "font-semibold text-emerald-600"}>{money.format(row.balance)}</span> },
    { key: "due", label: "Due date", value: (row) => row.dueDate, sortable: true, render: (row) => displayDate(row.dueDate) },
    { key: "status", label: "Status", value: (row) => row.status, sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];
  const collected = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  return <EntityModule eyebrow="Revenue cycle" title="Billing & invoices" description="Create bills, track payments, and manage outstanding patient balances." singular="Invoice" rows={invoices} columns={columns} fields={fields} defaults={{ patientName: "", issuedDate: today(), dueDate: today(), total: "", paidAmount: "0", status: "Pending", paymentMethod: "UPI", description: "Consultation and hospital services" }} metrics={[{ label: "Total billed", value: money.format(invoices.reduce((sum, i) => sum + i.total, 0)), note: "All current invoices", icon: <ReceiptIndianRupee size={20} />, tone: "bg-emerald-50 text-emerald-700" }, { label: "Collected", value: money.format(collected), note: "Received payments", icon: <CircleDollarSign size={20} />, tone: "bg-sky-50 text-sky-700" }, { label: "Outstanding", value: money.format(outstanding), note: "Pending collection", icon: <Clock3 size={20} />, tone: "bg-amber-50 text-amber-700" }, { label: "Overdue", value: String(invoices.filter((i) => i.status === "Overdue").length), note: "Needs follow-up", icon: <ShieldAlert size={20} />, tone: "bg-red-50 text-red-700" }]} searchPlaceholder="Search invoice, patient…" searchText={(row) => `${row.invoiceNumber} ${row.patientName} ${row.paymentMethod ?? ""}`} filterLabel="All invoice statuses" filterOptions={["Paid", "Pending", "Partially paid", "Overdue", "Cancelled"]} filterValue={(row) => row.status} displayName={(row) => row.invoiceNumber} validateForm={(values) => { const errors: Record<string, string> = {}; if (values.dueDate < values.issuedDate) errors.dueDate = "Due date cannot be before issue date"; if (Number(values.paidAmount) > Number(values.total)) errors.paidAmount = "Paid amount cannot exceed the total"; return errors; }} toFormValues={(row) => ({ patientName: row.patientName, issuedDate: row.issuedDate, dueDate: row.dueDate, total: String(row.total), paidAmount: String(row.paidAmount), status: row.status, paymentMethod: row.paymentMethod ?? "", description: row.lineItems[0]?.description ?? "Hospital services" })} buildRecord={(values, current) => { const patient = patients.find((item) => item.name === values.patientName); const total = Number(values.total); const paid = Number(values.paidAmount); const subtotal = Math.round((total / 1.05) * 100) / 100; const status: Invoice["status"] = paid >= total ? "Paid" : paid > 0 && values.status === "Pending" ? "Partially paid" : values.status as Invoice["status"]; return { invoiceNumber: current?.invoiceNumber ?? `INV-${Date.now().toString().slice(-6)}`, patientId: patient?.id ?? "", patientName: values.patientName, issuedDate: values.issuedDate, dueDate: values.dueDate, lineItems: [{ id: current?.lineItems[0]?.id ?? `LINE-${Date.now()}`, description: values.description, quantity: 1, unitPrice: subtotal, amount: subtotal }], subtotal, tax: Math.round((total - subtotal) * 100) / 100, discount: 0, total, paidAmount: paid, balance: Math.max(0, total - paid), status, paymentMethod: values.paymentMethod as Invoice["paymentMethod"] }; }} onAdd={(record) => dispatch(addInvoice(record))} onUpdate={(id, record) => dispatch(updateInvoice({ id, changes: record }))} onDelete={(id) => dispatch(deleteInvoice(id))} onNotify={notify} />;
}

const notificationIcons: Record<AppNotification["type"], typeof Bell> = { appointment: CalendarCheck2, patient: UsersRound, bed: BedDouble, pharmacy: PackageCheck, billing: ReceiptIndianRupee, system: Bell };

export function NotificationsPage() {
  const ready = usePageReady(240);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const notifications = useAppSelector((state) => state.app.notifications);
  const visible = useMemo(() => filter === "unread" ? notifications.filter((notification) => !notification.read) : notifications, [filter, notifications]);
  const unread = notifications.filter((notification) => !notification.read).length;
  if (!ready) return <PageSkeleton />;
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Activity centre" title="Notifications" description="Stay on top of patient, capacity, pharmacy, billing, and scheduling updates." actions={<Button variant="secondary" disabled={!unread} onClick={() => { dispatch(markAllNotificationsRead()); dispatch(addToast({ type: "success", message: "All notifications marked as read." })); }}><CheckCheck size={16} />Mark all read</Button>} />
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-4 sm:px-5"><div className="flex rounded-xl bg-[var(--surface-soft)] p-1">{(["all", "unread"] as const).map((option) => <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${filter === option ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"}`}>{option}{option === "unread" ? ` (${unread})` : ""}</button>)}</div><p className="text-xs text-[var(--muted)]">{notifications.length} updates</p></div>
        {visible.length ? <div className="divide-y divide-[var(--border)]">{visible.map((notification) => { const Icon = notificationIcons[notification.type]; return <article key={notification.id} className={`flex gap-3 p-4 sm:gap-4 sm:px-5 ${notification.read ? "" : "bg-[color-mix(in_srgb,var(--primary-soft)_45%,transparent)]"}`}><button type="button" aria-label={notification.read ? "Mark unread" : "Mark read"} onClick={() => dispatch(notification.read ? markNotificationUnread(notification.id) : markNotificationRead(notification.id))} className={`grid size-10 shrink-0 place-items-center rounded-xl ${notification.read ? "bg-[var(--surface-soft)] text-[var(--muted)]" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}><Icon size={18} /></button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className={`text-sm ${notification.read ? "font-medium" : "font-bold"}`}>{notification.title}</h2>{notification.priority === "urgent" || notification.priority === "high" ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase text-red-700">{notification.priority}</span> : null}</div><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{notification.message}</p><div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--subtle)]"><span>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(notification.createdAt))}</span>{notification.actionUrl ? <Link to={notification.actionUrl} className="font-semibold text-[var(--primary)] hover:underline">Open module</Link> : null}</div></div><button type="button" aria-label="Delete notification" onClick={() => { dispatch(deleteNotification(notification.id)); dispatch(addToast({ type: "info", message: "Notification removed." })); }} className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--subtle)] hover:bg-red-50 hover:text-[var(--danger)]"><Trash2 size={16} /></button></article>; })}</div> : <EmptyState title={filter === "unread" ? "You’re all caught up" : "No notifications"} description={filter === "unread" ? "There are no unread updates right now." : "New hospital activity will appear here."} />}
      </section>
    </div>
  );
}
