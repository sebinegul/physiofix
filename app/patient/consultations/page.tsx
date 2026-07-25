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
} from 'lucide-react';

interface Consultation {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpDate?: string;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/consultations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConsultations(
          Array.isArray(data) ? data : data.data || data.consultations || []
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      {sortedConsultations.length === 0 ? (
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
            {sortedConsultations.map((consultation, index) => {
              const hasUpcomingFollowUp =
                consultation.followUpDate && isUpcoming(consultation.followUpDate);
              const isRecent = index === 0;

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
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${
                      isRecent ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-100'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-gray-100">
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
                          <div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(consultation.date)}
                            </p>
                            <h3 className="font-semibold text-gray-900 mt-1">
                              {consultation.diagnosis}
                            </h3>
                          </div>
                        </div>
                        {isRecent && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      {/* Treatment Plan */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-rose-400" />
                          <h4 className="text-sm font-semibold text-gray-700">
                            Treatment Plan
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {consultation.treatment}
                        </p>
                      </div>

                      {/* Notes */}
                      {consultation.notes && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Additional Notes
                          </p>
                          <p className="text-sm text-gray-600">{consultation.notes}</p>
                        </div>
                      )}

                      {/* Follow-up Date */}
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
                                hasUpcomingFollowUp ? 'text-amber-800' : 'text-gray-600'
                              }`}
                            >
                              {hasUpcomingFollowUp
                                ? 'Upcoming Follow-up'
                                : 'Follow-up'}
                            </p>
                            <p
                              className={`text-xs ${
                                hasUpcomingFollowUp ? 'text-amber-600' : 'text-gray-500'
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      {sortedConsultations.length > 0 && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary-800">
              Questions about your treatment?
            </p>
            <p className="text-sm text-primary-700 mt-1">
              Contact Dr. Nishmitha R at +91-8151912525 or visit the clinic for any
              concerns about your diagnosis or treatment plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
