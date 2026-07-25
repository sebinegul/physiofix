"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Stethoscope,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Consultation {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  followUpDate: string | null;
  patient?: { id: string; user?: { name: string } };
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

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const loadData = async () => {
    const [cons, pats] = await Promise.all([
      apiFetch<Consultation[]>("/api/consultations"),
      apiFetch<Patient[]>("/api/patients"),
    ]);
    if (cons) setConsultations(cons);
    if (pats) setPatients(pats);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = consultations.filter(
    (c) =>
      (c.patient?.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      c.treatment.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setPatientId(""); setDate(""); setDiagnosis(""); setTreatment(""); setNotes(""); setFollowUpDate(""); setEditing(null); setError(""); };
  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (c: Consultation) => { setEditing(c); setPatientId(c.patientId); setDate(c.date.split("T")[0]); setDiagnosis(c.diagnosis); setTreatment(c.treatment); setNotes(c.notes || ""); setFollowUpDate(c.followUpDate ? c.followUpDate.split("T")[0] : ""); setShowModal(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError("");
    const body: any = { patientId, date: new Date(date).toISOString(), diagnosis, treatment, notes };
    if (followUpDate) body.followUpDate = new Date(followUpDate).toISOString();

    if (editing) {
      const res = await apiFetch(`/api/consultations/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      if (!res) setError("Failed to update consultation");
    } else {
      const res = await apiFetch("/api/consultations", { method: "POST", body: JSON.stringify(body) });
      if (!res) setError("Failed to create consultation");
    }
    setFormLoading(false);
    if (!error) { setShowModal(false); loadData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this consultation?")) return;
    await apiFetch(`/api/consultations/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>Consultations</h1>
          <p className="text-sm text-slate-500 mt-1">{consultations.length} total consultations</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> New Consultation
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search consultations..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Patient</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Diagnosis</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Treatment</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Follow-up</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No consultations found</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">{c.patient?.user?.name || "Unknown"}</td>
                      <td className="px-5 py-3 text-slate-600">{new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{c.diagnosis}</td>
                      <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{c.treatment}</td>
                      <td className="px-5 py-3 text-slate-600">{c.followUpDate ? new Date(c.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editing ? "Edit Consultation" : "New Consultation"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Patient *</label>
                <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.user.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Date *</label><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Follow-up Date</label><input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis *</label><textarea required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Treatment *</label><textarea required value={treatment} onChange={(e) => setTreatment(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
