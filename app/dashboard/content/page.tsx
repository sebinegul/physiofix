"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
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
    return res.json();
  } catch { return null; }
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadContent = async () => {
    const data = await apiFetch<ContentItem[]>("/api/content");
    if (data) {
      setItems(data);
      const map: Record<string, string> = {};
      data.forEach((item) => { map[item.key] = item.value; });
      setEditedValues(map);
    }
    setLoading(false);
  };

  useEffect(() => { loadContent(); }, []);

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await apiFetch("/api/content", {
      method: "PUT",
      body: JSON.stringify({ content: editedValues }),
    });

    if (res) {
      setMessage({ type: "success", text: "Content updated successfully!" });
      loadContent();
    } else {
      setMessage({ type: "error", text: "Failed to update content" });
    }
    setSaving(false);
  };

  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
          Site Content
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage website content and settings</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No content items found</p>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-4 hover:bg-slate-50/50">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {formatKey(item.key)}
                    <span className="text-xs text-slate-400 font-normal ml-2">({item.key})</span>
                  </label>
                  {editedValues[item.key] && editedValues[item.key].length > 100 ? (
                    <textarea
                      value={editedValues[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editedValues[item.key] || ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                    />
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Last updated: {new Date(item.updatedAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
