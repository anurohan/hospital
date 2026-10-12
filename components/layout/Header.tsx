"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";


const navLinks = [
  { label: "Home",          href: "/" },
  { label: "Departments",   href: "/departments" },
  { label: "Doctors",       href: "/doctors" },
  { label: "Services",      href: "/services" },
  { label: "About",         href: "/about" },
  { label: "Contact",       href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div
        style={{
          background: "linear-gradient(90deg, #0f172a 0%, #0a6ebd 35%, #0f766e 100%)",
          color: "#fff",
          fontSize: "0.8125rem",
          padding: "8px 0",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div className="container flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${HOSPITAL_CONFIG.contact.emergencyPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Emergency: {HOSPITAL_CONFIG.contact.emergencyPhone}
            </a>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>OPD: {HOSPITAL_CONFIG.hours.opd}</span>
          </div>
          <div className="hide-mobile flex items-center gap-4">
            <a
              href={`mailto:${HOSPITAL_CONFIG.contact.email}`}
              style={{ color: "inherit", textDecoration: "none", opacity: 0.85 }}
              className="hover:opacity-100 transition-opacity"
            >
              {HOSPITAL_CONFIG.contact.email}
            </a>
          </div>
        </div>
      </div>

      <header
        id="main-header"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(148,163,184,0.18)",
          position: "sticky",
          top: 0,
          zIndex: "var(--z-sticky)",
          boxShadow: "0 12px 36px rgba(15,23,42,0.08)",
        }}
      >
        <div className="container" style={{ paddingBlock: "0" }}>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "74px",
              gap: "var(--space-6)",
            }}
          >
            <Link
              href="/"
              style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", textDecoration: "none" }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "1rem",
                  background: "linear-gradient(135deg, #0a6ebd 0%, #14b8a6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 12px 30px rgba(14,165,233,0.25)",
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
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {HOSPITAL_CONFIG.name}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  {HOSPITAL_CONFIG.address.city}, {HOSPITAL_CONFIG.address.state}
                </div>
              </div>
            </Link>

            <ul
              className="hide-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                listStyle: "none",
              }}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "999px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      transition: "all var(--transition-fast)",
                      display: "block",
                    }}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Link
                href="/appointments/book"
                id="header-book-btn"
                className="btn btn-primary btn-sm hide-mobile"
                style={{ borderRadius: "999px", boxShadow: "0 16px 30px rgba(14,165,233,0.18)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/>
                  <line x1="16" y1="14" x2="16" y2="14"/>
                </svg>
                Book Appointment
              </Link>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="show-mobile btn btn-ghost btn-sm"
                aria-label="Toggle mobile menu"
                style={{ padding: "8px", borderRadius: "999px" }}
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>
          </nav>
        </div>

        {mobileOpen && (
          <div
            className="show-mobile"
            style={{
              borderTop: "1px solid rgba(148,163,184,0.18)",
              backgroundColor: "#fff",
              padding: "var(--space-4)",
            }}
          >
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li style={{ marginTop: "var(--space-3)" }}>
                <Link
                  href="/appointments/book"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary btn-md"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <style>{`
        .nav-link:hover {
          color: var(--color-primary-700) !important;
          background-color: var(--color-primary-50);
        }
      `}</style>
    </>
  );
}
