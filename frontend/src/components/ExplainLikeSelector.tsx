import React from 'react';
import { ComplexityLevel } from '../types';
import { Sparkles, User, Users, HeartHandshake, Baby } from 'lucide-react';

interface ExplainLikeSelectorProps {
  value: ComplexityLevel;
  onChange: (level: ComplexityLevel) => void;
  className?: string;
}

export const ExplainLikeSelector: React.FC<ExplainLikeSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const options: { id: ComplexityLevel; label: string; icon: string; desc: string }[] = [
    {
      id: 'me',
      label: 'Me',
      icon: '🧑',
      desc: 'Balanced, clear overview for yourself',
    },
    {
      id: 'family',
      label: 'Family',
      icon: '👨‍👩‍👧',
      desc: 'Actionable summary for helping a loved one',
    },
    {
      id: 'elderly',
      label: 'Elderly',
      icon: '👴',
      desc: 'Gentle, larger text, calm pace & audio emphasis',
    },
    {
      id: 'simple',
      label: 'Simple',
      icon: '🧒',
      desc: 'Plain everyday words, zero medical jargon',
    },
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Explain Like... Mode
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Adapts vocabulary & reading complexity
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                  : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 w-full">
                <span className="text-lg">{opt.icon}</span>
                <span className={`font-semibold text-sm ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-teal-500" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {opt.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
