"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Share2, ChevronDown, ChevronRight, BookOpen } from "lucide-react";

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
      <div className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
        {message}
      </div>
    </div>
  );
}

/* ── Share Button ─────────────────────────────────────────────────────── */
export function ShareButton({ title }: { title: string }) {
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setToast("Link copied!");
    }
  }, [title]);

  return (
    <>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
        aria-label="Share article"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

/* ── Table of Contents ────────────────────────────────────────────────── */
export interface TocItem {
  id: string;
  text: string;
  level: number; // 2 or 3
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Observe headings for active-state highlight
  useEffect(() => {
    if (items.length === 0) return;

    const ids = items.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  /* ── Mobile (collapsible) ── */
  const mobileList = (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:shadow-md"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          Table of Contents
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {open && (
        <nav className="mt-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <TocList items={items} activeId={activeId} />
        </nav>
      )}
    </div>
  );

  /* ── Desktop (sticky sidebar) ── */
  const desktopSidebar = (
    <div className="hidden lg:block">
      <div className="sticky top-28">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <BookOpen className="h-3.5 w-3.5" />
          On this page
        </div>
        <nav className="space-y-0.5 border-l-2 border-slate-100 pl-4">
          <TocList items={items} activeId={activeId} />
        </nav>
      </div>
    </div>
  );

  return { mobileList, desktopSidebar };
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block rounded-lg px-3 py-1.5 text-sm transition-all ${
              item.level === 3 ? "pl-6" : ""
            } ${
              activeId === item.id
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── Heading ID helper ────────────────────────────────────────────────── */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseToc(html: string): TocItem[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    items.push({ id: slugify(text), text, level });
  }
  return items;
}
