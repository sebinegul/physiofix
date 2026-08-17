"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Clock,
  StickyNote,
} from "lucide-react";

interface RosterBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  createdBy?: { name: string };
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (res.status === 401) { window.location.href = "/login"; return null; }
    if (!res.ok) return null;
    const json = await res.json();
    return (json && typeof json === "object" && "data" in json) ? json.data as T : json as T;
  } catch { return null; }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00.000Z`);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function formatRange(start: string, end: string): string {
  const to12 = (v: string) => {
    const [h, m] = v.split(":").map(Number);
    const meridian = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${meridian}`;
  };
  return `${to12(start)} – ${to12(end)}`;
}

export default function RosterPage() {
  const [blocks, setBlocks] = useState<RosterBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(todayStr());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    const data = await apiFetch<RosterBlock[]>("/api/roster");
    if (data) {
      setBlocks(data);
      setError(null);
    } else {
      setError("Could not load the roster. Make sure you are logged in as admin.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setDate(todayStr());
    setStartTime("09:00");
    setEndTime("10:00");
    setReason("");
    setFormError(null);
  };

  const startEdit = (b: RosterBlock) => {
    setEditingId(b.id);
    setDate(b.date.split("T")[0]);
    setStartTime(b.startTime);
    setEndTime(b.endTime);
    setReason(b.reason ?? "");
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setNotice(null);

    const toMin = (v: string) => {
      const [h, m] = v.split(":").map(Number);
      return h * 60 + m;
    };
    if (!date) { setFormError("Please pick a date."); return; }
    if (!startTime || !endTime) { setFormError("Please set a start and end time."); return; }
    if (toMin(endTime) <= toMin(startTime)) { setFormError("End time must be after start time."); return; }

    setSaving(true);
    const url = editingId ? `/api/roster/${editingId}` : "/api/roster";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startTime, endTime, reason: reason.trim() || undefined }),
    });
    setSaving(false);
    if (res.status === 401) { window.location.href = "/login"; return; }
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      setFormError(json?.error || "Something went wrong. Please try again.");
      return;
    }
    setNotice(editingId ? "Roster block updated." : "Roster block added — those slots are now blocked for patients.");
    resetForm();
    await load();
  };

  const handleDelete = async (b: RosterBlock) => {
    if (!window.confirm(`Remove the block on ${formatDate(b.date.split("T")[0])} (${formatRange(b.startTime, b.endTime)})?`)) return;
    const res = await fetch(`/api/roster/${b.id}`, { method: "DELETE" });
    if (res.status === 401) { window.location.href = "/login"; return; }
    if (res.ok) {
      setNotice("Roster block removed — those slots are bookable again.");
      await load();
    } else {
      setFormError("Could not delete the block. Please try again.");
    }
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          Doctor Roster
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Block time ranges when you are unavailable (house visits, training, leave). Blocked slots are hidden from
          patients and cannot be booked.
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add / Edit form */}
        <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">
            {editingId ? "Edit roster block" : "Add a roster block"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {editingId ? "Update the details below and save." : "Example: a house visit from 3:00 PM to 4:00 PM."}
          </p>

          {formError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {formError}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <CalendarDays className="h-3.5 w-3.5 text-blue-500" /> Date
              </label>
              <input type="date" value={date} min={todayStr()} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-blue-500" /> Start
                </label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-blue-500" /> End
                </label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <StickyNote className="h-3.5 w-3.5 text-blue-500" /> Reason (optional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. House visit, Training, Leave"
                className={inputCls}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200/50 transition hover:shadow-lg disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Save changes" : "Block slots"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* List */}
        <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-bold text-slate-900">Upcoming blocks</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {loading ? "Loading…" : `${blocks.length} block${blocks.length === 1 ? "" : "s"} on the roster`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading roster…
            </div>
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <CalendarClock className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No blocks yet</p>
              <p className="max-w-xs text-xs text-slate-400">
                Add a block on the left whenever you need to hold time for house visits or personal commitments.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {blocks.map((b) => {
                const dateKey = b.date.split("T")[0];
                const isPast = dateKey < todayStr();
                return (
                  <li key={b.id} className={`flex items-center gap-3 px-5 py-3.5 ${isPast ? "opacity-50" : ""}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{formatDate(dateKey)}</p>
                      <p className="text-xs text-slate-500">
                        {formatRange(b.startTime, b.endTime)}
                        {b.reason ? ` · ${b.reason}` : ""}
                        {b.createdBy?.name ? ` · by ${b.createdBy.name}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => startEdit(b)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                        aria-label={`Edit block on ${dateKey}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                        aria-label={`Delete block on ${dateKey}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
