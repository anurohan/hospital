import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { HOSPITAL_CONFIG } from "@/config/hospital";

const features = [
  {
    title: "Online Appointments",
    desc: "Book, reschedule, or cancel appointments from the comfort of your home, 24×7.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Expert Medical Team",
    desc: "Board-certified specialists with decades of combined experience across all major disciplines.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: "Modern Diagnostics",
    desc: "In-house pathology, radiology, and digital imaging for fast, accurate results.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    title: "24×7 Emergency",
    desc: "Round-the-clock emergency services with trained staff and rapid response protocols.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: "Patient Records",
    desc: "Secure digital health records accessible to you and your care team at any time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: "Patient Privacy",
    desc: "Your health data is encrypted, protected, and never shared without your consent.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

export default function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="section"
      style={{ backgroundColor: "var(--color-gray-50)" }}
    >
      <div className="container">
        <SectionHeader
          tag="Why Choose Us"
          title="Healthcare That Puts You First"
          subtitle={`At ${HOSPITAL_CONFIG.name}, we combine medical excellence with genuine compassion. Here's what makes us different.`}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`card animate-fade-in stagger-${Math.min(i + 1, 5)}`}
            >
              <div
                className="card-body"
                style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(135deg, var(--color-primary-700), var(--color-teal-500))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h4 style={{ marginBottom: "var(--space-2)" }}>{feat.title}</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>{feat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          style={{
            marginTop: "var(--space-16)",
            background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-900))",
            borderRadius: "var(--radius-2xl)",
            padding: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "var(--space-6)",
          }}
        >
          <h3 style={{ color: "#fff", fontSize: "1.75rem" }}>
            Ready to book your appointment?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "480px", fontSize: "1.0625rem" }}>
            Our team is ready to assist you. Book online in under 2 minutes or call us directly.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/appointments/book"
              id="why-us-book-btn"
              className="btn btn-teal btn-lg"
              style={{ textDecoration: "none" }}
            >
              Book Appointment
            </Link>
            <a
              href={`tel:${HOSPITAL_CONFIG.contact.phone.replace(/\s/g, "")}`}
              id="why-us-call-btn"
              className="btn btn-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {HOSPITAL_CONFIG.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
