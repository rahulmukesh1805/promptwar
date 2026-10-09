export type ComplexityLevel = 'me' | 'family' | 'elderly' | 'simple';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'bn' | 'mr';

export interface KeyTerm {
  term: string;
  pronunciation?: string;
  simple_explanation: string;
  category?: string;
}

export interface TestResultValue {
  test_name: string;
  result: string;
  reference_range: string;
  status: 'normal' | 'outside_range' | 'attention';
  status_label: string;
  explanation: string;
}

export interface DocumentSummary {
  tests_mentioned: string[];
  medicines_mentioned: string[];
  instructions_mentioned: string[];
  follow_up_recommendation: string;
}

export interface ReportExplanationResponse {
  report_id: string;
  patient_name: string;
  date_of_report: string;
  report_type_title?: string;
  lab_name?: string;
  raw_extracted_text?: string;
  is_fictional_demo: boolean;
  complexity: ComplexityLevel;
  language: SupportedLanguage;
  simple_summary: string;
  key_terms: KeyTerm[];
  test_values: TestResultValue[];
  questions_for_doctor: string[];
  document_summary: DocumentSummary;
  safety_disclaimer: string;
  is_urgent: boolean;
  urgent_warning?: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isUrgent?: boolean;
}

export interface ChatResponse {
  reply: string;
  suggested_questions: string[];
  safety_disclaimer: string;
  is_urgent: boolean;
  urgent_warning?: string | null;
}

export interface MedicineDetail {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  active_ingredients?: string[];
  common_uses: string[];
  general_precautions: string[];
  common_side_effects: string[];
  important_warnings: string[];
  when_to_consult_doctor: string[];
  educational_disclaimer: string;
}

export interface MedicineSafetyCheckResponse {
  has_conflict: boolean;
  conflict_type: string;
  title: string;
  description: string;
  shared_ingredients: string[];
  safety_recommendation: string;
}

export interface NavigatorResponse {
  specialty_name: string;
  specialty_description: string;
  common_conditions: string[];
  preparation_checklist: string[];
  questions_for_specialist: string[];
  urgency_level: 'routine' | 'priority' | 'emergency';
  emergency_warning?: string | null;
  safety_disclaimer: string;
}

export interface AnalyticsStats {
  documents_processed: number;
  questions_answered: number;
  languages_used: Record<string, number>;
  voice_interactions: number;
  avg_response_time_ms: number;
  is_demo_metrics: boolean;
}

export interface RecentActivityItem {
  id: string;
  type: 'report' | 'question' | 'navigator' | 'medicine';
  title: string;
  subtitle: string;
  timestamp: string;
}
