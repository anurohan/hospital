import React from "react";
import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";

const stats = [
  { value: "10k+", label: "Patients cared for" },
  { value: "22+", label: "Specialists" },
  { value: "24/7", label: "Emergency support" },
  { value: "4.9/5", label: "Patient experience" },
];

const trustPills = ["Same-day visits", "Digital records", "Preventive care"];

export default function HeroSection() {
  return (
    <section id="hero" className="hero-pattern hero-landing">
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />

      <div className="container hero-shell">
        <div className="hero-grid">
          <div className="hero-copy animate-fade-in">
            <div className="hero-badge">
              <span className="pulse-dot" />
              Digital-first, human-centered care
            </div>

            <h1>
              Better care for
              <span className="gradient-text"> everyday living</span>
            </h1>

            <p>
              {HOSPITAL_CONFIG.name} brings together compassionate clinicians,
              advanced technology, and a seamless patient journey to help every
              family feel supported at every step.
            </p>

            <div className="hero-actions">
              <Link href="/appointments/book" className="btn btn-teal btn-lg hero-primary-btn">
                Book Appointment
              </Link>
              <Link href="/departments" className="btn btn-outline btn-lg hero-secondary-btn">
                Explore Services
              </Link>
            </div>

            <div className="hero-trust-row">
              {trustPills.map((item) => (
                <span key={item} className="trust-badge">
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual animate-fade-in stagger-2">
            <div className="dashboard-card">
              <div className="dashboard-header">
                <div className="mini-badge">Live care dashboard</div>
                <div className="online-indicator">
                  <span /> Online now
                </div>
              </div>

              <div className="doctor-panel">
                <div className="doctor-avatar">DR</div>
                <div>
                  <h3>Dr. Maya Patel</h3>
                  <p>Senior Consultant</p>
                </div>
              </div>

              <div className="metric-grid">
                <div className="metric-card accent">
                  <span>Patient satisfaction</span>
                  <strong>98%</strong>
                </div>
                <div className="metric-card purple">
                  <span>Slot availability</span>
                  <strong>12</strong>
                </div>
                <div className="metric-card blue">
                  <span>Response time</span>
                  <strong>8 min</strong>
                </div>
                <div className="metric-card green">
                  <span>Care teams</span>
                  <strong>26</strong>
                </div>
              </div>

              <div className="schedule-card">
                <div className="schedule-header">
                  <span>Today&apos;s schedule</span>
                  <span className="tag-pill">Updated</span>
                </div>
                <ul>
                  <li>
                    <span className="time">09:30</span>
                    <span>Cardiology review</span>
                  </li>
                  <li>
                    <span className="time">11:00</span>
                    <span>Preventive screening</span>
                  </li>
                  <li>
                    <span className="time">14:15</span>
                    <span>Virtual consultation</span>
                  </li>
                </ul>
              </div>

              <div className="floating-pill floating-pill-top">Same-day consults</div>
              <div className="floating-pill floating-pill-bottom">24/7 emergency support</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-landing {
          position: relative;
          overflow: hidden;
          padding: 5rem 0 5.5rem;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.25), transparent 30%),
            radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.18), transparent 35%),
            linear-gradient(135deg, #06131f 0%, #0b1d2d 38%, #0e2037 100%);
        }

        .hero-shell {
          position: relative;
          z-index: 1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.95fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-copy {
          max-width: 640px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(15, 23, 42, 0.35);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.82);
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          display: inline-block;
          background: linear-gradient(135deg, #5eead4, #38bdf8);
          box-shadow: 0 0 0 0 rgba(94, 234, 212, 0.8);
          animation: pulse-dot 1.9s ease-in-out infinite;
        }

        .hero-copy h1 {
          margin: 0 0 1.25rem;
          color: #f8fbff;
          font-size: clamp(3rem, 5vw, 5.2rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          max-width: 640px;
        }

        .gradient-text {
          display: inline-block;
          background: linear-gradient(135deg, #7dd3fc 0%, #5eead4 30%, #c4b5fd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-copy p {
          max-width: 560px;
          font-size: 1.1rem;
          color: rgba(226, 232, 240, 0.72);
          margin-bottom: 2rem;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .hero-primary-btn,
        .hero-secondary-btn {
          text-decoration: none;
        }

        .hero-secondary-btn {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(148, 163, 184, 0.35);
          color: rgba(255,255,255,0.9);
        }

        .hero-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .trust-badge {
          border: 1px solid rgba(96, 165, 250, 0.28);
          background: rgba(15, 118, 110, 0.14);
          color: rgba(191, 219, 254, 0.94);
          padding: 0.5rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(110px, 1fr));
          gap: 1rem;
          max-width: 560px;
        }

        .stat-card {
          padding: 1rem 0.9rem;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(15, 23, 42, 0.32);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-card strong {
          font-size: 1.4rem;
          color: #f8fbff;
          letter-spacing: -0.04em;
        }

        .stat-card span {
          color: rgba(191, 219, 254, 0.72);
          font-size: 0.72rem;
          line-height: 1.4;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
        }

        .dashboard-card {
          position: relative;
          width: min(100%, 520px);
          padding: 1.5rem;
          border-radius: 2rem;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(8, 18, 30, 0.76) 100%);
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 30px 80px rgba(2, 6, 23, 0.45);
          backdrop-filter: blur(18px);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .mini-badge {
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          background: rgba(125, 211, 252, 0.08);
          border: 1px solid rgba(125, 211, 252, 0.18);
          color: #bfdbfe;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .online-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(224, 242, 254, 0.85);
          font-size: 0.74rem;
          font-weight: 600;
        }

        .online-indicator span {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.15);
        }

        .doctor-panel {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.1rem;
          border-radius: 1.2rem;
          background: rgba(15, 118, 110, 0.1);
          border: 1px solid rgba(45, 212, 191, 0.15);
          margin-bottom: 1rem;
        }

        .doctor-avatar {
          width: 3.3rem;
          height: 3.3rem;
          border-radius: 1rem;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #7dd3fc, #34d399);
          color: #06131f;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .doctor-panel h3 {
          margin: 0;
          color: #f8fbff;
          font-size: 1.05rem;
        }

        .doctor-panel p {
          margin: 0.2rem 0 0;
          color: rgba(191,219,254,0.7);
          font-size: 0.78rem;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
          margin-bottom: 1rem;
        }

        .metric-card {
          padding: 1rem;
          border-radius: 1.1rem;
          border: 1px solid rgba(148,163,184,0.15);
          min-height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .metric-card span {
          color: rgba(191,219,254,0.78);
          font-size: 0.72rem;
          line-height: 1.4;
        }

        .metric-card strong {
          color: #f8fbff;
          font-size: clamp(1.2rem, 3vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        .metric-card.accent {
          background: linear-gradient(135deg, rgba(96,165,250,0.18), rgba(37,99,235,0.08));
        }

        .metric-card.purple {
          background: linear-gradient(135deg, rgba(192,132,252,0.18), rgba(168,85,247,0.08));
        }

        .metric-card.blue {
          background: linear-gradient(135deg, rgba(125,211,252,0.18), rgba(14,165,233,0.08));
        }

        .metric-card.green {
          background: linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.08));
        }

        .schedule-card {
          border-radius: 1.2rem;
          border: 1px solid rgba(148,163,184,0.18);
          background: rgba(15, 23, 42, 0.42);
          padding: 1rem 1rem 0.5rem;
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          color: rgba(226,232,240,0.82);
          margin-bottom: 0.75rem;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(52,211,153,0.2);
          color: #a7f3d0;
          padding: 0.3rem 0.5rem;
          border-radius: 999px;
          font-weight: 700;
        }

        .schedule-card ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding: 0;
          margin: 0;
        }

        .schedule-card li {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: rgba(226,232,240,0.8);
          font-size: 0.82rem;
        }

        .time {
          min-width: 58px;
          padding: 0.38rem 0.5rem;
          border-radius: 0.7rem;
          background: rgba(96,165,250,0.12);
          border: 1px solid rgba(96,165,250,0.18);
          color: #bfdbfe;
          font-weight: 700;
          text-align: center;
        }

        .floating-pill {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 0.9rem;
          border-radius: 999px;
          background: rgba(7, 10, 15, 0.72);
          border: 1px solid rgba(148,163,184,0.2);
          color: rgba(255,255,255,0.9);
          font-size: 0.72rem;
          font-weight: 700;
          backdrop-filter: blur(12px);
          box-shadow: 0 15px 30px rgba(2, 6, 23, 0.2);
        }

        .floating-pill-top {
          top: -0.8rem;
          left: -0.8rem;
          transform: rotate(-8deg);
        }

        .floating-pill-bottom {
          right: -0.8rem;
          bottom: 1.2rem;
          transform: rotate(8deg);
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(18px);
          opacity: 0.8;
        }

        .hero-glow-one {
          top: 4%;
          right: -7%;
          width: 28rem;
          height: 28rem;
          background: radial-gradient(circle, rgba(96,165,250,0.32) 0%, rgba(96,165,250,0) 70%);
        }

        .hero-glow-two {
          bottom: -5%;
          left: -3%;
          width: 26rem;
          height: 26rem;
          background: radial-gradient(circle, rgba(45,212,191,0.2) 0%, rgba(45,212,191,0) 72%);
        }

        @keyframes pulse-dot {
          0% {
            box-shadow: 0 0 0 0 rgba(94, 234, 212, 0.7);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(94, 234, 212, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(94, 234, 212, 0);
          }
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }

          .hero-copy {
            max-width: 100%;
          }

          .hero-stats-grid {
            grid-template-columns: repeat(2, minmax(120px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .hero-landing {
            padding-top: 4rem;
          }

          .hero-copy h1 {
            font-size: clamp(2.6rem, 13vw, 4rem);
          }

          .hero-stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .dashboard-card {
            padding: 1rem;
          }

          .floating-pill {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
