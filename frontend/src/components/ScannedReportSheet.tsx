import React from 'react';
import { FileText, ShieldAlert, Award, QrCode, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { ReportExplanationResponse } from '../types';

interface ScannedReportSheetProps {
  report: ReportExplanationResponse;
}

export const ScannedReportSheet: React.FC<ScannedReportSheetProps> = ({ report }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-lg p-6 sm:p-10 font-mono text-slate-800 text-xs sm:text-sm max-w-4xl mx-auto relative overflow-hidden select-text">
      {/* Visual Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
        <span className="text-7xl sm:text-9xl font-black text-slate-900 rotate-[-25deg] tracking-widest uppercase">
          CLINICAL REPORT
        </span>
      </div>

      {/* Lab Letterhead Header */}
      <div className="border-b-2 border-slate-800 pb-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-800">
            <Award className="w-6 h-6 text-teal-700" />
            <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase font-sans">
              {report.lab_name || 'Metropolis Research & Diagnostic Lab'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
            NABL Accredited Medical Testing Facility • ISO 15189:2012 Certified
          </p>
          <p className="text-[10px] text-slate-400 font-sans">
            Diagnostic Requisition Slip #BLR-{report.report_id.replace('DEMO-RPT-', '')}
          </p>
        </div>

        {/* Barcode & Verification Badge */}
        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0">
          <div className="bg-slate-900 text-white font-mono px-3 py-1 text-xs tracking-widest rounded uppercase">
            *{report.report_id}*
          </div>
          <span className="text-[10px] text-emerald-700 font-bold font-sans mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Electronic Verification Valid
          </span>
        </div>
      </div>

      {/* Patient & Specimen Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 font-sans text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name:</span>
          <span className="font-bold text-slate-900">{report.patient_name}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender:</span>
          <span className="font-semibold text-slate-800">48 Yrs / Male</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Report Date:</span>
          <span className="font-semibold text-slate-800">{report.date_of_report}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Sample Type:</span>
          <span className="font-semibold text-slate-800">Venous Whole Blood</span>
        </div>
      </div>

      {/* Report Title */}
      <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-200 mb-6 font-sans font-black tracking-wide uppercase text-slate-800 text-xs sm:text-sm">
        {report.report_type_title || 'Comprehensive Diagnostic Laboratory Panel'}
      </div>

      {/* Clinical Values Table with Yellow Highlights on Out-of-Range parameters */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-slate-700 font-bold text-slate-800">
              <th className="py-2 px-2">Investigation / Test</th>
              <th className="py-2 px-2 text-right">Observed Value</th>
              <th className="py-2 px-2 text-center">Units</th>
              <th className="py-2 px-2 text-right">Reference Range</th>
              <th className="py-2 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {report.test_values.map((tv, idx) => {
              const isOut = tv.status === 'outside_range';
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isOut ? 'bg-amber-100/70 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 font-medium flex items-center gap-1.5">
                    {isOut && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"
                        title="Value outside reference interval"
                      />
                    )}
                    <span>{tv.test_name}</span>
                  </td>
                  <td
                    className={`py-2.5 px-2 text-right font-mono font-bold ${
                      isOut ? 'text-amber-950 underline decoration-amber-500' : 'text-slate-900'
                    }`}
                  >
                    {tv.result}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-500 font-sans">
                    {tv.result.split(' ')[1] || 'std'}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-600 font-mono">
                    {tv.reference_range}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">
                        FLAGGED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        NORMAL
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lab Impression & Physician Signoff Box */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs space-y-2 mb-6">
        <span className="font-bold text-slate-900 uppercase text-[11px] block">
          Clinical Laboratory Impression:
        </span>
        <p className="text-slate-600 leading-relaxed">
          Values marked with <strong>FLAGGED</strong> indicate parameters outside listed statistical reference benchmarks.
          Clinical correlation with patient history, dietary intake, and physical examination is advised.
        </p>
      </div>

      {/* Footer Signatures */}
      <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 font-sans gap-3">
        <div>
          <p className="font-semibold text-slate-800">Dr. K. Srinivas, MD (Pathology)</p>
          <p className="text-[10px] text-slate-400">Chief Clinical Pathologist & Lab Director</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-slate-700">*** END OF REPORT ***</p>
          <p className="text-[10px] text-slate-400">Computer Generated Clinical Laboratory Requisition</p>
        </div>
      </div>
    </div>
  );
};
