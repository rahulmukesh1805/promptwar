import React, { useState } from 'react';
import {
  Lock,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileX2,
  EyeOff,
  ServerOff,
  UserX,
} from 'lucide-react';
import { apiClient } from '../services/api';

export const PrivacyPage: React.FC = () => {
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteDocuments = async () => {
    setIsDeleting(true);
    await apiClient.clearUserDocuments();
    setIsDeleting(false);
    setDeletedSuccess(true);
    setTimeout(() => setDeletedSuccess(false), 5000);
  };

  const principles = [
    {
      icon: UserX,
      title: 'Minimal Personal Data Collection',
      desc: 'We do not ask for real names, government IDs, addresses, phone numbers, or insurance policy information to use HealthBridge.',
    },
    {
      icon: ServerOff,
      title: 'Session-Based Ephemeral Storage',
      desc: 'Uploaded medical documents are processed in temporary volatile memory during your active web session and are never saved to public databases.',
    },
    {
      icon: EyeOff,
      title: 'No Public Model Training',
      desc: 'Your uploaded reports and private health inquiries are never ingested to train public AI models or shared with diagnostic advertisers.',
    },
    {
      icon: FileX2,
      title: 'User-Controlled Instant Deletion',
      desc: 'You have permanent control to purge all uploaded files, session-generated explanations, and activity history with one click.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Patient Data Protection
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          🔒 Privacy First Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Transparent, honest privacy safeguards built for sensitive healthcare information.
        </p>
      </div>

      {/* Privacy Status Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Active Session Privacy Status: Secure & Ephemeral
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              No account creation required • No persistent document tracking • In-browser isolation
            </p>
          </div>

          <button
            onClick={handleDeleteDocuments}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete My Documents'}</span>
          </button>
        </div>

        {deletedSuccess && (
          <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              All session documents, cached report extractions, and temporary uploads have been permanently cleared!
            </span>
          </div>
        )}
      </div>

      {/* Core Privacy Safeguards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {p.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Regulatory Transparency Notice */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Honest Compliance & Scope Note
        </h4>
        <p>
          As an educational prototype built for hackathon evaluation, HealthBridge implements privacy by design:
          we do not store personal records, nor do we build advertising profiles. We intentionally do not make
          unsubstantiated claims regarding certifications like HIPAA or GDPR, because true compliance requires
          enterprise hospital audit certification. We operate under strict educational non-diagnostic terms.
        </p>
      </div>
    </div>
  );
};
