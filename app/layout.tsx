import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;
  return {
    title: {
      default: "MediCore — Hospital Management",
      template: "%s | MediCore",
    },
    description:
      "A modern hospital operations dashboard for patients, doctors, appointments, beds, pharmacy, and billing.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "MediCore — Connected care. Clearer decisions.",
      description: "A complete, responsive hospital management dashboard.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "MediCore hospital management dashboard preview" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "MediCore — Hospital Management",
      description: "Connected care. Clearer decisions.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
