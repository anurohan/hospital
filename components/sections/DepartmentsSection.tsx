import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";

const departments = [
  {
    name: "General Medicine",
    desc: "Comprehensive diagnosis and treatment for adult conditions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    color: "var(--color-primary-700)",
    bg: "var(--color-primary-50)",
  },
  {
    name: "Orthopaedics",
    desc: "Bone, joint, and muscle care with advanced surgical options.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="7" x2="20" y2="7"/>
        <line x1="4" y1="17" x2="20" y2="17"/>
      </svg>
    ),
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    name: "Gynaecology",
    desc: "Women's health, maternity, and reproductive medicine.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 18h6"/>
      </svg>
    ),
    color: "#db2777",
    bg: "#fdf2f8",
  },
  {
    name: "Paediatrics",
    desc: "Specialised care for infants, children, and adolescents.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    name: "General Surgery",
    desc: "Minimally invasive and open surgical procedures.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 4.5l5 5"/><path d="M5 19l4-4"/><path d="M9 15l-4 4 4 4 10-10-4-4-6 6z"/>
      </svg>
    ),
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    name: "ENT",
    desc: "Ear, nose, and throat care for all age groups.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h4l3-9 6 18 3-9h5"/>
      </svg>
    ),
    color: "#0284c7",
    bg: "#f0f9ff",
  },
];

export default function DepartmentsSection() {
  return (
    <section id="departments" className="section" style={{ backgroundColor: "#fff" }}>
      <div className="container">
        <SectionHeader
          tag="Our Specialties"
          title="Comprehensive Medical Departments"
          subtitle="From routine check-ups to complex surgical procedures — our multi-specialty team is equipped to handle all your healthcare needs."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {departments.map((dept, i) => (
            <Link
              key={dept.name}
              href={`/departments/${dept.name.toLowerCase().replace(/\s+/g, "-")}`}
              id={`dept-card-${dept.name.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`card card-hover animate-fade-in stagger-${Math.min(i + 1, 5)}`}
                style={{ height: "100%", cursor: "pointer" }}
              >
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: dept.bg,
                      color: dept.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {dept.icon}
                  </div>

                  <div>
                    <h4
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      {dept.name}
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {dept.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: dept.color,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      marginTop: "auto",
                    }}
                  >
                    View Department
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
          <Link href="/departments" className="btn btn-outline btn-md" style={{ textDecoration: "none" }}>
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  );
}
