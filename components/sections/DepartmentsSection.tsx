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
    <section id="departments" className="section" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)" }}>
      <div className="section-shell container">
        <SectionHeader
          tag="Our Specialties"
          title="Comprehensive Medical Departments"
          subtitle="From routine wellness checks to advanced treatment plans, our multi-specialty team delivers confident, compassionate care for every life stage."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.4rem",
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
                style={{ height: "100%", cursor: "pointer", borderRadius: "1.5rem" }}
              >
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "1.2rem",
                      background: `linear-gradient(135deg, ${dept.bg}, rgba(255,255,255,0.9))`,
                      color: dept.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                    }}
                  >
                    {dept.icon}
                  </div>

                  <div>
                    <h4
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                        fontSize: "1.1rem",
                      }}
                    >
                      {dept.name}
                    </h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                      {dept.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: dept.color,
                      fontSize: "0.8rem",
                      fontWeight: 700,
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

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/departments" className="btn btn-outline btn-md" style={{ textDecoration: "none", borderRadius: "999px" }}>
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  );
}
