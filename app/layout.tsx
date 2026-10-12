import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HOSPITAL_CONFIG } from "@/config/hospital";

export const metadata: Metadata = {
  title: {
    default: `${HOSPITAL_CONFIG.name} | ${HOSPITAL_CONFIG.tagline}`,
    template: `%s | ${HOSPITAL_CONFIG.name}`,
  },
  description: `${HOSPITAL_CONFIG.name} — A trusted multi-specialty hospital in ${HOSPITAL_CONFIG.address.city}, ${HOSPITAL_CONFIG.address.state}. Expert doctors, modern diagnostics, 24×7 emergency care, and online appointment booking.`,
  keywords: [
    "hospital",
    "medical center",
    "clinic",
    HOSPITAL_CONFIG.address.city,
    HOSPITAL_CONFIG.address.state,
    "appointment",
    "doctor",
    "emergency",
    "healthcare",
    "medical",
  ],
  authors: [{ name: HOSPITAL_CONFIG.name }],
  creator: HOSPITAL_CONFIG.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: HOSPITAL_CONFIG.name,
    title: HOSPITAL_CONFIG.name,
    description: `${HOSPITAL_CONFIG.tagline} — ${HOSPITAL_CONFIG.address.city}, ${HOSPITAL_CONFIG.address.state}`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a6ebd",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
