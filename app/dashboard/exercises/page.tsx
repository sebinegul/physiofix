"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dumbbell,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Filter,
  Film,
  Image as ImageIcon,
  Link,
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  instructions: string;
  imageUrl: string | null;
  gifUrl: string | null;
  videoUrl: string | null;
}

const CATEGORIES = ["stretching", "strengthening", "balance", "flexibility", "cardio", "rehabilitation", "other"];
const DIFFICULTIES = ["easy", "medium", "hard"];


async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (res.status === 401) { window.location.href = "/login"; return null; }
    if (!res.ok) return null;
    const json = await res.json();
    return (json && typeof json === "object" && "data" in json) ? json.data as T : json as T;
  } catch { return null; }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("stretching");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const loadExercises = async () => {
    const data = await apiFetch<Exercise[]>("/api/exercises");
    if (data) setExercises(data);
    setLoading(false);
  };

  useEffect(() => { loadExercises(); }, []);

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || e.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const resetForm = () => { setName(""); setDescription(""); setCategory("stretching"); setDifficulty("medium"); setDuration(""); setInstructions(""); setImageUrl(""); setGifUrl(""); setVideoUrl(""); setEditingEx(null); setError(""); };
  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (e: Exercise) => { setEditingEx(e); setName(e.name); setDescription(e.description); setCategory(e.category); setDifficulty(e.difficulty); setDuration(e.duration); setInstructions(e.instructions); setImageUrl(e.imageUrl || ""); setGifUrl(e.gifUrl || ""); setVideoUrl(e.videoUrl || ""); setShowModal(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError("");
    const body = { name, description, category, difficulty, duration, instructions, imageUrl: imageUrl || null, gifUrl: gifUrl || null, videoUrl: videoUrl || null };

    if (editingEx) {
      const res = await apiFetch(`/api/exercises/${editingEx.id}`, { method: "PUT", body: JSON.stringify(body) });
      if (!res) setError("Failed to update exercise");
    } else {
      const res = await apiFetch("/api/exercises", { method: "POST", body: JSON.stringify(body) });
      if (!res) setError("Failed to create exercise");
    }
    setFormLoading(false);
    if (!error) { setShowModal(false); loadExercises(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exercise?")) return;
    await apiFetch(`/api/exercises/${id}`, { method: "DELETE" });
    loadExercises();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>Exercises</h1>
          <p className="text-sm text-slate-500 mt-1">{exercises.length} total exercises</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add Exercise
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
        </div>
        <div className="relative w-full sm:max-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 appearance-none">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center text-slate-400">No exercises found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <div key={ex.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{ex.name}</h3>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{ex.category}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => openEdit(ex)} className="p-3 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(ex.id)} className="p-3 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 flex-1">{ex.description}</p>
              {/* GIF / Video badges */}
              {(ex.gifUrl || ex.videoUrl) && (
                <div className="flex items-center gap-1.5 mt-2">
                  {ex.gifUrl && (
                    <a href={ex.gifUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
                      <ImageIcon className="w-3 h-3" /> GIF
                    </a>
                  )}
                  {ex.videoUrl && (
                    <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors">
                      <Film className="w-3 h-3" /> Video
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_COLORS[ex.difficulty] || DIFFICULTY_COLORS.medium}`}>{ex.difficulty}</span>
                <span className="text-xs text-slate-400">{ex.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editingEx ? "Edit Exercise" : "Add Exercise"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-3 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Name *</label><input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Description *</label><textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white capitalize focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white capitalize focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none">
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Duration *</label><input required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 10 min" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Instructions *</label><textarea required value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">GIF URL</label><input value={gifUrl} onChange={(e) => setGifUrl(e.target.value)} placeholder="https://media.giphy.com/..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-600 mb-1">Video URL (YouTube)</label><input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : editingEx ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
