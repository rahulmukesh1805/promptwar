import React, { useState, useEffect } from 'react';
import {
  FileText,
  MessageCircle,
  Pill,
  MapPin,
  Mic,
  Languages,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Clock,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { RecentActivityItem, SupportedLanguage } from '../types';
import { storageService } from '../services/storageService';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onOpenVoiceModal: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenPresentationDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenVoiceModal,
  currentLanguage,
  onLanguageChange,
  onOpenPresentationDemo,
}) => {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);

  useEffect(() => {
    setActivities(storageService.getRecentActivities());
  }, []);

  const cards = [
    {
      id: 'report',
      title: 'Explain My Medical Report',
      desc: 'Upload a medical document and get a simple explanation.',
      icon: FileText,
      color: 'from-teal-500/10 to-teal-500/20 text-teal-700 border-teal-200/80',
      iconColor: 'bg-teal-500 text-white',
      badge: 'Core Feature',
      action: () => onNavigate('report'),
    },
    {
      id: 'chat',
      title: 'Ask Health AI',
      desc: 'Ask general healthcare questions in natural language.',
      icon: MessageCircle,
      color: 'from-sky-500/10 to-sky-500/20 text-sky-700 border-sky-200/80',
      iconColor: 'bg-sky-500 text-white',
      badge: 'Conversational',
      action: () => onNavigate('chat'),
    },
    {
      id: 'medicines',
      title: 'Medicine Information',
      desc: 'Understand general information about medicines.',
      icon: Pill,
      color: 'from-emerald-500/10 to-emerald-500/20 text-emerald-700 border-emerald-200/80',
      iconColor: 'bg-emerald-500 text-white',
      badge: 'Directory',
      action: () => onNavigate('medicines'),
    },
    {
      id: 'navigator',
      title: 'Healthcare Navigator',
      desc: 'Understand which type of healthcare service may be relevant.',
      icon: MapPin,
      color: 'from-indigo-500/10 to-indigo-500/20 text-indigo-700 border-indigo-200/80',
      iconColor: 'bg-indigo-500 text-white',
      badge: 'Triage & Prep',
      action: () => onNavigate('navigator'),
    },
    {
      id: 'voice',
      title: 'Voice Assistant',
      desc: 'Ask questions using your voice.',
      icon: Mic,
      color: 'from-rose-500/10 to-rose-500/20 text-rose-700 border-rose-200/80',
      iconColor: 'bg-rose-500 text-white',
      badge: 'Web Speech',
      action: onOpenVoiceModal,
    },
    {
      id: 'language',
      title: 'Language',
      desc: 'Get explanations in your preferred language.',
      icon: Languages,
      color: 'from-amber-500/10 to-amber-500/20 text-amber-700 border-amber-200/80',
      iconColor: 'bg-amber-500 text-white',
      badge: '8 Indian Languages',
      action: () => onNavigate('report'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 pb-16 pt-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold border border-teal-400/20">
            <Activity className="w-3.5 h-3.5" />
            Patient Accessibility Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to HealthBridge AI
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Translate confusing pathology jargon into clear, comforting explanations in your mother tongue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenPresentationDemo}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>🎬 Presentation Demo</span>
          </button>
          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>

      {/* Safety notice */}
      <MedicalSafetyNotice />

      {/* 6 Core Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={c.action}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${c.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {c.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                <span>Access Feature</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Recent Activity & Privacy Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Activity</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Session logs</span>
          </div>

          <div className="divide-y divide-slate-100 space-y-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-start justify-between gap-3 first:pt-1 last:pb-1"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 mt-0.5">
                    {act.type === 'report' && <FileText className="w-4 h-4" />}
                    {act.type === 'question' && <MessageCircle className="w-4 h-4" />}
                    {act.type === 'navigator' && <MapPin className="w-4 h-4" />}
                    {act.type === 'medicine' && <Pill className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-500">{act.subtitle}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Status Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-6 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>🔒 Your information is protected.</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              HealthBridge AI employs ephemeral memory processing. We do not store patient identities, sell laboratory data, or retain documents after your session ends.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero persistent report retention</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single-click document purging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>No diagnostic liabilities</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-200/60">
            <button
              onClick={() => onNavigate('privacy')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Open Privacy Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
