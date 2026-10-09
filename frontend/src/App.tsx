import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceModal } from './components/VoiceModal';
import { PresentationDemoModal } from './components/PresentationDemoModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportExplainerPage } from './pages/ReportExplainerPage';
import { ChatAssistantPage } from './pages/ChatAssistantPage';
import { MedicinePage } from './pages/MedicinePage';
import { NavigatorPage } from './pages/NavigatorPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isPresentationDemoOpen, setIsPresentationDemoOpen] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentLanguage(storageService.getSavedLanguage());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    storageService.setSavedLanguage(lang);
    showToast(`Language switched to ${lang.toUpperCase()}`);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 selection:text-teal-900">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-bounce flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenPresentationDemo={() => setIsPresentationDemoOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenPresentationDemo={() => setIsPresentationDemoOpen(true)}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onOpenPresentationDemo={() => setIsPresentationDemoOpen(true)}
          />
        )}

        {currentPage === 'report' && (
          <ReportExplainerPage
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {currentPage === 'chat' && (
          <ChatAssistantPage
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {currentPage === 'medicines' && <MedicinePage />}

        {currentPage === 'navigator' && (
          <NavigatorPage currentLanguage={currentLanguage} />
        )}

        {currentPage === 'privacy' && <PrivacyPage />}

        {currentPage === 'analytics' && <AnalyticsPage />}
      </main>

      {/* Modern Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Voice Modal (Microphone + STT + TTS) */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Hackathon Presentation Demo Modal (10-Step Guided Presentation Flow) */}
      <PresentationDemoModal
        isOpen={isPresentationDemoOpen}
        onClose={() => setIsPresentationDemoOpen(false)}
        onNavigateToFeature={handleNavigate}
      />
    </div>
  );
}

export default App;
