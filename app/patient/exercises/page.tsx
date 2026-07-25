'use client';

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  Layers,
  Filter,
  Zap,
  AlertCircle,
} from 'lucide-react';

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
    instructions: string;
  };
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<AssignedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/exercises', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setExercises(Array.isArray(data) ? data : data.exercises || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(exercises.map((ae) => ae.exercise.category)))];

  const filteredExercises =
    categoryFilter === 'all'
      ? exercises
      : exercises.filter((ae) => ae.exercise.category === categoryFilter);

  const difficultyConfig = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const difficultyIcon = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return <Zap className="w-3 h-3" />;
      case 'medium':
        return <Zap className="w-3 h-3" />;
      case 'hard':
        return <Zap className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  const categoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'stretching':
        return 'bg-blue-50 text-blue-600';
      case 'strengthening':
        return 'bg-purple-50 text-purple-600';
      case 'balance':
        return 'bg-amber-50 text-amber-600';
      case 'mobility':
        return 'bg-teal-50 text-teal-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
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
          My Exercises
        </h1>
        <p className="text-gray-500 mt-1">
          Your assigned exercises and rehabilitation program.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            {cat !== 'all' && (
              <span className="ml-1.5 text-xs opacity-80">
                ({exercises.filter((ae) => ae.exercise.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No exercises found</p>
          <p className="text-sm text-gray-400 mt-1">
            {categoryFilter === 'all'
              ? 'No exercises assigned yet. Your physiotherapist will assign exercises soon.'
              : `No ${categoryFilter} exercises assigned.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercises.map((ae) => {
            const isExpanded = expandedId === ae.id;
            const ex = ae.exercise;

            return (
              <div
                key={ae.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                {/* Exercise Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ae.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                >
                  {/* Exercise Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-6 h-6 text-primary-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {ex.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          {ex.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyConfig(
                            ex.difficulty
                          )}`}
                        >
                          {difficultyIcon(ex.difficulty)}
                          {ex.difficulty}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Quick info row */}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${categoryColor(ex.category)}`}>
                        {ex.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {ex.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Repeat className="w-3 h-3" />
                        {ae.sets} sets × {ae.reps} reps
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Layers className="w-3 h-3" />
                        {ae.frequency}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Instructions
                      </h4>
                      <div className="space-y-2">
                        {ex.instructions.split('\n').map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-sm text-gray-600">{step.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exercise Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-gray-900">{ae.sets}</p>
                        <p className="text-xs text-gray-500">Sets</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-gray-900">{ae.reps}</p>
                        <p className="text-xs text-gray-500">Reps</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-gray-900">{ex.duration}</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-gray-900">{ae.frequency}</p>
                        <p className="text-xs text-gray-500">Frequency</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {ae.notes && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <p className="text-sm font-medium text-amber-800">Physiotherapist Notes</p>
                        </div>
                        <p className="text-sm text-amber-700">{ae.notes}</p>
                      </div>
                    )}

                    {/* Assigned Date */}
                    <p className="text-xs text-gray-400">
                      Assigned on {formatDate(ae.assignedDate)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
