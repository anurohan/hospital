import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DepartmentsSection from "@/components/sections/DepartmentsSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import ContactSection from "@/components/sections/ContactSection";
import { HOSPITAL_CONFIG } from "@/config/hospital";

export const metadata: Metadata = {
  title: `${HOSPITAL_CONFIG.name} — Expert Healthcare in ${HOSPITAL_CONFIG.address.city}`,
  description: `Book appointments, find specialist doctors, and access quality healthcare at ${HOSPITAL_CONFIG.name} in ${HOSPITAL_CONFIG.address.city}, ${HOSPITAL_CONFIG.address.state}. 24×7 emergency care available.`,
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <DepartmentsSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
