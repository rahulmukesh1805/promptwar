import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Sparkles,
  ClipboardList,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';
import { NavigatorResponse, SupportedLanguage } from '../types';
import { apiClient } from '../services/api';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';
import { storageService } from '../services/storageService';

interface NavigatorPageProps {
  currentLanguage: SupportedLanguage;
}

const SAMPLE_QUERIES = [
  'I need help with skin problems and rash.',
  'Chest discomfort, blood pressure and palpitations.',
  'Fasting blood sugar is high and feeling very thirsty.',
  'Severe knee pain and stiffness when climbing stairs.',
  'Child has persistent fever and mild cough.',
  'Frequent stomach acidity and severe bloating.',
];

export const NavigatorPage: React.FC<NavigatorPageProps> = ({ currentLanguage }) => {
  const [query, setQuery] = useState<string>('I need help with skin problems.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NavigatorResponse | null>(null);

  const handleSearch = async (userQuery?: string) => {
    const q = (userQuery || query).trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const data = await apiClient.navigateHealthcare(q, currentLanguage);
      setResult(data);
      storageService.addActivity({
        type: 'navigator',
        title: `Navigator: ${data.specialty_name}`,
        subtitle: q.slice(0, 35) + '...',
      });
    } catch (e) {
      console.warn('Navigator error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          Care Coordination & Triage
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Healthcare Navigator
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Describe your health concern to understand which type of healthcare specialist is relevant.
        </p>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />

      {/* Query Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Describe Your Health Concern or Need
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="e.g., I need help with skin problems or rash..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />

          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Find Specialist</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="pt-2">
          <span className="text-[11px] text-slate-400 font-semibold block mb-2">
            Try Example Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(sample);
                  handleSearch(sample);
                }}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors text-left cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Warning if Life-Threatening Red Flag Detected */}
      {result?.urgency_level === 'emergency' && (
        <MedicalSafetyNotice
          isUrgent={true}
          urgentMessage={result.emergency_warning}
        />
      )}

      {/* Navigator Results Card */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          {/* Specialty Banner */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-white rounded-2xl p-5 border border-indigo-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" /> Recommended Medical Specialist Category
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {result.specialty_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              {result.specialty_description}
            </p>
          </div>

          {/* Common Conditions Treated */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Conditions Commonly Evaluated by This Specialty:
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.common_conditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  • {cond}
                </span>
              ))}
            </div>
          </div>

          {/* What to Prepare for Your Appointment */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              What to Prepare for Your Appointment:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.preparation_checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Questions You Can Ask the Specialist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Helpful Questions to Ask During Your Visit:
            </h3>

            <div className="space-y-2">
              {result.questions_for_specialist.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                >
                  "{q}"
                </div>
              ))}
            </div>
          </div>

          {/* Non-diagnostic Reassurance */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 italic">
            Reminder: The Healthcare Navigator provides category recommendations and preparation steps. It does not
            substitute for an in-person physical clinical examination.
          </div>
        </div>
      )}
    </div>
  );
};
