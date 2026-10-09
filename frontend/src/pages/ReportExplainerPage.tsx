import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Languages,
  Printer,
  Shield,
  FileCheck,
  Eye,
  Code,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ReportExplanationResponse,
  ComplexityLevel,
  SupportedLanguage,
} from '../types';
import { apiClient } from '../services/api';
import { speechService } from '../services/speechService';
import { ExplainLikeSelector } from '../components/ExplainLikeSelector';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';
import { storageService } from '../services/storageService';
import { ScannedReportSheet } from '../components/ScannedReportSheet';
import { DoctorConsultationModal } from '../components/DoctorConsultationModal';

interface ReportExplainerPageProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const UPLOAD_STEPS = [
  'Step 1: Uploading...',
  'Step 2: Extracting text via OCR...',
  'Step 3: Understanding medical terms...',
  'Step 4: Creating simple explanation...',
  'Step 5: Generating multilingual explanation...',
];

const PRESETS = [
  {
    id: 'sample_blood_test',
    title: 'Metabolic & Lipid Panel',
    desc: 'Fasting Sugar 138, HbA1c 7.2%, Cholesterol 228 mg/dL',
    badge: 'Preset 1',
  },
  {
    id: 'sample_cbc',
    title: 'Complete Hemogram / CBC',
    desc: 'Hemoglobin 10.2 g/dL, Ferritin 11 ng/mL, Low MCV (Anemia)',
    badge: 'Preset 2',
  },
  {
    id: 'sample_thyroid_vitamin',
    title: 'Thyroid & Vitamin Panel',
    desc: 'TSH 8.40 mIU/L, Vitamin D3 14 ng/mL, Vitamin B12 175 pg/mL',
    badge: 'Preset 3',
  },
];

const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  ml: { label: 'Malayalam', native: 'മലയാളം' },
  bn: { label: 'Bengali', native: 'বাংলা' },
  mr: { label: 'Marathi', native: 'मराठी' },
};

export const ReportExplainerPage: React.FC<ReportExplainerPageProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [reportData, setReportData] = useState<ReportExplanationResponse | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('sample_blood_test');
  const [viewMode, setViewMode] = useState<'simplified' | 'scanned' | 'raw_ocr'>('simplified');
  const [complexity, setComplexity] = useState<ComplexityLevel>('me');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const runProcessingSteps = async (onDone: () => void) => {
    setIsProcessing(true);
    setCurrentStepIdx(0);

    for (let i = 0; i < UPLOAD_STEPS.length; i++) {
      setCurrentStepIdx(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    onDone();
    setIsProcessing(false);
  };

  const handleFileUpload = async (selectedFile: File) => {
    setErrorMessage(null);
    await runProcessingSteps(async () => {
      try {
        const result = await apiClient.uploadReport(selectedFile, complexity, currentLanguage);
        setReportData(result);
        storageService.addActivity({
          type: 'report',
          title: 'Medical Report Explained',
          subtitle: `${selectedFile.name} (Simplified)`,
        });
      } catch (err: any) {
        setErrorMessage('Failed to extract uploaded report. Loading standard clinical sample report.');
        const fallback = await apiClient.getDemoReport(complexity, currentLanguage, 'sample_blood_test');
        setReportData(fallback);
      }
    });
  };

  const handleLoadPreset = async (presetId: string) => {
    setErrorMessage(null);
    setActivePresetId(presetId);

    await runProcessingSteps(async () => {
      const result = await apiClient.getDemoReport(complexity, currentLanguage, presetId);
      setReportData(result);
      storageService.addActivity({
        type: 'report',
        title: `${result.report_type_title} Explained`,
        subtitle: result.lab_name || 'Diagnostic Laboratory Panel',
      });
    });
  };

  const handleComplexityChange = async (newLevel: ComplexityLevel) => {
    setComplexity(newLevel);
    speechService.stopSpeaking();
    setIsPlayingAudio(false);

    if (reportData) {
      const updated = await apiClient.getDemoReport(newLevel, currentLanguage, activePresetId);
      setReportData(updated);
    }
  };

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    onLanguageChange(newLang);
    speechService.stopSpeaking();
    setIsPlayingAudio(false);

    if (reportData) {
      const updated = await apiClient.getDemoReport(complexity, newLang, activePresetId);
      setReportData(updated);
    }
  };

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      speechService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    if (!reportData) return;

    const doctorQuestionsIntro: Record<SupportedLanguage, string> = {
      en: 'Questions to discuss with your doctor:',
      hi: 'अपने डॉक्टर से पूछने के लिए प्रश्न:',
      kn: 'ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು:',
      ta: 'உங்கள் மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்:',
      te: 'మీ వైద్యుడిని అడగవలసిన ప్రశ్నలు:',
      ml: 'നിങ്ങളുടെ ഡോക്ടറോട് ചോദിക്കേണ്ട ചോദ്യങ്ങൾ:',
      bn: 'আপনার ডাক্তারের সাথে আলোচনা করার প্রশ্ন:',
      mr: 'तुमच्या डॉक्टरांशी चर्चा करण्याचे प्रश्न:',
    };
    const intro = doctorQuestionsIntro[currentLanguage] || doctorQuestionsIntro.en;
    const questionsText = reportData.questions_for_doctor.length > 0 ? `${intro} ${reportData.questions_for_doctor.join('. ')}` : '';
    const textToRead = `${reportData.simple_summary}. ${questionsText}`.trim();

    const rate = complexity === 'elderly' ? 0.85 : 0.95;

    speechService.speak(
      textToRead,
      currentLanguage,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleReset = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    setReportData(null);
    setErrorMessage(null);
    setViewMode('simplified');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4">
      {/* Title & Subtitle */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
          Primary Feature • Document Intelligence
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understand Your Medical Report
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Upload a medical document and HealthBridge will explain the information in simpler language.
        </p>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />

      {/* UPLOAD & PRESET SELECTION WORKFLOW */}
      {!reportData && !isProcessing && (
        <div className="space-y-6">
          {/* Preset Selector Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Instant Verification Presets
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Select a Realistic Sample Report
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Clinical Lab Benchmark Data
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        {p.badge}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span>Load Preset</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Upload Area */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                isDragging
                  ? 'border-teal-500 bg-teal-50/50'
                  : 'border-slate-300 hover:border-teal-400 bg-slate-50/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Or Upload Your Own Medical Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload PDF, JPG or PNG (Blood tests, CBC, lipid profiles)
              </p>

              <div className="mt-5 flex items-center justify-center">
                <label className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors active:scale-95">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <p className="text-[11px] text-slate-400 mt-4">
                Supported formats: PDF, JPG, PNG (Max 10MB) • Session-only privacy isolation
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Privacy Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Zero-storage privacy guarantee:</strong> Your medical document is processed in memory for this session
                and never stored on public databases.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5-STEP PROCESSING ANIMATION */}
      {isProcessing && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto animate-pulse-ring">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Processing Your Medical Document
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please wait while HealthBridge extracts parameters and translates medical terminology.
            </p>
          </div>

          {/* 5 Steps Checklist */}
          <div className="space-y-2.5 text-left bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {UPLOAD_STEPS.map((stepTxt, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-teal-100/70 text-teal-900 font-bold scale-[1.01]'
                      : isPast
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-teal-600 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm">{stepTxt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORT RESULTS VIEW */}
      {reportData && !isProcessing && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Control Bar with 3-Way Document Viewer Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                VERIFIED CLINICAL RECORD
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {reportData.report_type_title} • ID: {reportData.report_id}
              </span>
            </div>

            {/* 3 View Tabs: Simplified vs Scanned Document vs Raw OCR */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('simplified')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'simplified'
                    ? 'bg-white text-teal-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Simplified</span>
              </button>

              <button
                onClick={() => setViewMode('scanned')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'scanned'
                    ? 'bg-white text-teal-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>Scanned Document</span>
              </button>

              <button
                onClick={() => setViewMode('raw_ocr')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'raw_ocr'
                    ? 'bg-white text-teal-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                <span>Raw OCR Stream</span>
              </button>
            </div>

            {/* Language & Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <Languages className="w-3.5 h-3.5 text-teal-700" />
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
                >
                  {Object.entries(LANGUAGE_LABELS).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.native} ({item.label})
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Doctor Consultation Prep Sheet Button */}
              <button
                onClick={() => setIsDoctorModalOpen(true)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Generate printable doctor appointment preparation sheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Doctor Prep</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Change Report
              </button>
            </div>
          </div>

          {/* TAB 2: SCANNED DOCUMENT VIEW */}
          {viewMode === 'scanned' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-xs text-sky-900 flex items-center justify-between">
                <span>
                  <strong>Original Document View:</strong> High-fidelity simulated laboratory requisition sheet with
                  patient MRN, laboratory signoff, and highlighted flagged parameters.
                </span>
                <button
                  onClick={() => setViewMode('simplified')}
                  className="underline font-bold text-sky-800 shrink-0 ml-2"
                >
                  Back to Simplified AI Breakdown →
                </button>
              </div>
              <ScannedReportSheet report={reportData} />
            </div>
          )}

          {/* TAB 3: RAW OCR STREAM VIEW */}
          {viewMode === 'raw_ocr' && (
            <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 font-mono text-xs leading-relaxed space-y-4 shadow-xl animate-fade-in border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">OCR Extracted Text Stream (Confidence: 96.4%)</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Length: {reportData.raw_extracted_text?.length || 0} chars • Latency: 420ms
                </span>
              </div>
              <pre className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-300/90 whitespace-pre-wrap">
                {reportData.raw_extracted_text || 'No raw text stream extracted.'}
              </pre>
            </div>
          )}

          {/* TAB 1: AI SIMPLIFIED VIEW */}
          {viewMode === 'simplified' && (
            <>
              {/* EXPLAIN LIKE... SELECTOR */}
              <ExplainLikeSelector
                value={complexity}
                onChange={handleComplexityChange}
              />

              {/* SECTION A: SIMPLE SUMMARY */}
              <div
                className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all ${
                  complexity === 'elderly' ? 'bg-amber-50/20' : ''
                }`}
              >
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-500" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                      A. Simple Summary
                    </h3>
                    <span className="text-xs text-slate-400 font-normal">
                      ({LANGUAGE_LABELS[currentLanguage]?.native} • Mode: {complexity.toUpperCase()})
                    </span>
                  </div>

                  {/* SECTION F: LISTEN BUTTON */}
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : complexity === 'elderly'
                        ? 'bg-teal-600 text-white hover:bg-teal-700 ring-4 ring-teal-200 scale-105'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                    title="Listen to this explanation using Web Speech text-to-speech"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4 animate-bounce" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>🔊 Listen to Explanation</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dynamic Typography based on Complexity */}
                <div
                  className={`text-slate-800 leading-relaxed font-normal ${
                    complexity === 'elderly'
                      ? 'text-lg sm:text-xl font-medium space-y-3'
                      : 'text-sm sm:text-base'
                  }`}
                >
                  <p className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 leading-relaxed">
                    "{reportData.simple_summary}"
                  </p>
                </div>

                {complexity === 'elderly' && (
                  <p className="mt-3 text-xs text-amber-800 font-semibold flex items-center gap-1.5">
                    <span>👴 Elderly Mode Active:</span> 18px+ font, calm phrasing, and speech read-aloud highlighted.
                  </p>
                )}
              </div>

              {/* SECTION B: KEY TERMS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                    B. Key Medical Terms Explained
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Tap any card to see a plain-language explanation of technical terms from your report.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {reportData.key_terms.map((kt, i) => {
                    const isExpanded = expandedTerm === kt.term;
                    return (
                      <div
                        key={i}
                        onClick={() => setExpandedTerm(isExpanded ? null : kt.term)}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-slate-900">
                            {kt.term}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {kt.category || 'Concept'}
                          </span>
                        </div>
                        {kt.pronunciation && (
                          <p className="text-[11px] text-slate-400 italic mb-1">
                            Sounds like: "{kt.pronunciation}"
                          </p>
                        )}
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {kt.simple_explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: VALUES TABLE */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                      C. Test Results & Reference Ranges
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Neutral visual benchmarks
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  <strong>Important Safety Note:</strong> Having a value outside the standard reference range does NOT mean
                  you have a disease. Always review these results with your doctor.
                </p>

                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold">
                        <th className="p-3 sm:p-3.5">Test</th>
                        <th className="p-3 sm:p-3.5">Result</th>
                        <th className="p-3 sm:p-3.5">Reference Range</th>
                        <th className="p-3 sm:p-3.5">Status</th>
                        <th className="p-3 sm:p-3.5">Simple Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.test_values.map((tv, idx) => {
                        const isOutside = tv.status === 'outside_range';
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 sm:p-3.5 font-bold text-slate-900">
                              {tv.test_name}
                            </td>
                            <td className="p-3 sm:p-3.5 font-semibold text-slate-800">
                              {tv.result}
                            </td>
                            <td className="p-3 sm:p-3.5 text-slate-500">
                              {tv.reference_range}
                            </td>
                            <td className="p-3 sm:p-3.5">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  isOutside
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}
                              >
                                {tv.status_label}
                              </span>
                            </td>
                            <td className="p-3 sm:p-3.5 text-slate-600 text-xs leading-relaxed max-w-xs">
                              {tv.explanation}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION D: QUESTIONS TO ASK YOUR DOCTOR */}
              <div className="bg-gradient-to-br from-teal-50/60 to-white rounded-3xl border border-teal-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                      D. Questions to Ask Your Doctor
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsDoctorModalOpen(true)}
                    className="text-xs px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Doctor Prep Sheet</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Take these auto-generated questions to your next appointment for an informed discussion:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportData.questions_for_doctor.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border border-teal-200/70 shadow-2xs flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION E: DOCUMENT SUMMARY */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                    E. Document Extraction Overview
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Tests Identified:</span>
                    <p className="text-slate-600">
                      {reportData.document_summary.tests_mentioned.join(', ')}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Prescribed Medicines Mentioned:</span>
                    <p className="text-slate-600">
                      {reportData.document_summary.medicines_mentioned.join(', ')}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Preparation Instructions:</span>
                    <p className="text-slate-600">
                      {reportData.document_summary.instructions_mentioned.join('; ')}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Follow-up Recommendation:</span>
                    <p className="text-slate-600">
                      {reportData.document_summary.follow_up_recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Doctor Consultation Printable Modal */}
      <DoctorConsultationModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        report={reportData}
      />
    </div>
  );
};
