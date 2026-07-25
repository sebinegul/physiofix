'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Shield,
  Edit3,
  Save,
  X,
  Heart,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface PatientData {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Editable form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const authFetch = (url: string) =>
      fetch(url, { headers }).then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return r.json();
      });

    Promise.all([
      authFetch('/api/auth/me'),
      authFetch('/api/patients'),
    ])
      .then(([userData, patientData]) => {
        setUser(userData);
        setPatient(Array.isArray(patientData?.data) ? patientData.data[0] : patientData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          dateOfBirth: patientData.dateOfBirth || '',
          gender: patientData.gender || '',
          address: patientData.address || '',
          emergencyContact: patientData.emergencyContact || '',
          medicalHistory: patientData.medicalHistory || '',
          allergies: patientData.allergies || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('token');
    if (!token || !patient) {
      if (!token) window.location.href = '/login';
      return;
    }

    try {
      // Update patient data
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSaveSuccess(true);
      setEditing(false);
      fetchData();

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      dateOfBirth: patient?.dateOfBirth || '',
      gender: patient?.gender || '',
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      medicalHistory: patient?.medicalHistory || '',
      allergies: patient?.allergies || '',
    });
    setEditing(false);
    setError('');
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-40" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            My Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information.</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                  <User className="w-4 h-4 text-gray-400" />
                  {user?.name || 'Not set'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                <Mail className="w-4 h-4 text-gray-400" />
                {user?.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {user?.phone || 'Not set'}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Date of Birth
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {patient?.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not set'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Gender
              </label>
              {editing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                  <Activity className="w-4 h-4 text-gray-400" />
                  {patient?.gender
                    ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                    : 'Not set'}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Address
              </label>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Enter your address"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                />
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {patient?.address || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-gray-900">Emergency Contact</h2>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Emergency Contact Details
            </label>
            {editing ? (
              <textarea
                value={formData.emergencyContact}
                onChange={(e) => updateField('emergencyContact', e.target.value)}
                placeholder="Name, relationship, and phone number"
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              />
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-900 py-2.5">
                <Shield className="w-4 h-4 text-gray-400" />
                {patient?.emergencyContact || 'Not set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h2 className="font-semibold text-gray-900">Medical Information</h2>
        </div>
        <div className="p-6 space-y-5">
          {/* Medical History */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Medical History
            </label>
            {editing ? (
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => updateField('medicalHistory', e.target.value)}
                placeholder="Previous surgeries, chronic conditions, ongoing treatments..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              />
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
                <p className="text-sm text-gray-600">
                  {patient?.medicalHistory || 'No medical history recorded. This helps our team provide better care.'}
                </p>
              </div>
            )}
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Allergies
            </label>
            {editing ? (
              <textarea
                value={formData.allergies}
                onChange={(e) => updateField('allergies', e.target.value)}
                placeholder="Any known allergies (medications, latex, etc.)"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              />
            ) : (
              <div className="bg-amber-50 rounded-xl p-4 min-h-[60px] border border-amber-100">
                {patient?.allergies ? (
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {patient.allergies}
                  </p>
                ) : (
                  <p className="text-sm text-amber-700">
                    No allergies recorded. Please inform us of any allergies during your visit.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
