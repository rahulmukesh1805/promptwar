import { SupportedLanguage } from '../types';

// Language codes mapped to BCP 47 tags for speech recognition & synthesis
const LANG_BCP47: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

// Realistic query prompts for speech recognition demonstration
const VOICE_SUGGESTIONS: Record<SupportedLanguage, string> = {
  en: 'What does fasting blood sugar of 138 mean?',
  hi: 'फास्टिंग ब्लड शुगर 138 का क्या मतलब है?',
  kn: 'ಉಪವಾಸದ ರಕ್ತದ ಸಕ್ಕರೆ 138 ರ ಅರ್ಥವೇನು?',
  ta: 'இரத்த சர்க்கரை 138 என்றால் என்ன பொருள்?',
  te: 'బ్లడ్ షుగర్ 138 అంటే ఏమిటి?',
  ml: 'ഫാസ്റ്റിംഗ് ബ്ലഡ് ഷുഗർ 138 എന്നാൽ എന്താണ്?',
  bn: 'ফাস্টিং ব্লাড সুগার ১৩৮ এর অর্থ কী?',
  mr: 'फास्टिंग ब्लड शुगर १३८ चा काय अर्थ आहे?',
};

let activeAudioElement: HTMLAudioElement | null = null;

export const speechService = {
  isRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  },

  isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window);
  },

  startListening(
    lang: SupportedLanguage,
    onResult: (transcript: string) => void,
    onError: (errorMsg: string) => void,
    onEnd: () => void
  ): () => void {
    if (!this.isRecognitionSupported()) {
      // Simulate realistic speech transcription
      const timeout = setTimeout(() => {
        const query = VOICE_SUGGESTIONS[lang] || VOICE_SUGGESTIONS.en;
        onResult(query);
        onEnd();
      }, 2500);

      return () => clearTimeout(timeout);
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = LANG_BCP47[lang] || 'en-IN';

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const text = event.results[0][0].transcript;
          onResult(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone access was denied. Using simulated voice recognition instead.');
          setTimeout(() => {
            const query = VOICE_SUGGESTIONS[lang] || VOICE_SUGGESTIONS.en;
            onResult(query);
            onEnd();
          }, 1500);
        } else {
          onError(`Voice input error (${event.error}). Please type your query or try speaking again.`);
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return () => {
        try {
          recognition.abort();
        } catch (e) {
          // ignore abort errors
        }
      };
    } catch (err: any) {
      console.warn('Speech recognition start failed, using fallback:', err);
      const timeout = setTimeout(() => {
        onResult(VOICE_SUGGESTIONS[lang] || VOICE_SUGGESTIONS.en);
        onEnd();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  },

  /**
   * Robust multilingual speech synthesizer.
   * Prioritizes authentic regional language TTS (Tamil, Kannada, Hindi, Telugu, Malayalam, Bengali, Marathi)
   * so regional text is never mispronounced in English accents or muted.
   */
  speak(
    text: string,
    lang: SupportedLanguage = 'en',
    rate: number = 0.95,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    this.stopSpeaking();

    // Clean text to avoid reading bracketed notes, asterisks or code symbols
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return false;
    }

    const playNativeAudio = () => {
      try {
        const audioUrl = `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(cleanText)}`;
        const audio = new Audio(audioUrl);
        activeAudioElement = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          activeAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('TTS streaming endpoint failed:', e);
          activeAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.play().catch((playErr) => {
          console.warn('Audio play request failed or was interrupted:', playErr);
          activeAudioElement = null;
          if (onEnd) onEnd();
        });

        return true;
      } catch (err) {
        console.warn('Failed to initialize audio element for TTS:', err);
        if (onEnd) onEnd();
        return false;
      }
    };

    // If language is a regional Indian language (ta, kn, hi, te, ml, bn, mr):
    if (lang !== 'en') {
      const voices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      const langPrefix = lang.toLowerCase();
      
      // Look ONLY for genuine matching native language voices (e.g. 'ta', 'ta-IN', 'ta-LK')
      // NEVER match 'en-IN' or other English voices when a regional language is requested
      const nativeVoice = voices.find((v) => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === langPrefix || vLang.startsWith(`${langPrefix}-`);
      });

      if (nativeVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.voice = nativeVoice;
          utterance.lang = LANG_BCP47[lang] || `${lang}-IN`;
          utterance.rate = rate;
          utterance.pitch = 1.0;

          if (onStart) utterance.onstart = onStart;
          utterance.onend = () => {
            if (onEnd) onEnd();
          };
          utterance.onerror = (e) => {
            console.warn('Web Speech synthesis error, trying native audio stream:', e);
            playNativeAudio();
          };

          window.speechSynthesis.speak(utterance);
          return true;
        } catch (e) {
          return playNativeAudio();
        }
      } else {
        // No local native voice for this regional language is installed in OS/browser.
        // Stream authentic native audio from the backend TTS service!
        return playNativeAudio();
      }
    }

    // For English:
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const voices = window.speechSynthesis.getVoices();
        const enVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith('en-in')) ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        utterance.rate = rate;
        utterance.pitch = 1.0;

        if (enVoice) {
          utterance.voice = enVoice;
        }

        if (onStart) utterance.onstart = onStart;
        utterance.onend = () => {
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          playNativeAudio();
        };

        window.speechSynthesis.speak(utterance);
        return true;
      } catch (e) {
        return playNativeAudio();
      }
    }

    return playNativeAudio();
  },

  stopSpeaking() {
    // 1. Stop any streaming audio element
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
      } catch (e) {
        // ignore
      }
      activeAudioElement = null;
    }

    // 2. Stop Web Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  },
};
