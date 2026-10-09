import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText, AlertTriangle, ShieldCheck, Calendar, User } from 'lucide-react';
import { ReportExplanationResponse } from '../types';

interface DoctorConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportExplanationResponse | null;
}

export const DoctorConsultationModal: React.FC<DoctorConsultationModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !report) return null;

  const flaggedValues = report.test_values.filter((v) => v.status === 'outside_range');

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
DOCTOR CONSULTATION SUMMARY - HEALTHBRIDGE AI
Patient: ${report.patient_name} | Date: ${report.date_of_report} | ID: ${report.report_id}
Report: ${report.report_type_title || 'Diagnostic Panel'}

1. SUMMARY OF FINDINGS:
${report.simple_summary}

2. FLAGGED VALUES TO DISCUSS WITH DOCTOR:
${flaggedValues.map((v) => `• ${v.test_name}: ${v.result} (Ref: ${v.reference_range})`).join('\n')}

3. QUESTIONS PREPARED FOR THE DOCTOR:
${report.questions_for_doctor.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Note: Prepared with HealthBridge AI for educational appointment consultation.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:p-4">
        {/* Top Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Doctor Consultation Sheet</h3>
              <p className="text-xs text-slate-500">Ready to print or bring to your clinical visit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed pr-1">
          {/* Document Header */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
              <span className="font-bold text-teal-900 text-base">HealthBridge AI • Patient Visit Slip</span>
              <span className="text-[11px] font-mono text-slate-500">Ref ID: {report.report_id}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Patient:</span>{' '}
                <strong className="text-slate-900">{report.patient_name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Date of Test:</span>{' '}
                <strong className="text-slate-900">{report.date_of_report}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Investigation:</span>{' '}
                <strong className="text-slate-900">{report.report_type_title || 'Blood Profile'}</strong>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Findings */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5 text-teal-800">
              1. Layperson Summary of Laboratory Findings:
            </h4>
            <p className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-slate-700">
              "{report.simple_summary}"
            </p>
          </div>

          {/* Section 2: Values Outside Usual Reference Ranges */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5 text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              2. Parameters to Review With Doctor ({flaggedValues.length}):
            </h4>
            <div className="space-y-1.5">
              {flaggedValues.map((v, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-900">{v.test_name}</span>
                  <div className="text-right">
                    <span className="font-bold text-amber-950 mr-2">{v.result}</span>
                    <span className="text-slate-500 text-[11px]">(Ref: {v.reference_range})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Questions to Ask */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1.5 text-teal-800">
              3. Suggested Questions for Consulting Physician:
            </h4>
            <ol className="space-y-1.5 list-decimal pl-5 text-slate-700">
              {report.questions_for_doctor.map((q, idx) => (
                <li key={idx} className="font-medium">
                  {q}
                </li>
              ))}
            </ol>
          </div>

          {/* Section 4: Patient Personal Notes Checklist */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">
              4. Patient Notes Checklist (Jot down before visit):
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-slate-300 inline-block shrink-0" />
                <span>Current medicines & vitamins I am taking daily: ______________________</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-slate-300 inline-block shrink-0" />
                <span>Symptoms felt & how many days they have lasted: ______________________</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-slate-300 inline-block shrink-0" />
                <span>Known allergies or previous adverse reactions: ________________________</span>
              </div>
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              HealthBridge AI provides educational discussion points and does not replace professional medical advice.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
