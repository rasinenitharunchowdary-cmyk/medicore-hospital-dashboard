import { HospitalApp } from "./dashboard-app";

export const metadata = {
  title: "MediCore — Hospital Management",
  description:
    "A modern hospital operations dashboard for patients, doctors, appointments, beds, pharmacy, and billing.",
};

export default function HomePage() {
  return <HospitalApp />;
}
