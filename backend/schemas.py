from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class ComplexityLevel(str, Enum):
    ME = "me"
    FAMILY = "family"
    ELDERLY = "elderly"
    SIMPLE = "simple"

class SupportedLanguage(str, Enum):
    EN = "en"
    HI = "hi"
    KN = "kn"
    TA = "ta"
    TE = "te"
    ML = "ml"
    BN = "bn"
    MR = "mr"

class KeyTerm(BaseModel):
    term: str
    pronunciation: Optional[str] = None
    simple_explanation: str
    category: Optional[str] = "General"

class TestResultValue(BaseModel):
    test_name: str
    result: str
    reference_range: str
    status: str  # "normal", "outside_range", "attention"
    status_label: str  # "Within usual range", "Outside listed reference range", "Discuss with doctor"
    explanation: str

class DocumentSummary(BaseModel):
    tests_mentioned: List[str]
    medicines_mentioned: List[str]
    instructions_mentioned: List[str]
    follow_up_recommendation: str

class ReportExplanationResponse(BaseModel):
    report_id: str
    patient_name: str
    date_of_report: str
    report_type_title: str = "Diagnostic Laboratory Report"
    lab_name: str = "Metropolis Research & Diagnostic Lab"
    is_fictional_demo: bool = True
    complexity: ComplexityLevel
    language: SupportedLanguage
    raw_extracted_text: Optional[str] = None
    simple_summary: str
    key_terms: List[KeyTerm]
    test_values: List[TestResultValue]
    questions_for_doctor: List[str]
    document_summary: DocumentSummary
    safety_disclaimer: str
    is_urgent: bool = False
    urgent_warning: Optional[str] = None

class ExplainReportRequest(BaseModel):
    document_text: Optional[str] = None
    complexity: ComplexityLevel = ComplexityLevel.ME
    language: SupportedLanguage = SupportedLanguage.EN
    sample_id: Optional[str] = "sample_blood_test"

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    language: SupportedLanguage = SupportedLanguage.EN

class ChatResponse(BaseModel):
    reply: str
    suggested_questions: List[str] = []
    safety_disclaimer: str
    is_urgent: bool = False
    urgent_warning: Optional[str] = None

class MedicineDetail(BaseModel):
    id: str
    name: str
    generic_name: str
    category: str
    active_ingredients: List[str] = []
    common_uses: List[str]
    general_precautions: List[str]
    common_side_effects: List[str]
    important_warnings: List[str]
    when_to_consult_doctor: List[str]
    educational_disclaimer: str

class MedicineSafetyCheckRequest(BaseModel):
    medicine_ids: List[str]

class MedicineSafetyCheckResponse(BaseModel):
    has_conflict: bool
    conflict_type: str  # "none", "duplicate_ingredient", "interaction_caution"
    title: str
    description: str
    shared_ingredients: List[str] = []
    safety_recommendation: str

class NavigatorRequest(BaseModel):
    query: str
    language: SupportedLanguage = SupportedLanguage.EN

class NavigatorResponse(BaseModel):
    specialty_name: str
    specialty_description: str
    common_conditions: List[str]
    preparation_checklist: List[str]
    questions_for_specialist: List[str]
    urgency_level: str  # "routine", "priority", "emergency"
    emergency_warning: Optional[str] = None
    safety_disclaimer: str

class AnalyticsStats(BaseModel):
    documents_processed: int
    questions_answered: int
    languages_used: Dict[str, int]
    voice_interactions: int
    avg_response_time_ms: int
    is_demo_metrics: bool = True
