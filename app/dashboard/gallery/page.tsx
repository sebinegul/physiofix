"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  beforeUrl: string;
  afterUrl: string;
  category: string;
  sortOrder: number;
  active: boolean;
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

const CATEGORIES = ["general", "sports", "ortho", "neuro", "post-surgery"];

export default function GalleryDashboardPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [category, setCategory] = useState("general");
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const loadItems = async () => {
    const data = await apiFetch<GalleryItem[]>("/api/gallery?all=true");
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setBeforeUrl("");
    setAfterUrl("");
    setCategory("general");
    setActive(true);
    setSortOrder(0);
    setEditingItem(null);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setBeforeUrl(item.beforeUrl);
    setAfterUrl(item.afterUrl);
    setCategory(item.category);
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
      title,
      description: description || null,
      beforeUrl,
      afterUrl,
      category,
      active,
      sortOrder,
    };

    if (editingItem) {
      const res = await apiFetch(`/api/gallery/${editingItem.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (!res) {
        setError("Failed to update gallery item");
        setFormLoading(false);
        return;
      }
      setSuccessMsg("Gallery item updated!");
    } else {
      const res = await apiFetch("/api/gallery", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res) {
        setError("Failed to create gallery item");
        setFormLoading(false);
        return;
      }
      setSuccessMsg("Gallery item created!");
    }

    setFormLoading(false);
    setShowModal(false);
    resetForm();
    loadItems();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    await apiFetch(`/api/gallery/${id}`, { method: "DELETE" });
    loadItems();
  };

  const toggleActive = async (item: GalleryItem) => {
    await apiFetch(`/api/gallery/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ active: !item.active }),
    });
    loadItems();
  };

  const activeCount = items.filter((i) => i.active).length;
  const inactiveCount = items.filter((i) => !i.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            Gallery (Before / After)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} visible on homepage · {inactiveCount} hidden
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <ImagePlus className="w-4 h-4" /> Add Gallery Item
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
          placeholder="Search by title or category..."
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
          <ImagePlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No gallery items yet. Add your first before/after comparison.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Before / After</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Visibility</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate max-w-xs">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={item.beforeUrl}
                            alt="Before"
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-medium">
                            Before
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">→</span>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={item.afterUrl}
                            alt="After"
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-medium">
                            After
                          </span>
                        </div>
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
                {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
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
                    Title *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Knee Rehabilitation"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Optional description of the transformation..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Before Image URL *
                  </label>
                  <input
                    required
                    value={beforeUrl}
                    onChange={(e) => setBeforeUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                  {beforeUrl && (
                    <div className="mt-2 w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                      <Image src={beforeUrl} alt="Before preview" fill sizes="192px" className="object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    After Image URL *
                  </label>
                  <input
                    required
                    value={afterUrl}
                    onChange={(e) => setAfterUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none"
                  />
                  {afterUrl && (
                    <div className="mt-2 w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                      <Image src={afterUrl} alt="After preview" fill sizes="192px" className="object-cover" />
                    </div>
                  )}
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
