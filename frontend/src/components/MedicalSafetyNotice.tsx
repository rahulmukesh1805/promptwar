import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface MedicalSafetyNoticeProps {
  isUrgent?: boolean;
  urgentMessage?: string | null;
  compact?: boolean;
  className?: string;
}

export const MedicalSafetyNotice: React.FC<MedicalSafetyNoticeProps> = ({
  isUrgent = false,
  urgentMessage,
  compact = false,
  className = '',
}) => {
  if (isUrgent) {
    return (
      <div
        className={`bg-rose-50 border-2 border-rose-400 rounded-xl p-4 text-rose-900 shadow-sm flex items-start gap-3.5 transition-all ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="p-2 bg-rose-100 rounded-lg shrink-0 text-rose-600">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-rose-950 text-base mb-1">
            Urgent Medical Attention Notice
          </p>
          <p className="text-rose-800 leading-relaxed font-medium">
            {urgentMessage ||
              'This information may require urgent professional attention. Contact local emergency services or a qualified healthcare professional immediately.'}
          </p>
          <p className="text-xs text-rose-700/90 mt-2 font-normal">
            Do not delay seeking medical care based on AI or online information. HealthBridge does not provide emergency intervention.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-slate-500 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200/80 ${className}`}>
        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        <span>HealthBridge AI provides educational information and does not replace a qualified healthcare professional.</span>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-teal-50/70 via-sky-50/50 to-slate-50 border border-teal-200/70 rounded-xl p-3.5 text-slate-700 text-xs sm:text-sm flex items-start gap-3 shadow-xs ${className}`}
    >
      <div className="p-1.5 bg-teal-100/80 text-teal-700 rounded-md shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div>
        <span className="font-semibold text-slate-900 mr-1.5">Educational Medical Disclaimer:</span>
        <span className="text-slate-600 leading-relaxed">
          HealthBridge AI provides educational information and does not replace a qualified healthcare professional.
          Never disregard professional medical advice or delay in seeking it because of something you have read here.
        </span>
      </div>
    </div>
  );
};
