'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Dumbbell,
  Clock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  User,
  Mail,
  Phone,
  Repeat,
  Target,
  Info,
  Sparkles,
  Heart,
  CalendarCheck,
  FileText,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface PatientData {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

interface AssignedExercise {
  id: string;
  sets: number;
  reps: number;
  frequency: string;
  notes?: string;
  assignedDate: string;
  exercise: {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
  };
}

interface Consultation {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpDate?: string;
}

/* ---------- helpers ---------- */

function getGreeting(): { greeting: string; icon: typeof Sun } {
  const h = new Date().getHours();
  if (h < 12) return { greeting: 'Good morning', icon: Sun };
  if (h < 17) return { greeting: 'Good afternoon', icon: CloudSun };
  return { greeting: 'Good evening', icon: Moon };
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/* ---------- animation variants ---------- */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ---------- page ---------- */

export default function PatientDashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exercises, setExercises] = useState<AssignedExercise[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const authFetch = (url: string) =>
      fetch(url, { headers }).then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return r.json();
      });

    Promise.all([
      authFetch('/api/auth/me'),
      authFetch('/api/patients'),
      authFetch('/api/appointments'),
      authFetch('/api/consultations'),
      authFetch('/api/exercise-plans'),
    ])
      .then(([userData, patientData, appointmentsData, consultationsData, plansData]) => {
        setUser(userData?.user || userData);
        const patientRecord = Array.isArray(patientData?.data) ? patientData.data[0] : patientData;
        setPatient(patientRecord);
        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : appointmentsData.data || appointmentsData.appointments || [],
        );
        setExercises(patientRecord?.assignedExercises || []);
        // Also extract exercises from exercise plans
        const planExercises = (plansData?.data || []).flatMap((plan: any) =>
          (plan.dailyPlans || []).flatMap((dp: any) =>
            (dp.items || []).map((item: any) => ({
              id: item.id || `${plan.id}-${dp.dayNumber}-${item.exerciseId}`,
              sets: item.sets,
              reps: item.durationSeconds || 10,
              frequency: `Day ${dp.dayNumber}`,
              notes: item.notes || null,
              assignedDate: plan.createdAt,
              exercise: item.exercise || { id: item.exerciseId, name: 'Exercise', description: '', category: '', difficulty: '', duration: '' },
            }))
          )
        );
        setExercises((prev) => {
          const combined = [...prev, ...planExercises];
          // Deduplicate by exercise name
          const seen = new Set<string>();
          return combined.filter((ae) => {
            const key = ae.exercise.name;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });
        setConsultations(
          Array.isArray(consultationsData)
            ? consultationsData
            : consultationsData.data || consultationsData.consultations || [],
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* derived data */
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed',
  );
  const nextAppointment = upcomingAppointments
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find((a) => new Date(a.date) >= new Date());
  const recentConsultation = consultations.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const difficultyBadge = (d: string) => {
    switch (d?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'hard':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Patient';
  const { greeting, icon: GreetingIcon } = getGreeting();

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-sky-50 via-white to-indigo-50/30">
        <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded-2xl w-72" />
            <div className="h-5 bg-gray-200 rounded-lg w-56" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-36 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <div className="min-h-full bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/30">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8"
      >
        {/* ─── Hero Welcome ─── */}
        <motion.section variants={item} className="relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GreetingIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display tracking-tight">
                  {greeting}, {firstName}
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-base sm:text-lg ml-[52px] mt-1">
              Here&apos;s your recovery journey at a glance
            </p>
          </div>
          {/* decorative gradient blob */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.07] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            }}
          />
        </motion.section>

        {/* ─── Quick Actions ─── */}
        <motion.section variants={item} className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {[
            {
              label: 'View Exercises',
              href: '/patient/exercises',
              icon: Dumbbell,
              gradient: 'from-emerald-400 to-teal-500',
              shadow: 'shadow-emerald-500/20',
            },
            {
              label: 'Book Consultation',
              href: '/patient/consultations',
              icon: Stethoscope,
              gradient: 'from-sky-400 to-blue-500',
              shadow: 'shadow-blue-500/20',
            },
            {
              label: 'My Appointments',
              href: '/patient/appointments',
              icon: CalendarCheck,
              gradient: 'from-violet-400 to-purple-500',
              shadow: 'shadow-purple-500/20',
            },
            {
              label: 'My Profile',
              href: '/patient/profile',
              icon: User,
              gradient: 'from-amber-400 to-orange-500',
              shadow: 'shadow-orange-500/20',
            },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`
                flex items-center gap-2.5 px-5 py-2.5 rounded-full whitespace-nowrap
                text-sm font-semibold text-white
                bg-gradient-to-r ${a.gradient}
                shadow-lg ${a.shadow}
                hover:scale-105 hover:shadow-xl
                active:scale-[0.98]
                transition-all duration-300
                flex-shrink-0
              `}
            >
              <a.icon className="w-4 h-4" />
              {a.label}
            </Link>
          ))}
        </motion.section>

        {/* ─── Your Recovery Journey (Exercises) ─── */}
        <motion.section variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Your Recovery Journey
            </h2>
          </div>

          {exercises.length > 0 ? (
            <div className="space-y-3">
              {exercises.slice(0, 4).map((ae, idx) => (
                <Link key={ae.id} href="/patient/exercises">
                <motion.div
                  variants={item}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="
                    group bg-white/80 backdrop-blur-sm
                    rounded-2xl p-5
                    border border-white/60 shadow-md shadow-gray-200/40
                    hover:shadow-xl hover:shadow-blue-100/40
                    transition-all duration-300
                    cursor-pointer
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {ae.exercise.name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyBadge(ae.exercise.difficulty)}`}
                        >
                          {ae.exercise.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                        {ae.exercise.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          {
                            icon: Target,
                            label: `${ae.sets} sets × ${ae.reps} reps`,
                            color: 'text-blue-500 bg-blue-50',
                          },
                          {
                            icon: Repeat,
                            label: ae.frequency,
                            color: 'text-purple-500 bg-purple-50',
                          },
                          {
                            icon: Clock,
                            label: ae.exercise.duration,
                            color: 'text-amber-500 bg-amber-50',
                          },
                        ].map((chip, ci) => (
                          <span
                            key={ci}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${chip.color}`}
                          >
                            <chip.icon className="w-3.5 h-3.5" />
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {ae.notes && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-sky-50/60 rounded-xl px-3 py-2.5">
                      <Info className="w-4 h-4 mt-0.5 text-sky-400 flex-shrink-0" />
                      <span className="line-clamp-2">{ae.notes}</span>
                    </div>
                  )}
                </motion.div>
                </Link>
              ))}

              {exercises.length > 4 && (
                <Link
                  href="/patient/exercises"
                  className="
                    flex items-center justify-center gap-2 py-3
                    text-sm font-semibold text-primary-600
                    hover:text-primary-700
                    transition-colors duration-200
                  "
                >
                  View all {exercises.length} exercises
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="
              bg-white/70 backdrop-blur-sm rounded-3xl p-8
              border border-white/60 shadow-md
              text-center
            ">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">No exercises assigned yet</p>
              <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                Once your therapist assigns exercises, they&apos;ll appear here to guide your recovery.
              </p>
              <Sparkles className="w-5 h-5 text-emerald-300 mx-auto animate-pulse" />
            </div>
          )}
        </motion.section>

        {/* ─── Upcoming Appointment ─── */}
        <motion.section variants={item}>
          {nextAppointment ? (
            <div className="
              relative overflow-hidden
              bg-white/80 backdrop-blur-sm
              rounded-3xl p-6
              border border-white/60 shadow-lg shadow-blue-100/30
            ">
              {/* accent gradient stripe */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400 rounded-full" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Upcoming Appointment
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 font-display">
                    {formatDate(nextAppointment.date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {nextAppointment.time} &middot; {nextAppointment.type}
                  </p>
                  {nextAppointment.notes && (
                    <p className="text-sm text-gray-400 max-w-md line-clamp-2 mt-1">
                      {nextAppointment.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(nextAppointment.status)}`}>
                    {nextAppointment.status.charAt(0).toUpperCase() + nextAppointment.status.slice(1)}
                  </span>
                  {(() => {
                    const days = daysUntil(nextAppointment.date);
                    if (days === 0) return <span className="text-sm font-semibold text-blue-600">Today</span>;
                    if (days === 1) return <span className="text-sm font-semibold text-blue-600">Tomorrow</span>;
                    return <span className="text-sm text-gray-500">in {days} days</span>;
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="
              bg-white/60 backdrop-blur-sm
              rounded-3xl p-6
              border border-dashed border-gray-200
              flex items-center gap-4
            ">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">No upcoming appointments</p>
                <p className="text-sm text-gray-400">
                  Book your next session to stay on track with your recovery.
                </p>
              </div>
              <Link
                href="/patient/appointments"
                className="
                  flex items-center gap-1.5 px-4 py-2 rounded-full
                  text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-600 hover:to-blue-700
                  shadow-md shadow-blue-500/20
                  transition-all duration-300
                  flex-shrink-0
                "
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ─── Recent Consultation ─── */}
        <motion.section variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Recent Consultation
              </h2>
            </div>
            {consultations.length > 1 && (
              <Link
                href="/patient/consultations"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentConsultation ? (
            <Link href="/patient/consultations">
            <motion.div
              variants={item}
              className="
                bg-white/80 backdrop-blur-sm
                rounded-3xl p-6
                border border-white/60 shadow-md shadow-gray-200/40
                hover:shadow-lg hover:shadow-indigo-100/40
                cursor-pointer transition-all duration-300
              "
            >
              {/* timeline dot */}
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-px h-full bg-gradient-to-b from-indigo-200 to-transparent mt-2 hidden sm:block" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      {formatDate(recentConsultation.date)}
                    </p>
                    <p className="font-semibold text-gray-900 text-base">
                      {recentConsultation.diagnosis}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-sky-50/80 to-blue-50/50 rounded-2xl px-4 py-3">
                    <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-1">
                      Treatment Plan
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {recentConsultation.treatment}
                    </p>
                  </div>

                  {recentConsultation.notes && (
                    <div className="bg-gray-50/80 rounded-2xl px-4 py-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Doctor&apos;s Notes
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {recentConsultation.notes}
                      </p>
                    </div>
                  )}

                  {recentConsultation.followUpDate && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50/80 rounded-xl px-3 py-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Follow-up on {formatDate(recentConsultation.followUpDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            </Link>
          ) : (
            <div className="
              bg-white/60 backdrop-blur-sm
              rounded-3xl p-8
              border border-dashed border-gray-200
              text-center
            ">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-indigo-300" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">No consultations yet</p>
              <p className="text-sm text-gray-400 mb-4 max-w-xs mx-auto">
                Your consultation history will appear here after your first visit.
              </p>
              <Link
                href="/patient/consultations"
                className="
                  inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full
                  text-sm font-semibold text-white
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:from-indigo-600 hover:to-purple-600
                  shadow-md shadow-indigo-500/20
                  transition-all duration-300
                "
              >
                Book Your First Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ─── Patient Info (compact, bottom) ─── */}
        {user && (
          <motion.section variants={item}>
            <div className="
              bg-white/50 backdrop-blur-sm
              rounded-3xl p-5
              border border-white/50 shadow-sm
            ">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Your Details
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { icon: User, label: user.name, color: 'text-blue-500' },
                  { icon: Mail, label: user.email, color: 'text-purple-500' },
                  ...(user.phone
                    ? [{ icon: Phone, label: user.phone, color: 'text-emerald-500' }]
                    : []),
                ].map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <detail.icon className={`w-4 h-4 ${detail.color}`} />
                    <span>{detail.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ─── Profile completion nudge ─── */}
        {patient && !patient.medicalHistory && !patient.allergies && (
          <motion.section variants={item}>
            <div className="
              bg-gradient-to-r from-amber-50/80 to-orange-50/60
              backdrop-blur-sm
              rounded-3xl p-5
              border border-amber-100
              flex items-start gap-3
            ">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Complete your profile</p>
                <p className="text-sm text-amber-600/80 mt-0.5">
                  Adding your medical history helps us provide better, personalised care.
                </p>
                <Link
                  href="/patient/profile"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800 mt-2 transition-colors"
                >
                  Update Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
