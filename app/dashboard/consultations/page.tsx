"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Dumbbell,
  Copy,
  Check,
  Eye,
  Stethoscope,
  Heart,
  FileText,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */

interface TreatmentPlanItem {
  title: string;
  description: string;
  duration: string;
  frequency: string;
  days: number;
}

interface Consultation {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  investigation: string | null;
  impressions: string | null;
  medicalHistory: string | null;
  pshx: string | null;
  notes: string | null;
  followUpDate: string | null;
  treatmentPlan?: TreatmentPlanItem[] | string | null;
  patient?: { id: string; user?: { name: string } };
}

interface Patient {
  id: string;
  user: { id: string; name: string };
}

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration: number | null;
  instructions: string | null;
  imageUrl: string | null;
  gifUrl: string | null;
  videoUrl: string | null;
}

interface ExercisePlanItem {
  exerciseId: string;
  sets: number;
  durationSeconds: number;
  sortOrder: number;
  notes?: string;
}

interface DayPlanData {
  dayNumber: number;
  label: string;
  items: ExercisePlanItem[];
}

interface ExercisePlanSummary {
  id: string;
  patientId: string;
  consultationId: string | null;
  totalDays: number;
  title: string | null;
  createdAt: string;
  patient?: { id: string; user?: { name: string } };
  dailyPlans?: {
    id: string;
    dayNumber: number;
    label: string | null;
    items: {
      id: string;
      exerciseId: string;
      sets: number;
      durationSeconds: number;
      sortOrder: number;
      notes: string | null;
      exercise?: { name: string };
    }[];
  }[];
}

/* ─────────────────────────── API Helpers ───────────────────── */

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return null;
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json && typeof json === "object" && "data" in json
      ? (json.data as T)
      : (json as T);
  } catch {
    return null;
  }
}

/* ─────────────────────────── Helpers ───────────────────────── */

function parseTreatmentPlan(raw: unknown): TreatmentPlanItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as TreatmentPlanItem[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as TreatmentPlanItem[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/* ─────────────────────────── Component ─────────────────────── */

export default function ConsultationsPage() {
  /* ── Consultation state ── */
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
  const [investigation, setInvestigation] = useState("");
  const [impressions, setImpressions] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [pshx, setPshx] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  /* ── Treatment plan items state (for add/edit modal) ── */
  const [treatmentPlanItems, setTreatmentPlanItems] = useState<TreatmentPlanItem[]>([]);

  /* ── View modal state ── */
  const [viewConsultation, setViewConsultation] = useState<Consultation | null>(null);

  /* ── Exercise planner state ── */
  const [showPlanner, setShowPlanner] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisePlans, setExercisePlans] = useState<ExercisePlanSummary[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);

  // Step tracking
  const [plannerStep, setPlannerStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [planPatientId, setPlanPatientId] = useState("");
  const [planConsultationId, setPlanConsultationId] = useState("");

  // Step 2
  const [planTitle, setPlanTitle] = useState("");
  const [planDays, setPlanDays] = useState(1);

  // Step 3 - day plans
  const [dayPlans, setDayPlans] = useState<DayPlanData[]>([
    { dayNumber: 1, label: "Day 1", items: [] },
  ]);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [sameForAll, setSameForAll] = useState(false);
  const [editingDays, setEditingDays] = useState<boolean[]>([]);

  const [planSaving, setPlanSaving] = useState(false);
  const [planError, setPlanError] = useState("");
  const [planSuccess, setPlanSuccess] = useState(false);

  /* ── Edit exercise plan state ── */
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  /* ── Progress view state ── */
  const [viewPlanProgress, setViewPlanProgress] = useState<ExercisePlanSummary | null>(null);
  const [planProgress, setPlanProgress] = useState<{ exercisePlanItemId: string; dayNumber: number; completedAt: string }[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);

  /* ── Load data ── */
  const loadData = async () => {
    const [cons, pats] = await Promise.all([
      apiFetch<Consultation[]>("/api/consultations"),
      apiFetch<Patient[]>("/api/patients"),
    ]);
    if (cons) setConsultations(cons);
    if (pats) setPatients(pats);
    setLoading(false);
  };

  const loadExercisePlans = async () => {
    const plans = await apiFetch<ExercisePlanSummary[]>(
      "/api/exercise-plans"
    );
    if (plans) setExercisePlans(plans);
  };

  useEffect(() => {
    loadData();
    loadExercisePlans();
  }, []);

  /* ── Consultation filtering ── */
  const filtered = consultations.filter(
    (c) =>
      (c.patient?.user?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      c.treatment.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Treatment plan items helpers ── */
  const addTreatmentPlanItem = () => {
    setTreatmentPlanItems([
      ...treatmentPlanItems,
      { title: "", description: "", duration: "", frequency: "", days: 1 },
    ]);
  };

  const updateTreatmentPlanItem = (
    index: number,
    field: keyof TreatmentPlanItem,
    value: string | number
  ) => {
    const updated = [...treatmentPlanItems];
    updated[index] = { ...updated[index], [field]: value };
    setTreatmentPlanItems(updated);
  };

  const removeTreatmentPlanItem = (index: number) => {
    setTreatmentPlanItems(treatmentPlanItems.filter((_, i) => i !== index));
  };

  /* ── Consultation CRUD ── */
  const resetForm = () => {
    setPatientId("");
    setDate("");
    setDiagnosis("");
    setTreatment("");
    setInvestigation("");
    setImpressions("");
    setMedicalHistory("");
    setPshx("");
    setNotes("");
    setFollowUpDate("");
    setTreatmentPlanItems([]);
    setEditing(null);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (c: Consultation) => {
    setEditing(c);
    setPatientId(c.patientId);
    setDate(c.date.split("T")[0]);
    setDiagnosis(c.diagnosis);
    setTreatment(c.treatment);
    setInvestigation(c.investigation || "");
    setImpressions(c.impressions || "");
    setMedicalHistory(c.medicalHistory || "");
    setPshx(c.pshx || "");
    setNotes(c.notes || "");
    setFollowUpDate(c.followUpDate ? c.followUpDate.split("T")[0] : "");
    // Parse existing treatment plan items
    setTreatmentPlanItems(parseTreatmentPlan(c.treatmentPlan));
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    const body: Record<string, unknown> = {
      patientId,
      date: new Date(date).toISOString(),
      diagnosis,
      treatment,
      investigation,
      impressions,
      medicalHistory,
      pshx,
      notes,
    };
    if (followUpDate) body.followUpDate = new Date(followUpDate).toISOString();
    // Include treatment plan items as JSON
    if (treatmentPlanItems.length > 0) {
      body.treatmentPlan = treatmentPlanItems;
    } else {
      body.treatmentPlan = null;
    }

    if (editing) {
      const res = await apiFetch(`/api/consultations/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (!res) setError("Failed to update consultation");
    } else {
      const res = await apiFetch("/api/consultations", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res) setError("Failed to create consultation");
    }
    setFormLoading(false);
    if (!error) {
      setShowModal(false);
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this consultation?")) return;
    await apiFetch(`/api/consultations/${id}`, { method: "DELETE" });
    loadData();
  };

  /* ── View detail helpers ── */
  const getViewPatientName = (c: Consultation) => {
    return c.patient?.user?.name || getPatientName(c.patientId);
  };

  const getRelatedExercisePlan = (consultationId: string) => {
    return exercisePlans.find((ep) => ep.consultationId === consultationId) || null;
  };

  /* ── Exercise Planner helpers ── */

  const patientConsultations = consultations.filter(
    (c) => c.patientId === planPatientId
  );

  const openPlanner = () => {
    setPlannerStep(1);
    setPlanPatientId("");
    setPlanConsultationId("");
    setPlanTitle("");
    setPlanDays(1);
    setDayPlans([{ dayNumber: 1, label: "Day 1", items: [] }]);
    setActiveDayTab(0);
    setSameForAll(false);
    setEditingDays([]);
    setPlanError("");
    setPlanSuccess(false);
    setShowPlanner(true);

    // Load exercises on first open
    if (exercises.length === 0) {
      setExercisesLoading(true);
      apiFetch<Exercise[]>("/api/exercises").then((ex) => {
        if (ex) setExercises(ex);
        setExercisesLoading(false);
      });
    }
  };

  const closePlanner = () => {
    setShowPlanner(false);
    setEditingPlanId(null);
    loadExercisePlans(); // refresh plans list
  };

  const handleDaysChange = (days: number) => {
    setPlanDays(days);
    const newPlans: DayPlanData[] = [];
    for (let i = 1; i <= days; i++) {
      newPlans.push({
        dayNumber: i,
        label: `Day ${i}`,
        items:
          dayPlans[i - 1] && sameForAll ? [...dayPlans[i - 1].items.map(it => ({ ...it }))] : [],
      });
    }
    setDayPlans(newPlans);
    setActiveDayTab(0);
    setEditingDays(new Array(days).fill(false));
  };

  const toggleSameForAll = () => {
    const next = !sameForAll;
    setSameForAll(next);
    if (next && dayPlans.length > 0) {
      const source = dayPlans[activeDayTab]?.items || [];
      setDayPlans((prev) =>
        prev.map((dp) => ({
          ...dp,
          items: [...source.map((it) => ({ ...it }))],
        }))
      );
    }
  };

  const addExerciseToDay = (dayIndex: number) => {
    setDayPlans((prev) => {
      const updated = [...prev];
      const newItems = [
        ...updated[dayIndex].items,
        {
          exerciseId: "",
          sets: 3,
          durationSeconds: 30,
          sortOrder: updated[dayIndex].items.length,
          notes: "",
        },
      ];
      updated[dayIndex] = { ...updated[dayIndex], items: newItems };

      // If same-for-all, propagate to all days
      if (sameForAll) {
        return updated.map((dp) => ({
          ...dp,
          items: [...newItems.map((it) => ({ ...it }))],
        }));
      }
      return updated;
    });
  };

  const updateExerciseItem = (
    dayIndex: number,
    itemIndex: number,
    field: string,
    value: string | number
  ) => {
    setDayPlans((prev) => {
      const updated = [...prev];
      const dayCopy = { ...updated[dayIndex] };
      const itemsCopy = [...dayCopy.items];
      itemsCopy[itemIndex] = { ...itemsCopy[itemIndex], [field]: value };
      dayCopy.items = itemsCopy;
      updated[dayIndex] = dayCopy;

      // If same-for-all, propagate same exercise/set/duration to all days
      if (sameForAll) {
        return updated.map((dp, di) => {
          if (di === dayIndex) return dp;
          const dpItems = [...dp.items];
          if (dpItems[itemIndex]) {
            dpItems[itemIndex] = {
              ...dpItems[itemIndex],
              [field]: value,
              // Keep sortOrder synced
              sortOrder: itemsCopy[itemIndex].sortOrder,
            };
          }
          return { ...dp, items: dpItems };
        });
      }
      return updated;
    });
  };

  const removeExerciseFromDay = (dayIndex: number, itemIndex: number) => {
    setDayPlans((prev) => {
      const updated = [...prev];
      const dayCopy = { ...updated[dayIndex] };
      dayCopy.items = dayCopy.items
        .filter((_, i) => i !== itemIndex)
        .map((it, i) => ({ ...it, sortOrder: i }));
      updated[dayIndex] = dayCopy;

      if (sameForAll) {
        return updated.map((dp, di) => {
          if (di === dayIndex) return dp;
          const dpItems = dp.items
            .filter((_, i) => i !== itemIndex)
            .map((it, i) => ({ ...it, sortOrder: i }));
          return { ...dp, items: dpItems };
        });
      }
      return updated;
    });
  };

  const copyDayToAll = (sourceIndex: number) => {
    const source = dayPlans[sourceIndex];
    setDayPlans((prev) =>
      prev.map((dp) => ({
        ...dp,
        items: source.items.map((it) => ({ ...it })),
      }))
    );
    setSameForAll(true);
  };

  const saveExercisePlan = async () => {
    setPlanSaving(true);
    setPlanError("");

    // Validate
    if (!planPatientId) {
      setPlanError("Please select a patient");
      setPlanSaving(false);
      return;
    }
    for (const dp of dayPlans) {
      for (const item of dp.items) {
        if (!item.exerciseId) {
          setPlanError(
            `Day ${dp.dayNumber} has an exercise without a selection`
          );
          setPlanSaving(false);
          return;
        }
      }
    }

    const body = {
      patientId: planPatientId,
      consultationId: planConsultationId || undefined,
      totalDays: planDays,
      title: planTitle || undefined,
      dailyPlans: dayPlans.map((dp) => ({
        dayNumber: dp.dayNumber,
        label: dp.label,
        items: dp.items.map((it) => ({
          exerciseId: it.exerciseId,
          sets: it.sets,
          durationSeconds: it.durationSeconds,
          sortOrder: it.sortOrder,
          notes: it.notes || undefined,
        })),
      })),
    };

    const isEditing = editingPlanId !== null;
    const url = isEditing ? `/api/exercise-plans/${editingPlanId}` : "/api/exercise-plans";
    const method = isEditing ? "PUT" : "POST";

    const res = await apiFetch(url, {
      method,
      body: JSON.stringify(body),
    });

    if (!res) {
      setPlanError("Failed to save exercise plan");
    } else {
      setPlanSuccess(true);
      setTimeout(() => {
        closePlanner();
      }, 1500);
    }
    setPlanSaving(false);
  };

  const deleteExercisePlan = async (id: string) => {
    if (!confirm("Delete this exercise plan?")) return;
    await apiFetch(`/api/exercise-plans?id=${id}`, { method: "DELETE" });
    loadExercisePlans();
  };

  /* ── Open plan editor pre-populated with existing data ── */
  const openEditPlan = (plan: ExercisePlanSummary) => {
    setEditingPlanId(plan.id);
    setPlanPatientId(plan.patientId);
    setPlanConsultationId(plan.consultationId || "");
    setPlanTitle(plan.title || "");
    setPlanDays(plan.totalDays);

    const dps: DayPlanData[] = (plan.dailyPlans || []).map((dp) => ({
      dayNumber: dp.dayNumber,
      label: dp.label || `Day ${dp.dayNumber}`,
      items: dp.items.map((it) => ({
        exerciseId: it.exerciseId,
        sets: it.sets,
        durationSeconds: it.durationSeconds,
        sortOrder: it.sortOrder,
        notes: it.notes || "",
      })),
    }));
    setDayPlans(dps.length > 0 ? dps : [{ dayNumber: 1, label: "Day 1", items: [] }]);
    setActiveDayTab(0);
    setSameForAll(false);
    setEditingDays([]);
    setPlanError("");
    setPlanSuccess(false);
    setPlannerStep(3); // Jump to step 3 (day exercises)
    setShowPlanner(true);

    if (exercises.length === 0) {
      setExercisesLoading(true);
      apiFetch<Exercise[]>("/api/exercises").then((ex) => {
        if (ex) setExercises(ex);
        setExercisesLoading(false);
      });
    }
  };

  /* ── View patient's exercise progress ── */
  const openViewProgress = async (plan: ExercisePlanSummary) => {
    setViewPlanProgress(plan);
    setProgressLoading(true);
    setPlanProgress([]);

    const progress = await apiFetch<{ exercisePlanItemId: string; dayNumber: number; completedAt: string }[]>(
      `/api/exercise-progress?patientId=${plan.patientId}&planId=${plan.id}`
    );

    if (progress) {
      setPlanProgress(Array.isArray(progress) ? progress : []);
    }
    setProgressLoading(false);
  };

  /* ── Derived helpers ── */
  const getPatientName = (patientId: string) => {
    const p = patients.find((p) => p.id === patientId);
    return p?.user?.name || "Unknown";
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const currentDayItems =
    dayPlans[activeDayTab]?.items || [];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            Consultations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {consultations.length} total consultations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openPlanner}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <Dumbbell className="w-4 h-4" /> Create Exercise Plan
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" /> New Consultation
          </button>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search consultations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      {/* ─── Consultations Table ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Patient
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Diagnosis
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Investigation
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Plan
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Follow-up
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No consultations found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {c.patient?.user?.name || "Unknown"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {formatDate(c.date)}
                      </td>
                      <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">
                        {c.diagnosis}
                      </td>
                      <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">
                        {c.investigation || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">
                        {c.treatment}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {c.followUpDate ? formatDate(c.followUpDate) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewConsultation(c)}
                            className="p-3 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="p-3 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-3 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ─── Exercise Plans Table ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2
            className="text-lg font-bold text-slate-900 flex items-center gap-2"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            <Dumbbell className="w-5 h-5 text-blue-500" />
            Exercise Plans
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {exercisePlans.length} total exercise plans
          </p>
        </div>
        {exercisePlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Calendar className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">No exercise plans yet</p>
            <p className="text-xs mt-1">
              Click &quot;Create Exercise Plan&quot; above to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Patient
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Days
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Exercises
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Created
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exercisePlans.map((plan) => {
                  const totalExercises =
                    plan.dailyPlans?.reduce(
                      (acc, dp) => acc + dp.items.length,
                      0
                    ) || 0;
                  return (
                    <tr key={plan.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {getPatientName(plan.patientId)}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {plan.title || (
                          <span className="text-slate-400 italic">Untitled</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {plan.totalDays}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {totalExercises} exercises
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {formatDate(plan.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openViewProgress(plan)}
                            className="p-3 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="View Progress"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditPlan(plan)}
                            className="p-3 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Plan"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteExercisePlan(plan.id)}
                            className="p-3 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
           Consultation Detail Modal (View)
           ═══════════════════════════════════════════════════════════ */}
      {viewConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setViewConsultation(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-slate-900"
                    style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
                  >
                    Consultation Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    {getViewPatientName(viewConsultation)} — {formatDate(viewConsultation.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewConsultation(null)}
                className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Date bar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold">
                  <Heart className="w-3.5 h-3.5" />
                  {getViewPatientName(viewConsultation)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(viewConsultation.date)}
                </span>
                {viewConsultation.followUpDate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    Follow-up: {formatDate(viewConsultation.followUpDate)}
                  </span>
                )}
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Diagnosis
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {viewConsultation.diagnosis}
                  </p>
                </div>
              </div>

              {/* Treatment */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  Treatment
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {viewConsultation.treatment}
                  </p>
                </div>
              </div>

              {/* Investigation */}
              {viewConsultation.investigation && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Investigation
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {viewConsultation.investigation}
                    </p>
                  </div>
                </div>
              )}

              {/* Impressions */}
              {viewConsultation.impressions && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Impressions
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {viewConsultation.impressions}
                    </p>
                  </div>
                </div>
              )}

              {/* Medical History */}
              {viewConsultation.medicalHistory && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Medical History
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {viewConsultation.medicalHistory}
                    </p>
                  </div>
                </div>
              )}

              {/* PSHx */}
              {viewConsultation.pshx && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    PSHx (Past Surgical History)
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {viewConsultation.pshx}
                    </p>
                  </div>
                </div>
              )}

              {/* Treatment Plan Items */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Management Plan
                </h3>
                {(() => {
                  const items = parseTreatmentPlan(viewConsultation.treatmentPlan);
                  if (items.length === 0) {
                    return (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <p className="text-sm text-slate-400 italic">
                          No treatment plan items added
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                        >
                          <p className="text-sm font-bold text-slate-800 mb-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-slate-600 mb-2 whitespace-pre-wrap">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            {item.duration && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                                ⏱ {item.duration}
                              </span>
                            )}
                            {item.frequency && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                                🔄 {item.frequency}
                              </span>
                            )}
                            {item.days > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                                📅 {item.days} {item.days === 1 ? "day" : "days"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-center text-xs text-slate-400 py-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100">
                          {items.length} plan item{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Notes */}
              {viewConsultation.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Notes
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {viewConsultation.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Associated Exercise Plan */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Associated Exercise Plan
                </h3>
                {(() => {
                  const ep = getRelatedExercisePlan(viewConsultation.id);
                  if (!ep) {
                    return (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <p className="text-sm text-slate-400 italic">
                          No exercise plan associated
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-slate-800">
                          {ep.title || "Untitled Plan"}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {ep.totalDays} {ep.totalDays === 1 ? "day" : "days"}
                        </span>
                      </div>
                      {ep.dailyPlans && ep.dailyPlans.length > 0 && (
                        <div className="space-y-2">
                          {ep.dailyPlans.map((dp) => (
                            <div
                              key={dp.id}
                              className="bg-white rounded-lg p-2.5 border border-slate-100"
                            >
                              <p className="text-xs font-semibold text-slate-600 mb-1">
                                {dp.label || `Day ${dp.dayNumber}`}
                              </p>
                              {dp.items.length > 0 ? (
                                <ul className="space-y-0.5">
                                  {dp.items.map((item) => (
                                    <li
                                      key={item.id}
                                      className="text-xs text-slate-500 flex items-center gap-1.5"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                                      {item.exercise?.name || "Exercise"} — {item.sets} sets
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-400 italic">
                                  No exercises assigned
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Close button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setViewConsultation(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           Consultation Modal (Add / Edit)
           ═══════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2
                className="text-lg font-semibold text-slate-900"
                style={{
                  fontFamily: "var(--font-plus-jakarta), sans-serif",
                }}
              >
                {editing ? "Edit Consultation" : "New Consultation"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-3 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Patient *
                </label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Diagnosis *
                </label>
                <textarea
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Treatment *
                </label>
                <textarea
                  required
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Investigation
                </label>
                <textarea
                  value={investigation}
                  onChange={(e) => setInvestigation(e.target.value)}
                  rows={2}
                  placeholder="Tests, scans, X-rays ordered..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Impressions
                </label>
                <textarea
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  rows={2}
                  placeholder="Clinical impression / assessment..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Medical History
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  rows={2}
                  placeholder="Patient's past medical history..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  PSHx (Past Surgical History)
                </label>
                <textarea
                  value={pshx}
                  onChange={(e) => setPshx(e.target.value)}
                  rows={2}
                  placeholder="Past surgical history..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>

              {/* ─── Management Plan ─── */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Management Plan
                </label>
                {treatmentPlanItems.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <p className="text-xs text-slate-400 italic mb-3">
                      No plan items yet
                    </p>
                    <button
                      type="button"
                      onClick={addTreatmentPlanItem}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {treatmentPlanItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Item {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTreatmentPlanItem(idx)}
                            className="p-3 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Title (e.g., Apply icepack)"
                          value={item.title}
                          onChange={(e) =>
                            updateTreatmentPlanItem(idx, "title", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                        />
                        <textarea
                          placeholder="Description (optional)"
                          value={item.description}
                          onChange={(e) =>
                            updateTreatmentPlanItem(idx, "description", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5 block">
                              Duration
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 10 min"
                              value={item.duration}
                              onChange={(e) =>
                                updateTreatmentPlanItem(idx, "duration", e.target.value)
                              }
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5 block">
                              Frequency
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 2x daily"
                              value={item.frequency}
                              onChange={(e) =>
                                updateTreatmentPlanItem(idx, "frequency", e.target.value)
                              }
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5 block">
                              Days
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={item.days}
                              onChange={(e) =>
                                updateTreatmentPlanItem(
                                  idx,
                                  "days",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTreatmentPlanItem}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 text-xs font-semibold hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : editing ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           Exercise Planner Modal (Full-Width)
           ═══════════════════════════════════════════════════════════ */}
      {showPlanner && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closePlanner}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl min-h-[600px] max-h-[90vh] overflow-y-auto mb-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-slate-900"
                    style={{
                      fontFamily: "var(--font-plus-jakarta), sans-serif",
                    }}
                  >
                    Exercise Planner
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingPlanId ? "Edit the exercise plan for your patient" : "Create a multi-day exercise plan for your patient"}
                  </p>
                </div>
              </div>
              <button
                onClick={closePlanner}
                className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3 max-w-md mx-auto">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        plannerStep >= step
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200/50"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {plannerStep > step ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        plannerStep >= step ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {step === 1
                        ? "Select Patient"
                        : step === 2
                        ? "Plan Details"
                        : "Assign Exercises"}
                    </span>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-0.5 rounded ${
                          plannerStep > step ? "bg-blue-400" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Errors / Success */}
            <div className="px-6 pt-4">
              {planError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {planError}
                </div>
              )}
              {planSuccess && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm mb-4">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  Exercise plan saved successfully!
                </div>
              )}
            </div>

            {/* Step 1: Select Patient & Consultation */}
            {plannerStep === 1 && (
              <div className="p-6 space-y-5">
                <h3
                  className="text-base font-bold text-slate-800"
                  style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                  }}
                >
                  Select Patient & Consultation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Patient *
                    </label>
                    <select
                      value={planPatientId}
                      onChange={(e) => {
                        setPlanPatientId(e.target.value);
                        setPlanConsultationId("");
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                    >
                      <option value="">Select a patient</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Consultation{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <select
                      value={planConsultationId}
                      onChange={(e) => setPlanConsultationId(e.target.value)}
                      disabled={!planPatientId}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">No consultation linked</option>
                      {patientConsultations.map((c) => (
                        <option key={c.id} value={c.id}>
                          {formatDate(c.date)} — {c.diagnosis}
                        </option>
                      ))}
                    </select>
                    {!planPatientId && (
                      <p className="text-xs text-slate-400 mt-1">
                        Select a patient first to see their consultations
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => {
                      if (!planPatientId) {
                        setPlanError("Please select a patient");
                        return;
                      }
                      setPlanError("");
                      setPlannerStep(2);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Plan Details */}
            {plannerStep === 2 && (
              <div className="p-6 space-y-5">
                <h3
                  className="text-base font-bold text-slate-800"
                  style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                  }}
                >
                  Plan Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Plan Title{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Post-Surgery Rehab Week 1"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Total Days *
                    </label>
                    <select
                      value={planDays}
                      onChange={(e) =>
                        handleDaysChange(parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d} {d === 1 ? "day" : "days"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setPlannerStep(1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPlannerStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Assign Exercises */}
            {plannerStep === 3 && (
              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3
                    className="text-base font-bold text-slate-800"
                    style={{
                      fontFamily: "var(--font-plus-jakarta), sans-serif",
                    }}
                  >
                    Assign Exercises to Days
                  </h3>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameForAll}
                      onChange={toggleSameForAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Copy className="w-3.5 h-3.5 text-blue-500" />
                    Same exercises for all days
                  </label>
                </div>

                {exercisesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="ml-2 text-sm text-slate-500">
                      Loading exercises...
                    </span>
                  </div>
                ) : exercises.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-slate-400">
                    <Dumbbell className="w-10 h-10 mb-2 opacity-40" />
                    <p className="text-sm font-medium">
                      No exercises in the database
                    </p>
                    <p className="text-xs mt-1">
                      Add exercises first via the admin exercise manager
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Day tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-100">
                      {dayPlans.map((dp, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveDayTab(idx)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            activeDayTab === idx
                              ? "bg-blue-50 text-blue-600 border border-b-0 border-blue-200"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Day {dp.dayNumber}
                          {dp.items.length > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                activeDayTab === idx
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {dp.items.length}
                            </span>
                          )}
                          {sameForAll && idx > 0 && !editingDays[idx] && (
                            <span className="text-[10px] text-slate-400">
                              (copied)
                            </span>
                          )}
                          {sameForAll && idx > 0 && editingDays[idx] && (
                            <span className="text-[10px] text-amber-500">
                              (custom)
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Day content */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-700">
                            Day {activeDayTab + 1}
                          </span>
                          {sameForAll && activeDayTab > 0 && (
                            <span className="text-xs text-slate-400">
                              — copied from Day 1
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {sameForAll && activeDayTab > 0 && (
                            <button
                              onClick={() => {
                                const updated = [...editingDays];
                                updated[activeDayTab] = !updated[activeDayTab];
                                setEditingDays(updated);
                              }}
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                                editingDays[activeDayTab]
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                              title="Edit this day individually"
                            >
                              <Pencil className="w-3 h-3 inline mr-1" />
                              {editingDays[activeDayTab]
                                ? "Customized"
                                : "Edit Day"}
                            </button>
                          )}
                          {!sameForAll && (
                            <button
                              onClick={() => copyDayToAll(activeDayTab)}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Copy this day to all other days"
                            >
                              <Copy className="w-3 h-3 inline mr-1" />
                              Copy to All
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Exercise items */}
                      {currentDayItems.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">
                            No exercises added yet. Click &quot;+ Add
                            Exercise&quot; below.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentDayItems.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <select
                                  value={item.exerciseId}
                                  onChange={(e) =>
                                    updateExerciseItem(
                                      activeDayTab,
                                      itemIdx,
                                      "exerciseId",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                                >
                                  <option value="">Select exercise</option>
                                  {exercises.map((ex) => (
                                    <option key={ex.id} value={ex.id}>
                                      {ex.name}
                                      {ex.category
                                        ? ` (${ex.category})`
                                        : ""}
                                      {ex.difficulty
                                        ? ` — ${ex.difficulty}`
                                        : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">
                                    Sets
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={item.sets}
                                    onChange={(e) =>
                                      updateExerciseItem(
                                        activeDayTab,
                                        itemIdx,
                                        "sets",
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-center focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">
                                    Secs
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={600}
                                    value={item.durationSeconds}
                                    onChange={(e) =>
                                      updateExerciseItem(
                                        activeDayTab,
                                        itemIdx,
                                        "durationSeconds",
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-center focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    removeExerciseFromDay(
                                      activeDayTab,
                                      itemIdx
                                    )
                                  }
                                  className="p-3 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors mt-4"
                                  title="Remove exercise"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add exercise button */}
                      <button
                        onClick={() => addExerciseToDay(activeDayTab)}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 text-sm font-semibold hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Exercise
                      </button>
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setPlannerStep(2)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={saveExercisePlan}
                    disabled={planSaving || planSuccess}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {planSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {editingPlanId ? "Update Exercise Plan" : "Save Exercise Plan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ═══════════════════════════════════════════════════════════
           Exercise Progress View Modal
           ═══════════════════════════════════════════════════════════ */}
      {viewPlanProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setViewPlanProgress(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                    Exercise Progress
                  </h2>
                  <p className="text-xs text-slate-500">
                    {getPatientName(viewPlanProgress.patientId)} — {viewPlanProgress.title || "Untitled Plan"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewPlanProgress(null)}
                className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {progressLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  <span className="ml-2 text-sm text-slate-500">Loading progress...</span>
                </div>
              ) : (
                <>
                  {/* Summary bar */}
                  {(() => {
                    const totalItems = viewPlanProgress.dailyPlans?.reduce((acc, dp) => acc + dp.items.length, 0) || 0;
                    const completedItems = planProgress.length;
                    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                    return (
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-emerald-800">Overall Completion</span>
                          <span className="text-2xl font-bold text-emerald-600">{pct}%</span>
                        </div>
                        <div className="w-full bg-emerald-200/50 rounded-full h-2.5">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-emerald-600 mt-2">
                          {completedItems} of {totalItems} exercises completed
                        </p>
                      </div>
                    );
                  })()}

                  {/* Day-by-day breakdown */}
                  {viewPlanProgress.dailyPlans?.map((dp) => {
                    const dayCompleted = dp.items.filter((it) =>
                      planProgress.some((p) => p.exercisePlanItemId === it.id)
                    ).length;
                    const dayTotal = dp.items.length;
                    const dayPct = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;
                    return (
                      <div key={dp.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <span className="text-sm font-semibold text-slate-700">
                            {dp.label || `Day ${dp.dayNumber}`}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            dayPct === 100
                              ? "bg-emerald-100 text-emerald-700"
                              : dayPct > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {dayCompleted}/{dayTotal}
                          </span>
                        </div>
                        <div className="px-4 py-3">
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                dayPct === 100 ? "bg-emerald-500" : dayPct > 0 ? "bg-amber-500" : "bg-slate-200"
                              }`}
                              style={{ width: `${dayPct}%` }}
                            />
                          </div>
                          {dp.items.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No exercises in this day</p>
                          ) : (
                            <ul className="space-y-1">
                              {dp.items.map((it) => {
                                const done = planProgress.some((p) => p.exercisePlanItemId === it.id);
                                return (
                                  <li key={it.id} className="flex items-center gap-2 text-xs">
                                    {done ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                                    )}
                                    <span className={done ? "text-slate-600" : "text-slate-400"}>
                                      {it.exercise?.name || "Unknown exercise"}
                                    </span>
                                    <span className="text-slate-400 ml-auto">
                                      {it.sets} × {it.durationSeconds}s
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {(!viewPlanProgress.dailyPlans || viewPlanProgress.dailyPlans.length === 0) && (
                    <div className="text-center py-12 text-slate-400">
                      <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No daily plans in this exercise plan</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
