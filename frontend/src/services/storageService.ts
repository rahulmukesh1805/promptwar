import { RecentActivityItem, SupportedLanguage } from '../types';

const ACTIVITIES_KEY = 'healthbridge_recent_activities';
const DEMO_MODE_KEY = 'healthbridge_demo_mode';
const LANGUAGE_KEY = 'healthbridge_language';

const INITIAL_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-1',
    type: 'report',
    title: 'Medical Report Explained',
    subtitle: 'Comprehensive Metabolic & Lipid Panel',
    timestamp: 'Today, 4:32 PM',
  },
  {
    id: 'act-2',
    type: 'question',
    title: 'Health Question',
    subtitle: 'What does HbA1c measure?',
    timestamp: 'Today, 3:15 PM',
  },
  {
    id: 'act-3',
    type: 'navigator',
    title: 'Healthcare Navigator',
    subtitle: 'Consulted for skin and rash guidance (Dermatologist)',
    timestamp: 'Yesterday, 6:10 PM',
  },
  {
    id: 'act-4',
    type: 'medicine',
    title: 'Medicine Information',
    subtitle: 'Paracetamol & Acetaminophen precautions',
    timestamp: 'Yesterday, 11:40 AM',
  },
];

export const storageService = {
  getRecentActivities(): RecentActivityItem[] {
    try {
      const stored = localStorage.getItem(ACTIVITIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_ACTIVITIES;
  },

  addActivity(item: Omit<RecentActivityItem, 'id' | 'timestamp'>) {
    try {
      const activities = this.getRecentActivities();
      const now = new Date();
      const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const newActivity: RecentActivityItem = {
        ...item,
        id: `act-${Date.now()}`,
        timestamp: timeStr,
      };
      const updated = [newActivity, ...activities.slice(0, 7)];
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Storage write error:', e);
      return INITIAL_ACTIVITIES;
    }
  },

  clearAllDocuments(): boolean {
    try {
      localStorage.removeItem(ACTIVITIES_KEY);
      sessionStorage.clear();
      return true;
    } catch (e) {
      console.warn('Clear documents error:', e);
      return false;
    }
  },

  isDemoMode(): boolean {
    const val = localStorage.getItem(DEMO_MODE_KEY);
    return val === null ? true : val === 'true';
  },

  setDemoMode(enabled: boolean) {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
  },

  getSavedLanguage(): SupportedLanguage {
    const lang = localStorage.getItem(LANGUAGE_KEY) as SupportedLanguage | null;
    return lang || 'en';
  },

  setSavedLanguage(lang: SupportedLanguage) {
    localStorage.setItem(LANGUAGE_KEY, lang);
  },
};
