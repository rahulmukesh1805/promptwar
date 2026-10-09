import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Trash2,
  Sparkles,
  Check,
  Languages,
  Bot,
  User,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ChatMessage, SupportedLanguage } from '../types';
import { apiClient } from '../services/api';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

interface ChatAssistantPageProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const EXAMPLE_PROMPTS = [
  'What is blood pressure?',
  'What does HbA1c measure?',
  'What questions should I ask my doctor?',
  'What is a CBC blood test?',
  'What does cholesterol mean?',
];

export const ChatAssistantPage: React.FC<ChatAssistantPageProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am HealthBridge AI, your educational health assistant. Ask me anything about medical terms, lab tests, or questions to prepare for your doctor.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await apiClient.askChat(textToSend, currentLanguage, messages);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUrgent: response.is_urgent,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      storageService.addActivity({
        type: 'question',
        title: 'Health Question Answered',
        subtitle: textToSend.slice(0, 40) + '...',
      });
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'I am having trouble retrieving that medical information right now. Please try asking again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    speechService.startListening(
      currentLanguage,
      (recognizedText) => {
        setIsListening(false);
        setInput(recognizedText);
        handleSendMessage(recognizedText);
      },
      (error) => {
        setIsListening(false);
        console.warn('Speech error:', error);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingId === msgId) {
      speechService.stopSpeaking();
      setSpeakingId(null);
      return;
    }

    speechService.stopSpeaking();
    speechService.speak(
      text,
      currentLanguage,
      0.95,
      () => setSpeakingId(msgId),
      () => setSpeakingId(null)
    );
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    speechService.stopSpeaking();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Conversation cleared. Ask me any general healthcare or lab test question in simple language.',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-20 pt-4">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Bot className="w-3.5 h-3.5 text-teal-600" />
          HealthBridge AI Assistant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ask General Healthcare Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Educational medical answers without diagnostic claims or prescription advice.
        </p>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />

      {/* Example Prompt Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Try asking:</span>
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 px-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-300 transition-colors shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">AI Educational Assistant</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">• Web Speech & TTS Enabled</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all messages"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAsst ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isAsst ? 'bg-teal-600 shadow-2xs' : 'bg-slate-800 shadow-2xs'
                  }`}
                >
                  {isAsst ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAsst
                      ? msg.isUrgent
                        ? 'bg-rose-50 border border-rose-300 text-rose-950 shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                      : 'bg-teal-700 text-white shadow-xs'
                  }`}
                >
                  {msg.isUrgent && (
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1 text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Urgent Health Alert</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Assistant Footer: Copy, TTS, Disclaimer */}
                  {isAsst && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                      <span className="italic flex items-center gap-1">
                        <Info className="w-3 h-3 text-teal-600 shrink-0" />
                        HealthBridge provides educational information and does not replace medical advice.
                      </span>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          className={`p-1 rounded-md transition-colors ${
                            speakingId === msg.id
                              ? 'bg-rose-100 text-rose-700'
                              : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title="Read aloud with text-to-speech"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span>Thinking & reviewing safety guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Speak your question using microphone"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blood pressure, cholesterol, lab tests, or what to ask your doctor..."
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
