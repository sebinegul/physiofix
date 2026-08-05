"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info } from "lucide-react";

/* ─── types ─── */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── max visible toasts ─── */

const MAX_TOASTS = 3;
const DISMISS_MS = 3500;

/* ─── icon per type ─── */

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
        <Check className="h-4 w-4 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (type === "error") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500">
        <X className="h-4 w-4 text-white" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
      <Info className="h-4 w-4 text-white" strokeWidth={3} />
    </div>
  );
}

/* ─── border color per type ─── */

function borderClass(type: ToastType): string {
  if (type === "success") return "border-l-emerald-500";
  if (type === "error") return "border-l-red-500";
  return "border-l-blue-500";
}

/* ─── progress bar color per type ─── */

function progressClass(type: ToastType): string {
  if (type === "success") return "bg-emerald-500";
  if (type === "error") return "bg-red-500";
  return "bg-blue-500";
}

/* ─── single toast ─── */

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto w-80 overflow-hidden rounded-2xl border border-white/20 border-l-4 bg-white/90 shadow-xl shadow-black/10 backdrop-blur-xl ${borderClass(toast.type)}`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <ToastIcon type={toast.type} />
        <p className="flex-1 pt-1 text-sm font-medium text-gray-800">
          {toast.message}
        </p>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-lg p-3 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-gray-100">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: DISMISS_MS / 1000, ease: "linear" }}
          className={`h-full ${progressClass(toast.type)}`}
        />
      </div>
    </motion.div>
  );
}

/* ─── provider ─── */

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++nextId;
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });
      const timer = setTimeout(() => removeToast(id), DISMISS_MS);
      timers.current.set(id, timer);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col-reverse gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ─── hook ─── */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider
    return {
      showToast: () => {},
    };
  }
  return ctx;
}
