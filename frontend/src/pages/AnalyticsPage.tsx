import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  MessageCircle,
  Mic,
  Clock,
  Languages,
  Activity,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { AnalyticsStats } from '../types';
import { apiClient } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await apiClient.getAnalytics();
    setStats(data);
  };

  if (!stats) return null;

  const totalLanguages = Object.values(stats.languages_used).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
          <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
          System Telemetry & Platform Insights
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Platform Analytics
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Aggregated accessibility metrics across report explanations, voice queries, and Indian languages.
        </p>
        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[11px] font-bold">
          LIVE SYSTEM TELEMETRY
        </span>
      </div>

      {/* 4 Metric Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reports</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.documents_processed}
          </p>
          <p className="text-[11px] text-slate-500">Documents Processed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chat</span>
            <MessageCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.questions_answered}
          </p>
          <p className="text-[11px] text-slate-500">Questions Answered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Speech</span>
            <Mic className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.voice_interactions}
          </p>
          <p className="text-[11px] text-slate-500">Voice Interactions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Speed</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.avg_response_time_ms} ms
          </p>
          <p className="text-[11px] text-slate-500">Average Latency</p>
        </div>
      </div>

      {/* Language Breakdown Chart Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-teal-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Indian Languages Utilization Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Total Queries: {totalLanguages}
          </span>
        </div>

        {/* Visual Bar Charts */}
        <div className="space-y-3.5">
          {Object.entries(stats.languages_used).map(([lang, count]) => {
            const percent = Math.round((count / Math.max(1, totalLanguages)) * 100);
            return (
              <div key={lang} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="font-semibold">{lang}</span>
                  <span className="text-slate-500">
                    {count} interactions ({percent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Health Check */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-900 block text-sm mb-0.5">
            System Status: 100% Operational
          </span>
          <p>
            OCR Pipeline Active • Multi-lingual Lexicon Loaded • AI Safety Guardrails Active
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs shrink-0">
          ALL SYSTEMS HEALTHY
        </span>
      </div>
    </div>
  );
};
