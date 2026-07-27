"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
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

export default function ContactsDashboardPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  const loadContacts = async () => {
    const data = await apiFetch<ContactSubmission[]>("/api/contacts");
    if (data) setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    const result = await apiFetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (result) {
      setMessage({ type: "success", text: "Contact submission deleted." });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: "Failed to delete contact submission." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            Contact Submissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {contacts.length} total submission{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Success/Error Message */}
      {message.type && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-600"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Contacts table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Message</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate max-w-xs">{contact.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs sm:hidden mt-0.5">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{contact.email}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-slate-500 truncate max-w-[250px]">{contact.message}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(contact.id)}
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
    </div>
  );
}
