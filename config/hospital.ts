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

export const AROGYAN_CONFIG: HospitalConfig = {
  id: "arogyan-nursing-hospital",
  name: "Arogyan Nursing Hospital",
  shortName: "Arogyan",
  tagline: "Compassionate Care, Advanced Medicine",
  logo: "/images/logo.png",
  address: {
    line1: "Bishunganj",
    city: "Gaya",
    state: "Bihar",
    pincode: "823003",
    country: "India",
  },
  contact: {
    phone: "+91 94730 75435",
    emergencyPhone: "+91 94730 75435",
    email: "info@arogyanhospital.com",
    whatsapp: "+91 94730 75435",
  },
  hours: {
    opd: "Mon–Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7",
    pharmacy: "Mon–Sat: 8:00 AM – 9:00 PM",
  },
  mapUrl: "https://maps.app.goo.gl/DrhWnC5T2ssiExSF9",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.0!2d85.0!3d24.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zArogyan+Nursing+Hospital!5e0!3m2!1sen!2sin!4v1",
  theme: {
    primaryColor: "#0a6ebd",
    accentColor: "#00b4a0",
  },
  features: {
    onlineAppointments: true,
    telemedicine: false,
    onlinePayments: false,
    patientPortal: true,
  },
};

/**
 * Active hospital config.
 * In a multi-tenant setup, load this dynamically based on subdomain / env var.
 */
export const HOSPITAL_CONFIG: HospitalConfig = AROGYAN_CONFIG;
