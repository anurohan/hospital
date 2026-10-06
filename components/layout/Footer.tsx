import React from "react";
import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";

const footerLinks = {
  "Quick Links": [
    { label: "Home",             href: "/" },
    { label: "Departments",      href: "/departments" },
    { label: "Our Doctors",      href: "/doctors" },
    { label: "Services",         href: "/services" },
    { label: "About Us",         href: "/about" },
    { label: "Contact",          href: "/contact" },
  ],
  "Patient Services": [
    { label: "Book Appointment", href: "/appointments/book" },
    { label: "Patient Portal",   href: "/portal" },
    { label: "Health Packages",  href: "/packages" },
    { label: "Pharmacy",         href: "/pharmacy" },
    { label: "Lab Reports",      href: "/reports" },
  ],
  "Information": [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ",              href: "/faq" },
    { label: "Careers",          href: "/careers" },
    { label: "Feedback",         href: "/feedback" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-navy-900)",
        color: "rgba(255,255,255,0.75)",
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-8)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container">
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-10)",
            marginBottom: "var(--space-12)",
          }}
          className="footer-grid"
        >
          {/* Hospital info column */}
          <div>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-lg)",
                  background: "linear-gradient(135deg, var(--color-primary-700), var(--color-teal-500))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  {HOSPITAL_CONFIG.name}
                </div>
                <div style={{ fontSize: "0.7rem", opacity: 0.55, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Est. Healthcare Excellence
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "300px", color: "rgba(255,255,255,0.6)", marginBottom: "var(--space-5)" }}>
              {HOSPITAL_CONFIG.tagline}. Serving the people of{" "}
              {HOSPITAL_CONFIG.address.city},{" "}
              {HOSPITAL_CONFIG.address.state} with compassionate, quality healthcare.
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <FooterContact
                icon={<PhoneIcon />}
                text={HOSPITAL_CONFIG.contact.phone}
                href={`tel:${HOSPITAL_CONFIG.contact.phone.replace(/\s/g, "")}`}
              />
              <FooterContact
                icon={<MailIcon />}
                text={HOSPITAL_CONFIG.contact.email}
                href={`mailto:${HOSPITAL_CONFIG.contact.email}`}
              />
              <FooterContact
                icon={<MapIcon />}
                text={`${HOSPITAL_CONFIG.address.line1}, ${HOSPITAL_CONFIG.address.city}, ${HOSPITAL_CONFIG.address.state} ${HOSPITAL_CONFIG.address.pincode}`}
                href={HOSPITAL_CONFIG.mapUrl}
                external
              />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  marginBottom: "var(--space-4)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        transition: "color var(--transition-fast)",
                      }}
                      className="footer-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergency CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(10,110,189,0.25), rgba(0,180,160,0.2))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "rgba(220,38,38,0.2)",
                border: "1px solid rgba(220,38,38,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                24×7 Emergency
              </div>
              <div style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem" }}>
                {HOSPITAL_CONFIG.contact.emergencyPhone}
              </div>
            </div>
          </div>
          <a
            href={`tel:${HOSPITAL_CONFIG.contact.emergencyPhone.replace(/\s/g, "")}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Call Emergency
          </a>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
            © {currentYear} {HOSPITAL_CONFIG.name}. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            Bishunganj, Gaya, Bihar, India · {HOSPITAL_CONFIG.contact.phone}
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: rgba(255,255,255,0.95) !important; }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function FooterContact({
  icon,
  text,
  href,
  external,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-2)",
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.875rem",
        textDecoration: "none",
        transition: "color var(--transition-fast)",
      }}
      className="footer-link"
    >
      <span style={{ marginTop: "2px", flexShrink: 0 }}>{icon}</span>
      {text}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
