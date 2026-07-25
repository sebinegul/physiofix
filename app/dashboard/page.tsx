"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Dumbbell,
  Stethoscope,
  TrendingUp,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";

interface Stats {
  patients: number;
  appointments: number;
  exercises: number;
  consultations: number;
}

interface RecentAppointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  user?: { name: string };
}

interface RecentConsultation {
  id: string;
  date: string;
  diagnosis: string;
  patient?: { user?: { name: string } };
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function fetchAPI<T>(url: string): Promise<T | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return null;
    }
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ patients: 0, appointments: 0, exercises: 0, consultations: 0 });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<RecentConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u.name || "Admin");
      } catch { /* ignore */ }
    }

    async function loadData() {
      const [patientsRes, appointmentsRes, exercisesRes, consultationsRes] = await Promise.all([
        fetchAPI<unknown[]>("/api/patients"),
        fetchAPI<unknown[]>("/api/appointments"),
        fetchAPI<unknown[]>("/api/exercises"),
        fetchAPI<unknown[]>("/api/consultations"),
      ]);

      setStats({
        patients: Array.isArray(patientsRes) ? patientsRes.length : 0,
        appointments: Array.isArray(appointmentsRes) ? appointmentsRes.length : 0,
        exercises: Array.isArray(exercisesRes) ? exercisesRes.length : 0,
        consultations: Array.isArray(consultationsRes) ? consultationsRes.length : 0,
      });

      if (Array.isArray(appointmentsRes)) {
        const typed = appointmentsRes as RecentAppointment[];
        const sorted = [...typed]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecentAppointments(sorted);
      }

      if (Array.isArray(consultationsRes)) {
        const typed = consultationsRes as RecentConsultation[];
        const sorted = [...typed]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecentConsultations(sorted);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Patients", value: stats.patients, icon: Users, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Appointments", value: stats.appointments, icon: Calendar, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { label: "Exercises", value: stats.exercises, icon: Dumbbell, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Consultations", value: stats.consultations, icon: Stethoscope, color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", iconColor: "text-cyan-600" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
          Welcome back, {userName} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your practice today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                    {card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Clock className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900">Recent Appointments</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recentAppointments.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No appointments yet</p>
            ) : (
              recentAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{appt.user?.name || "Unknown"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {appt.time}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusBadge(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Activity className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-900">Recent Consultations</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recentConsultations.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No consultations yet</p>
            ) : (
              recentConsultations.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.patient?.user?.name || "Unknown"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.diagnosis}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
