'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Trophy,
  Calendar,
  Dumbbell,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Volume2,
  VolumeX,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ExerciseItem {
  id: string;
  sets: number;
  durationSeconds: number;
  sortOrder: number;
  notes?: string;
  exercise: {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    instructions: string;
    gifUrl?: string;
    videoUrl?: string;
  };
}

interface DailyPlan {
  id: string;
  dayNumber: number;
  label: string;
  items: ExerciseItem[];
}

interface Plan {
  id: string;
  title: string;
  totalDays: number;
  createdAt: string;
  consultation: { date: string; diagnosis: string };
  dailyPlans: DailyPlan[];
}

interface ProgressRecord {
  exercisePlanItemId: string;
  dayNumber: number;
  sortOrder: number;
  completedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* audio not available */
  }
}

/** Web Speech API helper – speaks text when enabled */
function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.volume = 0.8;
    window.speechSynthesis.speak(utter);
  } catch {
    /* speech not available */
  }
}

function categoryColor(cat: string): string {
  switch (cat?.toLowerCase()) {
    case 'stretching':
      return 'bg-blue-100 text-blue-700';
    case 'strengthening':
      return 'bg-indigo-100 text-indigo-700';
    case 'balance':
      return 'bg-amber-100 text-amber-700';
    case 'mobility':
      return 'bg-cyan-100 text-cyan-700';
    case 'cardio':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function difficultyConfig(diff: string): string {
  switch (diff?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'hard':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/* ------------------------------------------------------------------ */
/*  Confetti component (inline CSS – no external package)              */
/* ------------------------------------------------------------------ */

function ConfettiOverlay() {
  const [particles, setParticles] = useState<
    { id: number; color: string; left: string; delay: string; duration: string; size: number; rotation: string }[]
  >([]);

  useEffect(() => {
    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
    const arr = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      size: 6 + Math.random() * 8,
      rotation: `${Math.random() * 360}deg`,
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
            transform: `rotate(${p.rotation})`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timer Ring (SVG circular progress)                                 */
/* ------------------------------------------------------------------ */

function TimerRing({
  progress,
  timeLeft,
  totalTime,
}: {
  progress: number;
  timeLeft: number;
  totalTime: number;
}) {
  const radius = 70;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={160} height={160} className="-rotate-90">
        {/* Track */}
        <circle
          cx={80}
          cy={80}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={80}
          cy={80}
          r={radius}
          fill="none"
          stroke="url(#timerGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900 font-display tabular-nums">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs text-gray-400 mt-1">
          of {formatTime(totalTime)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exercise Timer Card                                                */
/* ------------------------------------------------------------------ */

function ExerciseTimerCard({
  item,
  onComplete,
  speakEnabled,
}: {
  item: ExerciseItem;
  onComplete: () => void;
  speakEnabled: boolean;
}) {
  const totalSets = item.sets;
  const duration = item.durationSeconds || 30;

  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speakEnabledRef = useRef(speakEnabled);
  speakEnabledRef.current = speakEnabled;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Set complete
          if (intervalRef.current) clearInterval(intervalRef.current);
          playBeep();

          if (currentSet >= totalSets) {
            // All sets done
            setTimeout(() => {
              if (speakEnabledRef.current) speak('Great job! Exercise complete!');
              setIsComplete(true);
              onComplete();
            }, 600);
            return 0;
          } else {
            // Advance to next set
            setTimeout(() => {
              setCurrentSet((s) => s + 1);
              setTimeLeft(duration);
              setIsRunning(false);
            }, 600);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, currentSet, totalSets, duration, onComplete]);

  const handleStart = () => {
    if (timeLeft > 0) {
      if (speakEnabled) {
        window.speechSynthesis?.cancel();
        if (currentSet === 1 && timeLeft === duration) {
          // First set – "Three, two, one, go!" countdown
          const words = ['Three', 'Two', 'One', 'Go!'];
          words.forEach((word, i) => {
            setTimeout(() => {
              playBeep();
              speak(word);
            }, i * 1000);
          });
          setTimeout(() => setIsRunning(true), 4000);
        } else {
          // Subsequent set – announce
          speak(`Set ${currentSet} starting`);
          setIsRunning(true);
        }
      } else {
        setIsRunning(true);
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setCurrentSet(1);
  };

  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 transition-all ${
        isComplete
          ? 'bg-green-50 border-green-200'
          : isRunning
            ? 'bg-blue-50 border-blue-200'
            : 'bg-white border-slate-200/60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">
            Set {currentSet} of {totalSets}
          </span>
          {item.exercise.duration && (
            <span className="text-xs text-gray-400">
              ({item.exercise.duration})
            </span>
          )}
        </div>
        {isComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-green-600"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Done!</span>
          </motion.div>
        )}
      </div>

      {/* Timer Ring */}
      <div className="flex justify-center mb-5">
        <TimerRing progress={progress} timeLeft={timeLeft} totalTime={duration} />
      </div>

      {/* Controls */}
      {!isComplete && (
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md shadow-green-200 transition-all active:scale-95"
            >
              <Play className="w-4 h-4" />
              {timeLeft === duration ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-md shadow-yellow-200 transition-all active:scale-95"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-200 transition-all active:scale-95"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}

      {/* Set indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {Array.from({ length: totalSets }, (_, i) => {
          const setNum = i + 1;
          const isCompleted = setNum < currentSet || (setNum === currentSet && timeLeft === 0 && isComplete);
          const isCurrent = setNum === currentSet && !isComplete;
          return (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isCompleted
                  ? 'bg-green-500'
                  : isCurrent
                    ? 'bg-blue-500 ring-2 ring-blue-200'
                    : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exercise Card                                                      */
/* ------------------------------------------------------------------ */

function ExerciseCard({
  item,
  index,
  onComplete,
  isCompleted,
  speakEnabled,
}: {
  item: ExerciseItem;
  index: number;
  onComplete: () => void;
  isCompleted: boolean;
  speakEnabled: boolean;
}) {
  const [showInstructions, setShowInstructions] = useState(false);
  const ex = item.exercise;

  const youtubeId = ex.videoUrl ? extractYouTubeId(ex.videoUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border overflow-hidden transition-all ${
        isCompleted
          ? 'bg-green-50/50 border-green-200/60'
          : 'bg-white border-slate-200/60 shadow-sm'
      }`}
    >
      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-green-100' : 'bg-blue-50'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Dumbbell className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="min-w-0">
              <h3
                className={`font-semibold ${
                  isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                }`}
              >
                {ex.name}
              </h3>
              {ex.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                  {ex.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(ex.category)}`}>
              {ex.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyConfig(ex.difficulty)}`}>
              {ex.difficulty}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span>📐 {item.sets} sets</span>
          <span>⏱ {item.durationSeconds || 30}s per set</span>
        </div>
      </div>

      {/* Media */}
      {ex.gifUrl && !isCompleted && (
        <div className="px-5 pb-3">
          <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
            <Image
              src={ex.gifUrl}
              alt={`${ex.name} demonstration`}
              width={400}
              height={192}
              className="w-full h-48 object-contain bg-slate-50"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {!ex.gifUrl && youtubeId && !isCompleted && (
        <div className="px-5 pb-3">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={`${ex.name} video`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Instructions toggle */}
      {ex.instructions && (
        <div className="px-5">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
          >
            <Info className="w-4 h-4" />
            Instructions
            {showInstructions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50 rounded-xl p-4 mb-3 space-y-2">
                  {ex.instructions.split('\n').map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-600">
                        {step.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div className="px-5 pb-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">{item.notes}</p>
          </div>
        </div>
      )}

      {/* Timer */}
      {!isCompleted && (
        <div className="px-5 pb-5 pt-2">
          <ExerciseTimerCard item={item} onComplete={onComplete} speakEnabled={speakEnabled} />
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div className="px-5 pb-4">
          <div className="flex items-center justify-center gap-2 py-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Exercise completed!</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ExercisesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  // Set of completed ExercisePlanItem IDs (persisted to DB)
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Set<string>>(new Set());
  const [dayFullyComplete, setDayFullyComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);

  // Fetch exercise plans + progress
  useEffect(() => {
    Promise.all([
      fetch('/api/exercise-plans').then((r) => {
        if (r.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return r.json();
      }),
      fetch('/api/exercise-progress').then((r) => {
        if (r.status === 401) return null;
        return r.json();
      }),
    ])
      .then(([plansData, progressData]) => {
        if (plansData?.data) {
          setPlans(plansData.data);
        }
        // Build set of completed exercise plan item IDs from DB
        if (progressData?.data) {
          const ids = new Set<string>(
            progressData.data.map((p: ProgressRecord) => p.exercisePlanItemId)
          );
          setCompletedExerciseIds(ids);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Reset day selection when plan changes (but keep completedExerciseIds)
  useEffect(() => {
    setSelectedDayIndex(0);
    setDayFullyComplete(false);
    setShowConfetti(false);
  }, [selectedPlanIndex]);

  // Reset confetti/dayFullyComplete when day changes (completedExerciseIds persists)
  useEffect(() => {
    setDayFullyComplete(false);
    setShowConfetti(false);
  }, [selectedDayIndex]);

  const currentPlan = plans[selectedPlanIndex];
  const currentDay = currentPlan?.dailyPlans[selectedDayIndex];
  const totalExercises = currentDay?.items.length || 0;

  // Derive completedExercises Set (keyed by "dayNumber-sortOrder") from persisted IDs
  const completedExercises = useMemo(() => {
    const result = new Set<string>();
    if (!currentDay) return result;
    for (const item of currentDay.items) {
      if (completedExerciseIds.has(item.id)) {
        result.add(`${currentDay.dayNumber}-${item.sortOrder}`);
      }
    }
    return result;
  }, [completedExerciseIds, currentDay]);

  const completedCount = completedExercises.size;
  const progress = totalExercises > 0 ? completedCount / totalExercises : 0;

  const handleExerciseComplete = useCallback(
    (exerciseKey: string) => {
      // Find the actual item to get its DB id (key = "dayNumber-sortOrder")
      const item = currentDay?.items.find(
        (i) => `${currentDay.dayNumber}-${i.sortOrder}` === exerciseKey
      );

      // Add to local state
      setCompletedExerciseIds((prev) => {
        const next = new Set(prev);
        if (item) next.add(item.id);
        return next;
      });

      // Save to DB (session cookie sent automatically)
      if (item && currentPlan && currentDay) {
        fetch('/api/exercise-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exercisePlanId: currentPlan.id,
            dailyPlanId: currentDay.id || currentDay.label,
            exercisePlanItemId: item.id,
            dayNumber: currentDay.dayNumber,
            sortOrder: item.sortOrder,
          }),
        }).catch((err) => console.error('Failed to save progress:', err));
      }

      // Announce next exercise
      if (speakEnabled && currentDay) {
        const completedItem = currentDay.items.find(
          (i) => `${currentDay.dayNumber}-${i.sortOrder}` === exerciseKey,
        );
        const completedIdx = currentDay.items.indexOf(completedItem!);
        const nextItem = currentDay.items[completedIdx + 1];
        if (nextItem) {
          setTimeout(() => speak(`Next exercise: ${nextItem.exercise.name}`), 1200);
        }
      }
    },
    [speakEnabled, currentDay, currentPlan],
  );

  // Check if day is fully complete
  useEffect(() => {
    if (!currentDay) return;
    const allDone = currentDay.items.every((item) =>
      completedExerciseIds.has(item.id),
    );
    if (allDone && currentDay.items.length > 0 && !dayFullyComplete) {
      setDayFullyComplete(true);
      setShowConfetti(true);
      if (speakEnabled) speak('Great job! Exercise complete!');
      // Auto-hide confetti after 5 seconds
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completedExerciseIds, currentDay, dayFullyComplete, speakEnabled]);

  /* -------------------------------------------------------------- */
  /*  Loading skeleton                                                */
  /* -------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="h-10 bg-gray-200 rounded-xl w-full" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 bg-gray-200 rounded-full w-20" />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /*  Empty state                                                     */
  /* -------------------------------------------------------------- */
  if (!plans.length) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
          My Exercises
        </h1>
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium text-lg">No exercise plans yet</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
            Your physiotherapist will create a personalized exercise plan for you.
            Check back soon!
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /*  Main render                                                     */
  /* -------------------------------------------------------------- */
  return (
    <>
      {showConfetti && <ConfettiOverlay />}

      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              My Exercises
            </h1>
            <p className="text-gray-500 mt-1">
              Follow your personalized exercise plan day by day.
            </p>
          </div>
          <button
            onClick={() => {
              const next = !speakEnabled;
              setSpeakEnabled(next);
              if (!next) window.speechSynthesis?.cancel();
            }}
            title={speakEnabled ? 'Voice instructions ON – click to disable' : 'Voice instructions OFF – click to enable'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
              speakEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-50 text-gray-400 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {speakEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {speakEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>

        {/* Plan Selector (if multiple plans) */}
        {plans.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              <Calendar className="w-4 h-4 inline mr-1" />
              Exercise Plan
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {plans.map((plan, i) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanIndex(i)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedPlanIndex === i
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white text-gray-600 border border-slate-200/60 hover:bg-slate-50'
                  }`}
                >
                  {plan.title}
                  {plan.consultation?.diagnosis && (
                    <span className="ml-1.5 text-xs opacity-80">
                      — {plan.consultation.diagnosis}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Plan title */}
        {currentPlan && (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentPlan.title}
            </h2>
            {currentPlan.consultation?.diagnosis && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                {currentPlan.consultation.diagnosis}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {currentDay && (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Day {selectedDayIndex + 1} of {currentPlan.dailyPlans.length}
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {completedCount}/{totalExercises} exercises
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Day Tabs */}
        {currentPlan && (
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none lg:hidden" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none lg:hidden" />

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {currentPlan.dailyPlans.map((day, i) => {
                const dayCompletedCount = day.items.filter((item) =>
                  completedExerciseIds.has(item.id),
                ).length;
                const dayTotal = day.items.length;
                const dayFullyDone = dayTotal > 0 && dayCompletedCount === dayTotal;

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`flex flex-col items-center px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-w-[70px] ${
                      selectedDayIndex === i
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200'
                        : dayFullyDone
                          ? 'bg-green-50 text-green-700 border border-green-200/60 hover:bg-green-100'
                          : 'bg-white text-gray-600 border border-slate-200/60 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-semibold">Day {day.dayNumber}</span>
                    {day.label && (
                      <span className="text-[10px] opacity-80 mt-0.5 truncate max-w-[80px]">
                        {day.label}
                      </span>
                    )}
                    {dayFullyDone && selectedDayIndex !== i && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Day Navigation */}
        {currentPlan && currentPlan.dailyPlans.length > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDayIndex((i) => Math.max(0, i - 1))}
              disabled={selectedDayIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Day
            </button>
            <button
              onClick={() =>
                setSelectedDayIndex((i) =>
                  Math.min(currentPlan.dailyPlans.length - 1, i + 1),
                )
              }
              disabled={selectedDayIndex === currentPlan.dailyPlans.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next Day
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Day Complete Celebration */}
        <AnimatePresence>
          {dayFullyComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-6 text-center"
            >
              <div className="text-5xl mb-3">
                {selectedDayIndex === currentPlan.dailyPlans.length - 1 ? '🏆' : '⭐'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Great job!
              </h3>
              <p className="text-gray-600">
                You&apos;ve completed all exercises for{' '}
                <span className="font-semibold text-blue-600">
                  Day {currentDay?.dayNumber}
                </span>
                !
              </p>
              {selectedDayIndex < currentPlan.dailyPlans.length - 1 && (
                <button
                  onClick={() => setSelectedDayIndex((i) => i + 1)}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                >
                  Continue to Day {currentDay ? currentDay.dayNumber + 1 : ''}
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              )}
              {selectedDayIndex === currentPlan.dailyPlans.length - 1 && (
                <p className="text-sm text-indigo-600 font-medium mt-3">
                  🎉 You&apos;ve completed the entire program!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercises List */}
        {currentDay && currentDay.items.length > 0 ? (
          <div className="space-y-4">
            {currentDay.items.map((item, index) => {
              const key = `${currentDay.dayNumber}-${item.sortOrder}`;
              return (
                <ExerciseCard
                  key={key}
                  item={item}
                  index={index}
                  onComplete={() => handleExerciseComplete(key)}
                  isCompleted={completedExercises.has(key)}
                  speakEnabled={speakEnabled}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No exercises for this day</p>
            <p className="text-sm text-gray-400 mt-1">
              This day doesn&apos;t have any exercises assigned yet.
            </p>
          </div>
        )}
      </div>

      {/* Hide scrollbar utility */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
