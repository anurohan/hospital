"use client";

import { useMemo, useSyncExternalStore } from "react";

type Phase = {
  name: string;
  startPercent: number;
  endPercent: number;
  color: string;
  description: string;
};

const projectPlan: Phase[] = [
  {
    name: "Planning",
    startPercent: 0,
    endPercent: 15,
    color: "#38bdf8",
    description: "Requirements, scope, and hospital workflow design.",
  },
  {
    name: "UI Foundation",
    startPercent: 15,
    endPercent: 35,
    color: "#2dd4bf",
    description: "Landing page, branding, and core patient-facing screens.",
  },
  {
    name: "Patient Portal",
    startPercent: 35,
    endPercent: 55,
    color: "#a78bfa",
    description: "Appointments, records, and patient self-service flows.",
  },
  {
    name: "Doctor Dashboard",
    startPercent: 55,
    endPercent: 75,
    color: "#fbbf24",
    description: "Schedule management, patient views, and doctor tools.",
  },
  {
    name: "Admin + Analytics",
    startPercent: 75,
    endPercent: 90,
    color: "#f97316",
    description: "Reports, analytics, billing support, and controls.",
  },
  {
    name: "Launch & QA",
    startPercent: 90,
    endPercent: 100,
    color: "#34d399",
    description: "Testing, polish, bug fixes, and deployment readiness.",
  },
];

const projectStart = new Date("2026-10-09T00:00:00+05:30");
const projectEnd = new Date(projectStart.getTime() + 1000 * 60 * 60 * 24 * 30);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function subscribeTime(callback: () => void) {
  const timer = window.setInterval(() => {
    currentTimestamp = Date.now();
    callback();
  }, 1000);
  return () => window.clearInterval(timer);
}

let currentTimestamp = Date.now();

function getTimeSnapshot() {
  return currentTimestamp;
}

function getServerTimeSnapshot() {
  return null;
}

export default function ProgressPage() {
  const timestamp = useSyncExternalStore(subscribeTime, getTimeSnapshot, getServerTimeSnapshot);
  const now = useMemo(() => (timestamp ? new Date(timestamp) : null), [timestamp]);

  const progress = useMemo(() => {
    if (!now) return 0;

    const totalDuration = projectEnd.getTime() - projectStart.getTime();
    const elapsed = now.getTime() - projectStart.getTime();
    const value = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
    return clamp(value, 0, 100);
  }, [now]);

  const completed = Math.round(progress);
  const remaining = 100 - completed;
  const updatedAt = now
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(now)
    : "Loading...";

  if (!now) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-8 w-40 rounded-full bg-slate-800" />
          <div className="h-12 w-3/4 rounded-2xl bg-slate-800" />
          <div className="mt-8 h-[360px] rounded-3xl bg-slate-900" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Project Tracker
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">
              Hospital Management SaaS Progress
            </h1>
          </div>
          <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            Updated: {updatedAt}
          </div>
        </div>

        <section className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 md:grid-cols-[1.1fr_2fr] md:p-8">
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative flex h-64 w-64 items-center justify-center rounded-full border border-slate-700"
              style={{
                background: `conic-gradient(#10b981 ${progress * 3.6}deg, rgba(148, 163, 184, 0.25) 0deg)`,
              }}
            >
              <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-slate-950 text-center shadow-inner shadow-slate-900">
                <span className="text-5xl font-black text-white">{completed}%</span>
                <span className="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">
                  done
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Completed</p>
                <p className="mt-3 text-4xl font-black text-white">{completed}%</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Remaining</p>
                <p className="mt-3 text-4xl font-black text-white">{remaining}%</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                <span>Current project pace</span>
                <span className="font-semibold text-white">{completed}% / 100%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-700"
                  style={{ width: `${completed}%` }}
                />
              </div>
            </div>

            <div className="mt-5 text-sm leading-7 text-slate-300">
              <p>
                <span className="font-semibold text-white">Planned project window:</span> {projectStart.toLocaleDateString("en-IN")} to {projectEnd.toLocaleDateString("en-IN")}
              </p>
              <p>
                <span className="font-semibold text-white">Status:</span> {completed >= 100 ? "Completed" : completed >= 80 ? "Near completion" : completed >= 50 ? "In progress" : "Starting phase"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Work plan</h2>
            <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Auto-updating</span>
          </div>

          <div className="space-y-5">
            {projectPlan.map((phase) => {
              const phaseWidth = phase.endPercent - phase.startPercent;
              const active = progress >= phase.startPercent && progress <= phase.endPercent;

              return (
                <div key={phase.name}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{phase.name}</p>
                      <p className="text-sm text-slate-400">{phase.description}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-300">{phase.startPercent}% - {phase.endPercent}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${phaseWidth}%`,
                        backgroundColor: phase.color,
                        opacity: active ? 1 : 0.45,
                        boxShadow: active ? `0 0 18px ${phase.color}` : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
