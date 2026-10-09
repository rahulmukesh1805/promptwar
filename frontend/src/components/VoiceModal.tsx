import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { speechService } from '../services/speechService';
import { apiClient } from '../services/api';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const [stage, setStage] = useState<'idle' | 'listening' | 'processing' | 'answering'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      speechService.stopSpeaking();
      setStage('idle');
      setTranscript('');
      setAnswer('');
      setErrorMessage(null);
      setIsSpeakingAudio(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    speechService.stopSpeaking();
    setIsSpeakingAudio(false);
    setErrorMessage(null);
    setTranscript('');
    setAnswer('');
    setStage('listening');

    speechService.startListening(
      currentLanguage,
      async (recognizedText) => {
        setTranscript(recognizedText);
        setStage('processing');

        try {
          const res = await apiClient.askChat(recognizedText, currentLanguage);
          setAnswer(res.reply);
          setStage('answering');

          // Read answer aloud automatically
          speechService.speak(
            res.reply,
            currentLanguage,
            0.95,
            () => setIsSpeakingAudio(true),
            () => setIsSpeakingAudio(false)
          );
        } catch (err) {
          setErrorMessage('Could not process voice query. Please try speaking again.');
          setStage('idle');
        }
      },
      (error) => {
        setErrorMessage(error);
        setStage('idle');
      },
      () => {
        // onEnd
      }
    );
  };

  const handleStopAudio = () => {
    speechService.stopSpeaking();
    setIsSpeakingAudio(false);
  };

  const handleReplayAudio = () => {
    if (!answer) return;
    speechService.speak(
      answer,
      currentLanguage,
      0.95,
      () => setIsSpeakingAudio(true),
      () => setIsSpeakingAudio(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-teal-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close voice modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Language selector */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Voice Health Assistant
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ask with Your Voice</h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose your language, tap the microphone, and speak your health question.
          </p>

          {/* Language selector chips */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-h-24 overflow-y-auto">
            {LANGUAGE_OPTIONS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => onLanguageChange(l.code)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  currentLanguage === l.code
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {l.native} ({l.label})
              </button>
            ))}
          </div>
        </div>

        {/* Big Microphone button area */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative">
            {/* Pulsing ring when listening */}
            {stage === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-75 animate-ping" />
            )}
            {stage === 'processing' && (
              <div className="absolute inset-0 rounded-full bg-sky-400 opacity-60 animate-pulse" />
            )}

            <button
              type="button"
              onClick={stage === 'listening' ? () => setStage('idle') : handleStartListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                stage === 'listening'
                  ? 'bg-rose-500 text-white hover:bg-rose-600 ring-4 ring-rose-200'
                  : stage === 'processing'
                  ? 'bg-sky-600 text-white cursor-wait'
                  : 'bg-gradient-to-tr from-teal-600 to-sky-600 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {stage === 'listening' ? (
                <MicOff className="w-10 h-10 animate-bounce" />
              ) : stage === 'processing' ? (
                <RefreshCw className="w-10 h-10 animate-spin" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Dynamic status caption */}
          <p className="mt-4 text-sm font-semibold text-slate-700">
            {stage === 'idle' && 'Tap the microphone to speak'}
            {stage === 'listening' && 'Listening... Speak your question now'}
            {stage === 'processing' && 'HealthBridge AI is understanding your query...'}
            {stage === 'answering' && (isSpeakingAudio ? 'Speaking response...' : 'Answer ready')}
          </p>

          {/* Audio Waveform visualization */}
          {stage === 'listening' && (
            <div className="flex items-center gap-1 mt-3 h-8">
              {[40, 70, 100, 60, 90, 45, 80, 50, 95, 60, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-teal-500 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Spoken transcript & AI response box */}
        {(transcript || answer) && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left max-h-52 overflow-y-auto space-y-3">
            {transcript && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                  You Asked:
                </span>
                <p className="text-sm font-medium text-slate-900 italic">
                  "{transcript}"
                </p>
              </div>
            )}

            {answer && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    HealthBridge Explanation:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isSpeakingAudio ? (
                      <button
                        onClick={handleStopAudio}
                        className="text-xs px-2 py-0.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-md font-medium inline-flex items-center gap-1"
                      >
                        <MicOff className="w-3 h-3" /> Stop Voice
                      </button>
                    ) : (
                      <button
                        onClick={handleReplayAudio}
                        className="text-xs px-2 py-0.5 bg-teal-100 text-teal-800 hover:bg-teal-200 rounded-md font-medium inline-flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" /> Replay
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Educational safety disclaimer */}
        <p className="text-[10px] text-slate-400 text-center mt-4">
          HealthBridge AI provides educational information and does not replace medical consultation.
        </p>
      </div>
    </div>
  );
};
