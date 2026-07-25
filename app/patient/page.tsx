'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Dumbbell,
  FileText,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
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

export default function PatientDashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exercises, setExercises] = useState<AssignedExercise[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/auth/me', { headers }).then((r) => r.json()),
      fetch('/api/patients', { headers }).then((r) => r.json()),
      fetch('/api/appointments', { headers }).then((r) => r.json()),
      fetch('/api/exercises', { headers }).then((r) => r.json()),
      fetch('/api/consultations', { headers }).then((r) => r.json()),
    ])
      .then(([userData, patientData, appointmentsData, exercisesData, consultationsData]) => {
        setUser(userData);
        setPatient(Array.isArray(patientData?.data) ? patientData.data[0] : patientData);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.data || appointmentsData.appointments || []);
        setExercises(Array.isArray(exercisesData) ? exercisesData : exercisesData.data || exercisesData.exercises || []);
        setConsultations(Array.isArray(consultationsData) ? consultationsData : consultationsData.data || consultationsData.consultations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calculate stats
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  const nextAppointment = upcomingAppointments
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find((a) => new Date(a.date) >= new Date());
  const recentConsultation = consultations.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
          Welcome back, {user?.name?.split(' ')[0] || 'Patient'} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your physiotherapy journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Upcoming Appointments */}
        <Link
          href="/patient/appointments"
          className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 font-display">
                {upcomingAppointments.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {upcomingAppointments.length === 1 ? '1 appointment' : `${upcomingAppointments.length} appointments`} scheduled
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <CalendarDays className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </Link>

        {/* My Exercises */}
        <Link
          href="/patient/exercises"
          className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">My Exercises</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 font-display">
                {exercises.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {exercises.length === 1 ? '1 exercise' : `${exercises.length} exercises`} assigned
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Dumbbell className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Link>

        {/* My Consultations */}
        <Link
          href="/patient/consultations"
          className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">My Consultations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 font-display">
                {consultations.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {consultations.length === 1 ? '1 consultation' : `${consultations.length} consultations`} total
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Stethoscope className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Link>
      </div>

      {/* Next Appointment Highlight */}
      {nextAppointment ? (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 opacity-90" />
                <span className="text-sm font-medium opacity-90">Next Appointment</span>
              </div>
              <div>
                <p className="text-xl font-bold font-display">
                  {formatDate(nextAppointment.date)}
                </p>
                <p className="text-lg opacity-90 mt-1">
                  {nextAppointment.time} — {nextAppointment.type}
                </p>
              </div>
              {nextAppointment.notes && (
                <p className="text-sm opacity-75 max-w-md">
                  {nextAppointment.notes}
                </p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(nextAppointment.status)} !bg-white/20 !text-white`}>
              {nextAppointment.status.charAt(0).toUpperCase() + nextAppointment.status.slice(1)}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <CalendarDays className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">No Upcoming Appointments</p>
              <p className="text-sm text-gray-500">Book your next session with Dr. Nishmitha R.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/patient/appointments"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <CalendarDays className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Book Appointment</p>
            <p className="text-sm text-gray-500">Schedule a new session</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
        </Link>

        <Link
          href="/patient/exercises"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <Dumbbell className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">View Exercises</p>
            <p className="text-sm text-gray-500">Check your assigned exercises</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
        </Link>
      </div>

      {/* Recent Consultation Summary */}
      {recentConsultation && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-gray-900">Latest Consultation</h2>
            </div>
            <Link
              href="/patient/consultations"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  {formatDate(recentConsultation.date)}
                </p>
                <p className="font-medium text-gray-900">
                  {recentConsultation.diagnosis}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Treatment Plan
              </p>
              <p className="text-sm text-gray-700">{recentConsultation.treatment}</p>
            </div>
            {recentConsultation.followUpDate && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-gray-600">
                  Follow-up: {formatDate(recentConsultation.followUpDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medical Info Reminder */}
      {patient && !patient.medicalHistory && !patient.allergies && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Complete Your Profile</p>
            <p className="text-sm text-amber-700 mt-1">
              Add your medical history and allergies so we can provide the best care.
            </p>
            <Link
              href="/patient/profile"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 underline mt-2 hover:text-amber-900"
            >
              Update Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
