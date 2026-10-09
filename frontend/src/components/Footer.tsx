import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, Globe2, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">HealthBridge AI</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Making healthcare information simple, accessible, and multilingual across India.
              A purpose-built AI platform bridging the gap between clinical reports and patients.
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-xs pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Clinical Safety Guardrails
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Ephemeral Data Storage
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explain Medical Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Health AI Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('medicines')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Medicine Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('navigator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Healthcare Navigator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  System Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-teal-400" /> 8 Indian Languages
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
              English • ಕನ್ನಡ (Kannada) • हिन्दी (Hindi) • தமிழ் (Tamil) • తెలుగు (Telugu) • മലയാളം (Malayalam) • বাংলা (Bengali) • मराठी (Marathi)
            </p>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <span className="text-amber-300 font-medium">Hackathon Prototype:</span> College innovation submission for
              "AI for Healthcare Accessibility".
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-slate-500 max-w-2xl">
            Disclaimer: HealthBridge AI is an educational tool and does not provide clinical diagnoses, medical treatment,
            or prescription instructions. Always consult a licensed healthcare professional for medical concerns.
          </p>
          <p className="text-[11px] text-slate-500 shrink-0">
            © {new Date().getFullYear()} HealthBridge AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
