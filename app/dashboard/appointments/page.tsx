"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Calendar,
  CalendarDays,
  Plus,
  Search,
  Pencil,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";

interface Appointment {
  id: string;
  userId: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string | null;
  user?: { id: string; name: string; email: string };
}

interface Patient {
  id: string;
  user: { id: string; name: string };
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options?.headers },
    });
    if (res.status === 401) { window.location.href = "/login"; return null; }
    if (!res.ok) return null;
    const json = await res.json();
    return (json && typeof json === "object" && "data" in json) ? json.data as T : json as T;
  } catch { return null; }
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-green-400",
  completed: "bg-blue-400",
  cancelled: "bg-red-400",
};

const TYPES = ["consultation", "follow-up", "assessment", "treatment", "rehabilitation"];
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

/* ──────────────── CalendarView (inline) ──────────────── */

function CalendarView({ appointments, onEdit }: { appointments: Appointment[]; onEdit: (a: Appointment) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group appointments by date key (YYYY-MM-DD)
  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    const key = a.date.split("T")[0]; // "2026-07-28"
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // Build calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Build cells array (includes padding for leading/trailing days)
  const cells: { date: string; day: number; inMonth: boolean }[] = [];

  // Leading empty cells for days before the 1st
  for (let i = 0; i < startDayOfWeek; i++) {
    const d = new Date(year, month, -(startDayOfWeek - i - 1));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    cells.push({ date: key, day: d.getDate(), inMonth: false });
  }

  // Actual days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: key, day: d, inMonth: true });
  }

  // Trailing empty cells to fill the grid to a complete row
  while (cells.length % 7 !== 0) {
    const nextDate = new Date(year, month + 1, cells.length - startDayOfWeek - daysInMonth + 1);
    const key = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;
    cells.push({ date: key, day: nextDate.getDate(), inMonth: false });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Month navigation header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2
          className="text-lg font-semibold text-slate-900"
          style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
        >
          {monthLabel}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          const dayAppts = appointmentsByDate[cell.date] || [];
          const isToday = cell.date === todayStr;
          const isSelected = cell.date === selectedDate && dayAppts.length > 0;
          const hasAppts = dayAppts.length > 0;

          return (
            <div
              key={cell.date}
              className={`
                border-b border-r border-slate-50 min-h-[72px] p-1.5 relative
                transition-colors
                ${!cell.inMonth ? "bg-slate-50/50" : ""}
                ${isSelected ? "bg-blue-50" : ""}
                ${hasAppts && cell.inMonth ? "cursor-pointer hover:bg-blue-50/50" : ""}
              `}
              onClick={() => {
                if (hasAppts && cell.inMonth) {
                  setSelectedDate(selectedDate === cell.date ? null : cell.date);
                }
              }}
            >
              {/* Day number */}
              <div className="flex items-start justify-between">
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium
                    ${isToday ? "bg-blue-600 text-white" : ""}
                    ${!isToday && cell.inMonth ? "text-slate-700" : ""}
                    ${!cell.inMonth ? "text-slate-300" : ""}
                  `}
                >
                  {cell.day}
                </span>
                {hasAppts && dayAppts.length > 0 && cell.inMonth && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    {dayAppts.length}
                  </span>
                )}
              </div>

              {/* Status dots */}
              {hasAppts && cell.inMonth && (
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {dayAppts.slice(0, 4).map((a, i) => (
                    <span
                      key={i}
                      className={`block w-2 h-2 rounded-full ${STATUS_DOT_COLORS[a.status] || "bg-slate-300"}`}
                      title={`${a.user?.name || "Unknown"} – ${a.status}`}
                    />
                  ))}
                  {dayAppts.length > 4 && (
                    <span className="text-[9px] text-slate-400 leading-none">+{dayAppts.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded appointment details for selected date */}
      {selectedDate && appointmentsByDate[selectedDate] && (
        <div className="border-t border-blue-200 bg-blue-50/50 px-6 py-4 space-y-2">
          <p className="text-xs font-semibold text-blue-700 mb-2">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {appointmentsByDate[selectedDate].map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white rounded-xl border border-slate-200/60 px-4 py-2.5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`block w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT_COLORS[a.status] || "bg-slate-300"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">
                    {a.time} · <span className="capitalize">{a.type}</span> · <span className="capitalize">{a.status}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(a);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────── Main Page ──────────────── */

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("consultation");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    const [appts, pats] = await Promise.all([
      apiFetch<Appointment[]>("/api/appointments"),
      apiFetch<Patient[]>("/api/patients"),
    ]);
    if (appts) setAppointments(appts);
    if (pats) setPatients(pats);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = appointments.filter(
    (a) =>
      (a.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setPatientId(""); setDate(""); setTime(""); setType("consultation"); setStatus("pending"); setNotes(""); setEditingAppt(null); setError(""); };

  const openAdd = () => { resetForm(); setShowModal(true); };

  const openEdit = (a: Appointment) => {
    setEditingAppt(a);
    setPatientId(a.userId); setDate(a.date.split("T")[0]); setTime(a.time);
    setType(a.type); setStatus(a.status); setNotes(a.notes || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError("");
    const body = { userId: patientId, date: new Date(date).toISOString(), time, type, status, notes };

    if (editingAppt) {
      const res = await apiFetch(`/api/appointments/${editingAppt.id}`, { method: "PUT", body: JSON.stringify(body) });
      if (!res) setError("Failed to update appointment");
    } else {
      const res = await apiFetch("/api/appointments", { method: "POST", body: JSON.stringify(body) });
      if (!res) setError("Failed to create appointment");
    }
    setFormLoading(false);
    if (!error) { setShowModal(false); loadData(); }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">{appointments.length} total appointments</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => setViewMode("calendar")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              aria-label="Calendar view"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all">
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
      </div>

      {/* Content area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : viewMode === "calendar" ? (
        /* Calendar View */
        <CalendarView appointments={filtered} onEdit={openEdit} />
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Patient</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Time</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No appointments found</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">{a.user?.name || "Unknown"}</td>
                      <td className="px-5 py-3 text-slate-600">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-3 text-slate-600">{a.time}</td>
                      <td className="px-5 py-3 text-slate-600 capitalize">{a.type}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${STATUS_COLORS[a.status] || STATUS_COLORS.pending}`}>{a.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openEdit(a)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editingAppt ? "Edit Appointment" : "New Appointment"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Patient *</label>
                <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.user.id}>{p.user.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Date *</label><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Time *</label><input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                    {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : editingAppt ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
