'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Heart,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TreatmentPlanItem {
  title: string;
  description: string;
  duration: string;
  frequency: string;
  days: number;
}

interface Consultation {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpDate?: string;
  treatmentPlan?: TreatmentPlanItem[] | string | null;
}

interface Exercise {
  name: string;
  gifUrl?: string;
  videoUrl?: string;
}

interface ExerciseItem {
  sets: number;
  durationSeconds: number;
  exercise: Exercise;
}

interface DailyPlan {
  dayNumber: number;
  label: string;
  items: ExerciseItem[];
}

interface ExercisePlan {
  id: string;
  title: string;
  totalDays: number;
  consultationId?: string;
  dailyPlans: DailyPlan[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseTreatmentPlan(raw: unknown): TreatmentPlanItem[] | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed as TreatmentPlanItem[];
    return null;
  } catch {
    return null;
  }
}

function uniqueExercises(plan: ExercisePlan): { name: string; sets: number; duration: number }[] {
  const seen = new Map<string, { name: string; sets: number; duration: number }>();
  for (const day of plan.dailyPlans) {
    for (const item of day.items) {
      const key = item.exercise.name;
      if (seen.has(key)) {
        const existing = seen.get(key)!;
        existing.sets += item.sets;
        existing.duration += item.durationSeconds;
      } else {
        seen.set(key, {
          name: item.exercise.name,
          sets: item.sets,
          duration: item.durationSeconds,
        });
      }
    }
  }
  return Array.from(seen.values());
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [exercisePlans, setExercisePlans] = useState<ExercisePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/consultations', { headers }).then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return null;
        }
        return r.json();
      }),
      fetch('/api/exercise-plans', { headers }).then((r) => {
        if (r.status === 401) return null;
        return r.json();
      }),
    ])
      .then(([consData, epData]) => {
        if (consData) {
          setConsultations(
            Array.isArray(consData)
              ? consData
              : consData.data || consData.consultations || []
          );
        }
        if (epData) {
          setExercisePlans(
            Array.isArray(epData)
              ? epData
              : epData.data || epData.exercisePlans || []
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ---- derived ---- */

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatDateShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date();

  const sorted = [...consultations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const plansForConsultation = (consultationId: string) =>
    exercisePlans.filter((p) => p.consultationId === consultationId);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  /* ---- loading skeleton ---- */

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ---- main render ---- */

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          My Consultations
        </h1>
        <p className="text-gray-500 mt-1">
          Your consultation history and treatment records.
        </p>
      </div>

      {/* Consultations List */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No consultations yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Your consultation records will appear here after your first visit.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />

          <div className="space-y-6">
            {sorted.map((consultation, index) => {
              const hasUpcomingFollowUp =
                consultation.followUpDate &&
                isUpcoming(consultation.followUpDate);
              const isRecent = index === 0;
              const isExpanded = expandedId === consultation.id;
              const treatmentItems = parseTreatmentPlan(consultation.treatmentPlan);
              const linkedPlans = plansForConsultation(consultation.id);

              return (
                <div key={consultation.id} className="relative sm:pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-4 top-6 w-5 h-5 rounded-full border-2 border-white shadow-sm hidden sm:flex items-center justify-center ${
                      isRecent
                        ? 'bg-primary-500'
                        : hasUpcomingFollowUp
                          ? 'bg-amber-400'
                          : 'bg-gray-300'
                    }`}
                  >
                    {isRecent && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  {/* Consultation Card */}
                  <div
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                      isRecent
                        ? 'border-primary-200 ring-1 ring-primary-100'
                        : 'border-gray-100'
                    }`}
                  >
                    {/* Card Header (always visible) */}
                    <button
                      onClick={() => toggle(consultation.id)}
                      className="w-full text-left px-5 py-4 border-b border-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-t-2xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isRecent ? 'bg-primary-50' : 'bg-gray-50'
                            }`}
                          >
                            <Stethoscope
                              className={`w-5 h-5 ${
                                isRecent ? 'text-primary-500' : 'text-gray-400'
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(consultation.date)}
                            </p>
                            <h3 className="font-semibold text-gray-900 mt-1 truncate">
                              {consultation.diagnosis}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isRecent && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200">
                              Latest
                            </span>
                          )}
                          <span className="text-gray-400 transition-transform duration-200">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Collapsed hint */}
                      {!isExpanded && (
                        <p className="text-xs text-primary-500 font-medium mt-2 ml-13">
                          View Details →
                        </p>
                      )}
                    </button>

                    {/* Expandable Body */}
                    <div
                      className="transition-all duration-300 ease-in-out overflow-hidden"
                      style={{
                        maxHeight: isExpanded ? '2000px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="p-5 space-y-5">
                        {/* ---- Diagnosis ---- */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">
                            Diagnosis
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {consultation.diagnosis}
                          </p>
                        </div>

                        {/* ---- Treatment ---- */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">
                            Treatment
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {consultation.treatment}
                          </p>
                        </div>

                        {/* ---- Treatment Plan Items ---- */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <h4 className="text-sm font-semibold text-gray-700">
                              Treatment Plan Items
                            </h4>
                          </div>

                          {treatmentItems && treatmentItems.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {treatmentItems.map((item, i) => (
                                <div
                                  key={i}
                                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                                >
                                  <p className="text-sm font-semibold text-gray-800">
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {item.duration && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        ⏱ {item.duration}
                                      </span>
                                    )}
                                    {item.frequency && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                        🔄 {item.frequency}
                                      </span>
                                    )}
                                    {item.days > 0 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        📅 {item.days} day{item.days !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              No treatment plan items
                            </p>
                          )}
                        </div>

                        {/* ---- Notes ---- */}
                        {consultation.notes && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Additional Notes
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {consultation.notes}
                            </p>
                          </div>
                        )}

                        {/* ---- Follow-up Date ---- */}
                        {consultation.followUpDate && (
                          <div
                            className={`flex items-center gap-3 rounded-xl p-3 ${
                              hasUpcomingFollowUp
                                ? 'bg-amber-50 border border-amber-200'
                                : 'bg-gray-50 border border-gray-100'
                            }`}
                          >
                            {hasUpcomingFollowUp ? (
                              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            ) : (
                              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  hasUpcomingFollowUp
                                    ? 'text-amber-800'
                                    : 'text-gray-600'
                                }`}
                              >
                                {hasUpcomingFollowUp
                                  ? 'Upcoming Follow-up'
                                  : 'Follow-up'}
                              </p>
                              <p
                                className={`text-xs ${
                                  hasUpcomingFollowUp
                                    ? 'text-amber-600'
                                    : 'text-gray-500'
                                }`}
                              >
                                {formatDateShort(consultation.followUpDate)}
                              </p>
                            </div>
                            {hasUpcomingFollowUp && (
                              <ArrowRight className="w-4 h-4 text-amber-400 ml-auto" />
                            )}
                          </div>
                        )}

                        {/* ---- Exercise Plans ---- */}
                        {linkedPlans.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Dumbbell className="w-4 h-4 text-primary-500" />
                              <h4 className="text-sm font-semibold text-gray-700">
                                Associated Exercise Plan{linkedPlans.length > 1 ? 's' : ''}
                              </h4>
                            </div>

                            {linkedPlans.map((plan) => {
                              const exercises = uniqueExercises(plan);
                              return (
                                <div
                                  key={plan.id}
                                  className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-3 last:mb-0"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-sm font-semibold text-primary-800">
                                        {plan.title}
                                      </p>
                                      <p className="text-xs text-primary-600 mt-0.5">
                                        {plan.totalDays} day plan
                                      </p>
                                    </div>
                                  </div>

                                  {exercises.length > 0 && (
                                    <div className="mt-3 space-y-1.5">
                                      <p className="text-[10px] font-medium text-primary-500 uppercase tracking-wide">
                                        Exercises included
                                      </p>
                                      {exercises.map((ex, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between text-xs"
                                        >
                                          <span className="text-gray-700">
                                            {ex.name}
                                          </span>
                                          <span className="text-gray-500">
                                            {ex.sets} sets · {Math.round(ex.duration / 60)}min
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <a
                                    href="/patient/exercises"
                                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                  >
                                    View full exercise plan
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      {sorted.length > 0 && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary-800">
              Questions about your treatment?
            </p>
            <p className="text-sm text-primary-700 mt-1">
              Contact Dr.Nishmitha.R at +91-8151912525 or visit the clinic for any
              concerns about your diagnosis or treatment plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
