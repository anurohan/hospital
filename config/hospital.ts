/**
 * Hospital Configuration
 * ----------------------
 * This is the central configuration for hospital-specific settings.
 * To white-label for a different hospital, update this file or load
 * from environment variables / database at runtime.
 *
 * DO NOT hardcode hospital-specific values outside this file.
 */

export interface HospitalConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    emergencyPhone: string;
    email: string;
    whatsapp?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  hours: {
    opd: string;
    emergency: string;
    pharmacy: string;
  };
  mapUrl: string;
  mapEmbedUrl?: string;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  features: {
    onlineAppointments: boolean;
    telemedicine: boolean;
    onlinePayments: boolean;
    patientPortal: boolean;
  };
}

export const NORTHSTAR_MEDICAL_CONFIG: HospitalConfig = {
  id: "northstar-medical-center",
  name: "NorthStar Medical Center",
  shortName: "NorthStar",
  tagline: "Smarter care. Softer experiences.",
  logo: "/images/logo.png",
  address: {
    line1: "145 Harbor Avenue",
    line2: "Suite 204",
    city: "Demo City",
    state: "California",
    pincode: "90001",
    country: "United States",
  },
  contact: {
    phone: "+1 (555) 123-4567",
    emergencyPhone: "+1 (555) 987-6543",
    email: "hello@northstarmedical.example",
    whatsapp: "+1 (555) 123-4567",
  },
  hours: {
    opd: "Mon–Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7",
    pharmacy: "Mon–Sat: 8:00 AM – 9:00 PM",
  },
  mapUrl: "https://maps.google.com/?q=145+Harbor+Avenue+Demo+City+CA",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Demo+City+CA&output=embed",
  theme: {
    primaryColor: "#0a6ebd",
    accentColor: "#00b4a0",
  },
  features: {
    onlineAppointments: true,
    telemedicine: true,
    onlinePayments: true,
    patientPortal: true,
  },
};

/**
 * Active hospital config.
 * In a multi-tenant setup, load this dynamically based on subdomain / env var.
 */
export const HOSPITAL_CONFIG: HospitalConfig = NORTHSTAR_MEDICAL_CONFIG;
