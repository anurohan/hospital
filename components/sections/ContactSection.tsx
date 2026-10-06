"use client";

import React from "react";
import { HOSPITAL_CONFIG } from "@/config/hospital";

export default function ContactSection() {
  return (
    <section id="contact" className="section" style={{ backgroundColor: "#fff" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-12)",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: info */}
          <div>
            <span
              className="pill"
              style={{
                background: "var(--color-primary-50)",
                color: "var(--color-primary-700)",
                border: "1px solid var(--color-primary-200)",
                marginBottom: "var(--space-4)",
                display: "inline-flex",
              }}
            >
              Get In Touch
            </span>

            <h2 style={{ marginBottom: "var(--space-4)" }}>We&apos;re Here to Help</h2>
            <p style={{ maxWidth: "440px", marginBottom: "var(--space-8)" }}>
              Whether you need to book an appointment, have a medical question, or just want
              to know your way around — our friendly team is ready.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <ContactCard
                icon={<PhoneIcon />}
                title="Phone / WhatsApp"
                value={HOSPITAL_CONFIG.contact.phone}
                sub="Emergency: Available 24×7"
                href={`tel:${HOSPITAL_CONFIG.contact.phone.replace(/\s/g, "")}`}
                color="var(--color-primary-700)"
                bg="var(--color-primary-50)"
              />
              <ContactCard
                icon={<MailIcon />}
                title="Email"
                value={HOSPITAL_CONFIG.contact.email}
                sub="We reply within 24 hours"
                href={`mailto:${HOSPITAL_CONFIG.contact.email}`}
                color="var(--color-teal-600)"
                bg="var(--color-teal-50)"
              />
              <ContactCard
                icon={<MapPinIcon />}
                title="Address"
                value={`${HOSPITAL_CONFIG.address.line1}, ${HOSPITAL_CONFIG.address.city}`}
                sub={`${HOSPITAL_CONFIG.address.state} ${HOSPITAL_CONFIG.address.pincode}, ${HOSPITAL_CONFIG.address.country}`}
                href={HOSPITAL_CONFIG.mapUrl}
                color="#7c3aed"
                bg="#f5f3ff"
                external
              />
            </div>

            {/* Hours */}
            <div
              style={{
                marginTop: "var(--space-8)",
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                border: "1px solid var(--surface-border)",
              }}
            >
              <h4 style={{ marginBottom: "var(--space-4)", fontSize: "1rem" }}>Hospital Hours</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <HoursRow label="OPD / Outpatient" value={HOSPITAL_CONFIG.hours.opd} />
                <HoursRow label="Emergency" value={HOSPITAL_CONFIG.hours.emergency} emergency />
                <HoursRow label="Pharmacy" value={HOSPITAL_CONFIG.hours.pharmacy} />
              </div>
            </div>
          </div>

          {/* Right: Map + form placeholder */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {/* Map embed placeholder */}
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--surface-border)",
                height: "260px",
                backgroundColor: "var(--color-gray-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "var(--space-3)",
                color: "var(--text-muted)",
              }}
            >
              <MapPinIcon size={36} />
              <span style={{ fontWeight: 500 }}>
                {HOSPITAL_CONFIG.name}
              </span>
              <a
                href={HOSPITAL_CONFIG.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: "none" }}
              >
                Open in Google Maps ↗
              </a>
            </div>

            {/* Quick message form (placeholder — will be wired to backend later) */}
            <div
              className="card"
              style={{ padding: "var(--space-6)" }}
            >
              <h4 style={{ marginBottom: "var(--space-5)", fontSize: "1rem" }}>Send a Message</h4>
              <form
                id="contact-form"
                onSubmit={(e) => e.preventDefault()}
                style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <FormField label="Name" id="contact-name" type="text" placeholder="Your name" />
                  <FormField label="Phone" id="contact-phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <FormField label="Message" id="contact-message" type="textarea" placeholder="How can we help you?" />
                <button type="submit" className="btn btn-primary btn-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ContactCard({
  icon, title, value, sub, href, color, bg, external,
}: {
  icon: React.ReactNode; title: string; value: string; sub?: string;
  href: string; color: string; bg: string; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-4)",
        textDecoration: "none",
        padding: "var(--space-4)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--surface-border)",
        transition: "box-shadow var(--transition-base), transform var(--transition-base)",
        backgroundColor: "#fff",
      }}
      className="card-hover"
    >
      <div
        style={{
          width: "44px", height: "44px",
          borderRadius: "var(--radius-md)",
          backgroundColor: bg,
          color,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
          {title}
        </div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>{value}</div>
        {sub && <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{sub}</div>}
      </div>
    </a>
  );
}

function HoursRow({ label, value, emergency }: { label: string; value: string; emergency?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem" }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          color: emergency ? "#dc2626" : "var(--text-primary)",
          backgroundColor: emergency ? "#fee2e2" : "var(--color-gray-100)",
          padding: "2px 10px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8125rem",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function FormField({ label, id, type, placeholder }: { label: string; id: string; type: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={4}
          className="input"
          style={{ resize: "vertical" }}
        />
      ) : (
        <input id={id} type={type} placeholder={placeholder} className="input" />
      )}
    </div>
  );
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}
function MailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  );
}
function MapPinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
