import React, { useState } from 'react';
import {
  Activity,
  FileText,
  MessageCircle,
  Pill,
  MapPin,
  Shield,
  Languages,
  Sparkles,
  BarChart3,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenPresentationDemo: () => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentLanguage,
  onLanguageChange,
  onOpenPresentationDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'report', label: 'Explain Report' },
    { id: 'chat', label: 'Health Assistant' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'navigator', label: 'Navigator' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'privacy', label: 'Privacy' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  HealthBridge
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-teal-500/10 text-teal-700 border border-teal-500/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-600 hidden sm:block tracking-tight font-medium">
                Simple • Accessible • Multilingual
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action controls (Language, Demo Switch, Presentation CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Presentation Demo Pill Button */}
            <button
              onClick={onOpenPresentationDemo}
              className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
              title="Launch guided presentation demo flow"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 animate-pulse" />
              <span>🎬 Presentation Demo</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-200">
                <Languages className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="hidden sm:inline">{selectedLangObj.native}</span>
                <span className="sm:hidden">{selectedLangObj.code.toUpperCase()}</span>
              </div>
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block hover:block z-50 animate-fade-in">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-100">
                  Select Language (8 Supported)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => onLanguageChange(l.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-teal-50/80 transition-colors cursor-pointer ${
                        currentLanguage === l.code
                          ? 'text-teal-700 font-bold bg-teal-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{l.native}</span>
                      <span className="text-[11px] text-slate-600">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* System Status Indicator */}
            <div
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border bg-emerald-50/80 border-emerald-300 text-emerald-900"
              title="HealthBridge AI Engine: Online & Ready"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine: Online</span>
            </div>

            {/* Privacy indicator pill */}
            <div
              className="hidden xl:flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
              title="Your session information is protected and never stored publicly"
            >
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Protected</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine: Online & Ready</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Protected Session</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
