import React from "react";
import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";

const stats = [
  { value: "10,000+", label: "Patients Served" },
  { value: "15+",     label: "Specialist Doctors" },
  { value: "20+",     label: "Departments" },
  { value: "24×7",    label: "Emergency Care" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="hero-pattern"
      style={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        padding: "var(--space-20) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blur circles */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(10,110,189,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-8%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,160,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left column: text */}
          <div className="animate-fade-in">
            {/* Tag pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                backgroundColor: "rgba(10,110,189,0.15)",
                border: "1px solid rgba(10,110,189,0.3)",
                borderRadius: "var(--radius-full)",
                padding: "6px 16px",
                marginBottom: "var(--space-6)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-teal-400)",
                  animation: "pulse-ring 2s ease-in-out infinite",
                  display: "block",
                }}
              />
              <span style={{ color: "var(--color-primary-300)", fontSize: "0.8125rem", fontWeight: 500 }}>
                Now accepting online appointments
              </span>
            </div>

            <h1
              style={{
                color: "#fff",
                marginBottom: "var(--space-6)",
                letterSpacing: "-0.03em",
              }}
            >
              Advanced Healthcare,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60b4ff, var(--color-teal-400))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Close to Home
              </span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "1.125rem",
                lineHeight: 1.75,
                maxWidth: "520px",
                marginBottom: "var(--space-8)",
              }}
            >
              {HOSPITAL_CONFIG.name} brings world-class medical expertise to{" "}
              {HOSPITAL_CONFIG.address.city}. Expert doctors, modern diagnostics,
              and 24×7 emergency care — all under one roof.
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                marginBottom: "var(--space-12)",
              }}
            >
              <Link
                href="/appointments/book"
                id="hero-book-appointment-btn"
                className="btn btn-teal btn-lg"
                style={{ textDecoration: "none" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book Appointment
              </Link>
              <Link
                href="/departments"
                id="hero-departments-btn"
                className="btn btn-outline btn-lg"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                }}
              >
                Our Specialties
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--space-4)",
                maxWidth: "440px",
              }}
              className="hero-stats-grid"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`animate-fade-in stagger-${i + 2}`}
                  style={{
                    borderLeft: "2px solid var(--color-primary-600)",
                    paddingLeft: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.625rem",
                      color: "#fff",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8125rem" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: appointment quick-book card */}
          <div className="animate-fade-in stagger-2 hide-mobile">
            <QuickBookCard />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 420px !important;
          }
        }
        @media (min-width: 640px) {
          .hero-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            max-width: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Quick Book Card ──────────────────────────────────────────────────────────

function QuickBookCard() {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "var(--radius-2xl)",
        padding: "var(--space-8)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
      }}
    >
      <h3
        style={{
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "var(--space-6)",
        }}
      >
        Quick Appointment
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <QuickField label="Patient Name" placeholder="Your full name" type="text" />
        <QuickField label="Phone Number" placeholder="+91 XXXXX XXXXX" type="tel" />

        {/* Department select */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              marginBottom: "6px",
            }}
          >
            Department
          </label>
          <select
            id="quick-book-department"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="" style={{ background: "#1a2a4a" }}>Select department</option>
            <option value="general" style={{ background: "#1a2a4a" }}>General Medicine</option>
            <option value="ortho" style={{ background: "#1a2a4a" }}>Orthopaedics</option>
            <option value="gynae" style={{ background: "#1a2a4a" }}>Gynaecology</option>
            <option value="paeds" style={{ background: "#1a2a4a" }}>Paediatrics</option>
            <option value="surgery" style={{ background: "#1a2a4a" }}>General Surgery</option>
            <option value="ent" style={{ background: "#1a2a4a" }}>ENT</option>
          </select>
        </div>

        <QuickField label="Preferred Date" placeholder="" type="date" />

        <Link
          href="/appointments/book"
          id="quick-book-submit"
          className="btn btn-teal btn-lg"
          style={{
            width: "100%",
            justifyContent: "center",
            textDecoration: "none",
            marginTop: "var(--space-2)",
          }}
        >
          Book Appointment →
        </Link>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.75rem",
            margin: 0,
          }}
        >
          Free consultation booking · No hidden charges
        </p>
      </div>
    </div>
  );
}

function QuickField({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={`quick-book-${id}`}
        style={{
          display: "block",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        id={`quick-book-${id}`}
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "var(--radius-md)",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.9)",
          fontSize: "0.9rem",
          outline: "none",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}
