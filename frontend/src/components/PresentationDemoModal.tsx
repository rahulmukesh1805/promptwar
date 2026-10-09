import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Volume2,
  FileText,
  Languages,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';

interface PresentationDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFeature?: (page: string) => void;
}

interface DemoStep {
  step: number;
  title: string;
  badge: string;
  description: string;
  keyHighlight: string;
  previewType:
    | 'problem'
    | 'upload'
    | 'ocr'
    | 'explanation'
    | 'elderly'
    | 'kannada'
    | 'voice'
    | 'questions'
    | 'privacy'
    | 'safety';
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'The Problem: Medical Complexity & Language Barriers',
    badge: '1. Problem Statement',
    description:
      'Over 70% of patients in India cannot understand their diagnostic lab reports. Technical medical jargon creates panic, and critical information is almost always in English, excluding non-English speakers.',
    keyHighlight: 'AI for Healthcare Accessibility: Breaking jargon, language, and accessibility barriers.',
    previewType: 'problem',
  },
  {
    step: 2,
    title: 'Instant Document Intake (Drag & Drop or Demo Sample)',
    badge: '2. Document Upload',
    description:
      'Users upload blood tests, lipid profiles, or pathology PDFs/photos with one click. HealthBridge accepts PDF, JPG, and PNG files while ensuring strict data privacy.',
    keyHighlight: 'Zero complicated setup: instantly loads verified clinical medical reports.',
    previewType: 'upload',
  },
  {
    step: 3,
    title: '5-Step Intelligent Medical OCR & Extraction Pipeline',
    badge: '3. OCR Processing',
    description:
      'HealthBridge passes the document through an automated pipeline: Upload -> OCR extraction -> Medical terminology indexing -> Layperson simplification -> Multilingual generation.',
    keyHighlight: 'Extensible OCR interface ready for Tesseract or Cloud Vision integration.',
    previewType: 'ocr',
  },
  {
    step: 4,
    title: 'AI Explanation: Clear, Jargon-Free Summary',
    badge: '4. AI Explanation',
    description:
      'Instead of alarming patients, HealthBridge AI distills numerical ranges into a calm, educational summary highlighting fasting sugar, cholesterol, and normal organ markers.',
    keyHighlight: 'Non-diagnostic framing: helps patients understand without making medical claims.',
    previewType: 'explanation',
  },
  {
    step: 5,
    title: '"Explain Like..." Mode: Elderly & Plain Language',
    badge: '5. Adaptive Complexity',
    description:
      'Users can switch between 4 understanding modes: 🧑 Me, 👨‍👩‍👧 Family, 👴 Elderly, and 🧒 Simple. Elderly mode introduces larger fonts, calm short sentences, and instant voice triggers.',
    keyHighlight: 'Dynamic font scaling & cognitive accessibility for senior citizens.',
    previewType: 'elderly',
  },
  {
    step: 6,
    title: 'Multilingual Reach: Instant Kannada & Indian Languages',
    badge: '6. Regional Languages',
    description:
      'HealthBridge supports 8 Indian languages (Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali, Marathi, English). Medical concepts are communicated in native scripts accurately.',
    keyHighlight: '"ನಿಮ್ಮ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ..."',
    previewType: 'kannada',
  },
  {
    step: 7,
    title: 'Browser Speech Integration: Voice Reading & Listening',
    badge: '7. Voice Accessibility',
    description:
      'HealthBridge uses the browser Web Speech API for zero-installation text-to-speech and speech-to-text. Patients who cannot read or see clearly can listen to reports comfortably.',
    keyHighlight: 'Tap the audio button below to hear this report read aloud right now!',
    previewType: 'voice',
  },
  {
    step: 8,
    title: 'Doctor Consultation Preparation: Smart Questions',
    badge: '8. Actionable Questions',
    description:
      'Rather than self-diagnosing, HealthBridge prepares patients for productive doctor appointments by generating 4 high-value questions tailored to their report.',
    keyHighlight: 'Empowers patients to have meaningful, informed discussions with physicians.',
    previewType: 'questions',
  },
  {
    step: 9,
    title: 'Privacy Center: Ephemeral Storage & Instant Deletion',
    badge: '9. Privacy by Design',
    description:
      'Medical data is sensitive. HealthBridge uses session-based processing, zero public sharing, and features a prominent "Delete My Documents" button that purges all traces.',
    keyHighlight: 'Honest privacy guarantees with user-controlled data erasure.',
    previewType: 'privacy',
  },
  {
    step: 10,
    title: 'Safety Guardrails: AI Triage & Red-Flag Detection',
    badge: '10. Clinical Safety',
    description:
      'HealthBridge enforces strict safety rules: NEVER diagnoses ("You have diabetes"), avoids unverified dosage advice, and automatically triggers urgent emergency alerts for critical symptoms.',
    keyHighlight: 'Enterprise safety notice: Educational AI built responsibly for healthcare.',
    previewType: 'safety',
  },
];

export const PresentationDemoModal: React.FC<PresentationDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToFeature,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      speechService.stopSpeaking();
      setIsPlayingAudio(false);
      setIsAutoPlaying(false);
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  // Handle auto-advancing demo
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < DEMO_STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsAutoPlaying(false);
        try {
          confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStepIndex, isOpen]);

  if (!isOpen) return null;

  const step = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handlePlayVoice = (text: string, lang: 'en' | 'kn' = 'en') => {
    speechService.speak(
      text,
      lang,
      0.9,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              🎬 Hackathon Guided Tour
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Step {step.step} of {DEMO_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isAutoPlaying
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isAutoPlaying ? 'Pause Auto-Play' : 'Auto-Play Tour'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close presentation tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar dots */}
        <div className="flex gap-1.5 py-3">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                speechService.stopSpeaking();
                setIsPlayingAudio(false);
                setCurrentStepIndex(idx);
              }}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-teal-600 ring-2 ring-teal-200'
                  : idx < currentStepIndex
                  ? 'bg-teal-300'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Go to step ${s.step}: ${s.badge}`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
              {step.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {step.title}
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Interactive Feature Demo Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            {step.previewType === 'problem' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-xs">
                  <span className="text-2xl mb-1 block">🧠</span>
                  <p className="font-bold text-slate-800 text-sm">Extreme Jargon</p>
                  <p className="text-xs text-slate-500 mt-1">Medical reports read like complex clinical papers.</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-xs">
                  <span className="text-2xl mb-1 block">🌐</span>
                  <p className="font-bold text-slate-800 text-sm">Language Barrier</p>
                  <p className="text-xs text-slate-500 mt-1">Reports are in English; 90% of India speaks regional languages.</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-xs">
                  <span className="text-2xl mb-1 block">♿</span>
                  <p className="font-bold text-slate-800 text-sm">Accessibility Gap</p>
                  <p className="text-xs text-slate-500 mt-1">Elderly patients struggle with small prints & technical data.</p>
                </div>
              </div>
            )}

            {step.previewType === 'upload' && (
              <div className="bg-white p-4 rounded-xl border border-dashed border-teal-300 text-center">
                <FileText className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">Comprehensive Clinical Blood Test Report</p>
                <p className="text-xs text-slate-500 mt-1">Metabolic & Lipid Profile • 11 Parameters • Metropolis Diagnostics</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for one-click instant intake
                </div>
              </div>
            )}

            {step.previewType === 'ocr' && (
              <div className="space-y-2 text-xs">
                {[
                  '1. Uploading verified clinical report...',
                  '2. Extracting text via OCR pipeline (11 tests found)...',
                  '3. Understanding medical terms (HbA1c, LDL, Creatinine)...',
                  '4. Creating simple layperson explanation...',
                  '5. Generating multilingual representations (8 Indian languages)...',
                ].map((txt, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{txt}</span>
                  </div>
                ))}
              </div>
            )}

            {step.previewType === 'explanation' && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-teal-700 uppercase">Simplified Summary</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  "Your report contains information about blood sugar, cholesterol, and hemoglobin. Some values for
                  fasting sugar and cholesterol are outside the usual reference ranges. Your kidney, liver, and blood count
                  indicators appear within standard parameters. Please discuss these results with your doctor."
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">FBS: 138 mg/dL</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">HbA1c: 7.2%</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">Cholesterol: 228 mg/dL</span>
                </div>
              </div>
            )}

            {step.previewType === 'elderly' && (
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">👴 Elderly Friendly Mode</span>
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                    18px Typography
                  </span>
                </div>
                <p className="text-base text-slate-800 leading-relaxed font-medium">
                  "Your blood test looks mostly steady. Two numbers—sugar and cholesterol—are slightly higher than the usual
                  benchmark. There is no need to worry. Please show this report to your doctor at your next appointment."
                </p>
              </div>
            )}

            {step.previewType === 'kannada' && (
              <div className="bg-white p-4 rounded-xl border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> ಕನ್ನಡ (Kannada Translation)
                  </span>
                  <button
                    onClick={() =>
                      handlePlayVoice(
                        'ನಿಮ್ಮ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ, ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಉಪವಾಸದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಿತ ಮಿತಿಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿವೆ.',
                        'kn'
                      )
                    }
                    className="text-xs px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg font-medium inline-flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> ಧ್ವನಿ ಆಲಿಸಿ (Listen)
                  </button>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  "ನಿಮ್ಮ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ (ಗ್ಲೂಕೋಸ್), ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಉಪವಾಸದ
                  ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಿತ ಮಿತಿಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿವೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ."
                </p>
              </div>
            )}

            {step.previewType === 'voice' && (
              <div className="bg-white p-4 rounded-xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Browser Text-to-Speech Engine</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Utilizes HTML5 SpeechSynthesis with natural cadences for accessibility.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handlePlayVoice(
                      'Your report contains information about blood sugar and cholesterol. Please discuss the results with your doctor.',
                      'en'
                    )
                  }
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  {isPlayingAudio ? 'Playing Speech...' : 'Test Voice Audio'}
                </button>
              </div>
            )}

            {step.previewType === 'questions' && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">4 Auto-Generated Questions for Doctor:</p>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-5">
                  <li>"What do these fasting blood sugar and HbA1c levels mean for me?"</li>
                  <li>"Do I need to repeat this lipid profile test after a specific period?"</li>
                  <li>"Are there dietary or physical activity changes I should begin making?"</li>
                  <li>"Should we monitor my blood pressure and weight regularly?"</li>
                </ul>
              </div>
            )}

            {step.previewType === 'privacy' && (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 text-sm">Zero Persistent Storage Guarantee</p>
                  <p className="text-slate-600 mt-1">
                    Uploaded documents are processed ephemerally in session memory. No public sharing, no training on user
                    health data, and instant single-click document destruction.
                  </p>
                </div>
              </div>
            )}

            {step.previewType === 'safety' && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-rose-950 text-sm">Hardcoded Clinical Guardrails</p>
                  <p className="text-rose-800 mt-1">
                    1. Replaces diagnostic claims ("You have diabetes") with safe educational descriptions.<br />
                    2. Emergency triage trigger for red flags (chest pain, respiratory distress).<br />
                    3. No personalized drug dosing or prescription recommendations.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-teal-800">✨ Key Hackathon Highlight:</span>
              <span className="font-semibold text-slate-700">{step.keyHighlight}</span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex === DEMO_STEPS.length - 1 ? (
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToFeature) onNavigateToFeature('report');
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
              >
                Try Medical Explainer Now <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
