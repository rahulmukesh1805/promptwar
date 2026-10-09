import React, { useState } from 'react';
import {
  FileText,
  MessageCircle,
  Pill,
  MapPin,
  Mic,
  Languages,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Volume2,
  Lock,
  HeartPulse,
  Brain,
  Globe,
  Accessibility,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenPresentationDemo: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenPresentationDemo,
  currentLanguage,
  onLanguageChange,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Does HealthBridge diagnose diseases?',
      a: 'No. HealthBridge strictly provides educational information and simplifies complex laboratory terminology. It never issues diagnoses, modifies prescriptions, or recommends medication dosages. Users are always encouraged to consult qualified healthcare professionals.',
    },
    {
      q: 'Can I upload a medical report?',
      a: 'Yes. You can upload diagnostic lab reports in PDF, JPG, or PNG formats, or test our verified clinical sample reports. HealthBridge extracts parameters and translates technical laboratory jargon into plain, everyday language.',
    },
    {
      q: 'Which languages are supported?',
      a: 'HealthBridge AI supports 8 Indian languages: English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Malayalam (മലയാളം), Bengali (বাংলা), and Marathi (मराठी).',
    },
    {
      q: 'Does it work with voice?',
      a: 'Yes! HealthBridge utilizes the browser Web Speech API for both voice queries (speech-to-text) and audio explanations (text-to-speech), enabling elderly patients or individuals with low literacy to listen easily.',
    },
    {
      q: 'How is my private health information handled?',
      a: 'Privacy by design: HealthBridge processes files ephemerally during your active session. No medical documents are saved permanently or used for public AI training, and you can purge your session data anytime with one click in the Privacy Center.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        {/* Soft decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-50/70 via-sky-50/30 to-transparent -z-10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>AI for Healthcare Accessibility • Hackathon Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Healthcare information, <br />
            <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-sky-600 bg-clip-text text-transparent">
              made simple.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Understand medical information, access trusted health education, and communicate in your preferred language — safely.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('report')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <FileText className="w-5 h-5" />
              <span>Explain My Report</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm sm:text-base shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-5 h-5 text-teal-600" />
              <span>Ask Health AI</span>
            </button>

            <button
              onClick={onOpenPresentationDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>🎬 Presentation Demo</span>
            </button>
          </div>

          {/* Reusable safety notice */}
          <div className="mt-8 max-w-xl mx-auto">
            <MedicalSafetyNotice compact />
          </div>
        </div>
      </section>

      {/* Breaking 3 Barriers Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Our Purpose
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Breaking 3 Critical Barriers
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Clinical reports shouldn't require a medical degree or fluent English to understand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">🧠 Complexity Barrier</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Medical reports are filled with Latin abbreviations, reference intervals, and technical jargon that cause confusion and panic. HealthBridge translates values into plain, educational language.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">🌐 Language Barrier</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Diagnostic reports across India are printed almost exclusively in English. HealthBridge makes health insights accessible in 8 Indian regional languages including Kannada, Hindi, and Tamil.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Accessibility className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">♿ Accessibility Barrier</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Elderly patients and individuals with low visual or reading literacy struggle with tiny print. We introduce high-contrast large fonts and zero-friction browser text-to-speech.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (01 - 06 Steps) */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              User Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How HealthBridge Works
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
              A 6-step guided bridge from confusing paperwork to confident healthcare decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              {
                step: '01',
                title: 'Upload / Ask',
                desc: 'Upload a report or type a health question.',
              },
              {
                step: '02',
                title: 'AI Understands',
                desc: 'OCR extracts tests, units, and ranges.',
              },
              {
                step: '03',
                title: 'Simplifies',
                desc: 'Jargon is converted to everyday words.',
              },
              {
                step: '04',
                title: 'Translates',
                desc: 'Converts into your mother tongue.',
              },
              {
                step: '05',
                title: 'Speaks',
                desc: 'Listens via browser text-to-speech.',
              },
              {
                step: '06',
                title: 'Guides',
                desc: 'Prepares smart questions for your doctor.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center flex flex-col items-center"
              >
                <span className="text-xs font-extrabold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full mb-2">
                  {s.step}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{s.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Showcase Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Multilingual By Design
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical answers in the languages spoken across India
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select any regional language to experience verified clinical explanations formatted for high comprehension.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {[
                { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
                { code: 'hi', name: 'हिन्दी (Hindi)' },
                { code: 'ta', name: 'தமிழ் (Tamil)' },
                { code: 'te', name: 'తెలుగు (Telugu)' },
                { code: 'ml', name: 'മലയാളം (Malayalam)' },
                { code: 'bn', name: 'বাংলা (Bengali)' },
                { code: 'mr', name: 'मराठी (Marathi)' },
                { code: 'en', name: 'English' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code as SupportedLanguage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentLanguage === l.code
                      ? 'bg-teal-400 text-slate-950 shadow-md font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs sm:text-sm text-teal-100">
              <span className="font-bold text-white block mb-1">Live Preview ({currentLanguage.toUpperCase()}):</span>
              {currentLanguage === 'kn' && 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಎಂದರೇನು? (What is hypertension?) — ನಿಮ್ಮ ರಕ್ತನಾಳಗಳ ಗೋಡೆಗಳ ಮೇಲೆ ರಕ್ತವು ಉಂಟುಮಾಡುವ ಒತ್ತಡ ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಾದಾಗ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಎನ್ನುತ್ತಾರೆ.'}
              {currentLanguage === 'hi' && 'उच्च रक्तचाप क्या है? (What is hypertension?) — जब रक्त वाहिकाओं में रक्त का दबाव सामान्य से अधिक हो जाता है, तो इसे उच्च रक्तचाप कहा जाता है।'}
              {currentLanguage === 'ta' && 'உயர் இரத்த அழுத்தம் என்றால் என்ன? — இரத்தக் குழாய்களில் இரத்தத்தின் அழுத்தம் இயல்பான அளவை விட அதிகமாக இருக்கும் நிலை.'}
              {currentLanguage === 'te' && 'అధిక రక్తపోటు అంటే ఏమిటి? — రక్త నాళాల గోడలపై రక్త పీడనం సాధారణ స్థాయి కంటే ఎక్కువగా ఉన్నప్పుడు అధిక రక్తపోటు అంటారు.'}
              {currentLanguage === 'ml' && 'ഉയർന്ന രക്തസമ്മർദ്ദം എന്നാൽ എന്താണ്? — രക്തക്കുഴലുകളിൽ രക്തത്തിന്റെ മർദ്ദം സാധാരണയേക്കാൾ കൂടുമ്പോഴാണ് ഇത് സംഭവിക്കുന്നത്.'}
              {currentLanguage === 'bn' && 'উচ্চ রক্তচাপ কী? — রক্তনালীর প্রাচীরে রক্তের চাপ স্বাভাবিকের চেয়ে বেশি হলে তাকে উচ্চ রক্তচাপ বলে।'}
              {currentLanguage === 'mr' && 'उच्च रक्तदाब म्हणजे काय? — जेव्हा रक्तवाहिन्यांच्या भिंतींवर रक्ताचा दाब सामान्य मर्यादेपेक्षा जास्त असतो.'}
              {currentLanguage === 'en' && 'What is hypertension? — Hypertension occurs when the pressure of blood flowing against the walls of your arteries is consistently higher than normal.'}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm sm:text-base font-semibold text-slate-900 hover:text-teal-700 cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
