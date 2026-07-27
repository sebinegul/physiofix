"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  GripVertical,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  condition: string;
  duration: string;
  img: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return null;
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export default function TestimonialsDashboardPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [condition, setCondition] = useState("");
  const [duration, setDuration] = useState("");
  const [img, setImg] = useState("");
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const loadTestimonials = async () => {
    const data = await apiFetch<Testimonial[]>("/api/testimonials?all=true");
    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.condition.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setName("");
    setLocation("");
    setRating(5);
    setText("");
    setCondition("");
    setDuration("");
    setImg("");
    setActive(true);
    setSortOrder(0);
    setEditingItem(null);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setName(item.name);
    setLocation(item.location);
    setRating(item.rating);
    setText(item.text);
    setCondition(item.condition);
    setDuration(item.duration);
    setImg(item.img || "");
    setActive(item.active);
    setSortOrder(item.sortOrder);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccessMsg("");

    const body = {
      name,
      location,
      rating,
      text,
      condition,
      duration,
      img: img || null,
      active,
      sortOrder,
    };

    if (editingItem) {
      const res = await apiFetch(`/api/testimonials/${editingItem.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (!res) {
        setError("Failed to update testimonial");
        setFormLoading(false);
        return;
      }
      setSuccessMsg("Testimonial updated!");
    } else {
      const res = await apiFetch("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res) {
        setError("Failed to create testimonial");
        setFormLoading(false);
        return;
      }
      setSuccessMsg("Testimonial created!");
    }

    setFormLoading(false);
    setShowModal(false);
    resetForm();
    loadTestimonials();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await apiFetch(`/api/testimonials/${id}`, { method: "DELETE" });
    loadTestimonials();
  };

  const toggleActive = async (item: Testimonial) => {
    await apiFetch(`/api/testimonials/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ active: !item.active }),
    });
    loadTestimonials();
  };

  const activeCount = testimonials.filter((t) => t.active).length;
  const inactiveCount = testimonials.filter((t) => !t.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            Testimonials
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} visible on homepage · {inactiveCount} hidden
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm bg-green-50 border border-green-200 text-green-700">
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, condition, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No testimonials yet. Add your first testimonial.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Patient</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Condition</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Rating</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Visibility</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate max-w-xs">{item.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                          item.active
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {item.active ? (
                          <>
                            <Eye className="w-3 h-3" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(item)}
                          title={item.active ? "Hide from homepage" : "Show on homepage"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.active
                              ? "text-green-600 hover:bg-green-50"
                              : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Patient Name *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Location
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. JP Nagar"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Testimonial Text *
                </label>
                <textarea
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="What the patient said about their experience..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Condition *
                  </label>
                  <input
                    required
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g. Chronic Back Pain"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Duration
                  </label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 6 weeks"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Photo URL
                  </label>
                  <input
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="https://randomuser.me/api/portraits/men/32.jpg"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Lower = shown first</p>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500/30"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Visible on homepage
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : editingItem ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
