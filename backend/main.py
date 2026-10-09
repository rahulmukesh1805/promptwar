import os
import time
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from backend.config import settings
from backend.schemas import (
    ReportExplanationResponse,
    ExplainReportRequest,
    ComplexityLevel,
    SupportedLanguage,
    ChatRequest,
    ChatResponse,
    MedicineDetail,
    MedicineSafetyCheckRequest,
    MedicineSafetyCheckResponse,
    NavigatorRequest,
    NavigatorResponse,
    AnalyticsStats
)
from backend.services.safety_service import safety_service
from backend.services.ocr_service import ocr_service
from backend.services.ai_service import ai_service
from backend.services.translation_service import translation_service
from backend.services.medicine_service import medicine_service
from backend.services.navigator_service import navigator_service
from backend.services.analytics_service import analytics_service
from backend.services.tts_service import tts_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HealthBridge AI - Making healthcare information simple, accessible, and multilingual."
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "timestamp": time.time()
    }

@app.post("/api/reports/upload", response_model=ReportExplanationResponse)
async def upload_and_explain_report(
    file: UploadFile = File(...),
    complexity: ComplexityLevel = Form(ComplexityLevel.ME),
    language: SupportedLanguage = Form(SupportedLanguage.EN)
):
    """
    Primary endpoint: Upload PDF/JPG/PNG report, run OCR pipeline,
    and generate non-diagnostic simplified explanation.
    """
    try:
        content = await file.read()
        ocr_result = await ocr_service.extract_text_from_file(file.filename or "report.png", content)
        extracted_text = ocr_result["extracted_text"]
        sample_id = ocr_result.get("sample_id", "sample_blood_test")

        explanation = await ai_service.explain_report(
            document_text=extracted_text,
            complexity=complexity,
            language=language,
            sample_id=sample_id
        )
        
        # Track analytics
        lang_label = translation_service.LANGUAGE_NAMES.get(language, {}).get("name", "English")
        analytics_service.record_document_processed(lang_label)

        return explanation

    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the medical report. Please try again or use the sample demo report."
        )

@app.post("/api/reports/demo-sample", response_model=ReportExplanationResponse)
async def get_demo_sample_report(request: ExplainReportRequest):
    """
    Fetches the verified sample fictional report for presentations and testing.
    Supports multiple presets (sample_blood_test, sample_cbc, sample_thyroid_vitamin).
    """
    text = ocr_service.get_sample_text(request.sample_id)
    explanation = await ai_service.explain_report(
        document_text=text,
        complexity=request.complexity,
        language=request.language,
        sample_id=request.sample_id
    )
    lang_label = translation_service.LANGUAGE_NAMES.get(request.language, {}).get("name", "English")
    analytics_service.record_document_processed(lang_label)
    return explanation

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    AI Health Assistant: Answers general health questions in simple language,
    neutralizes diagnostic claims, and detects emergency keywords.
    """
    try:
        response = await ai_service.chat(
            message=request.message,
            history=request.history,
            language=request.language
        )
        lang_label = translation_service.LANGUAGE_NAMES.get(request.language, {}).get("name", "English")
        analytics_service.record_question_answered(is_voice=False, language=lang_label)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="HealthBridge AI Assistant is momentarily unavailable. Please retry in a few moments."
        )

@app.get("/api/medicines", response_model=List[MedicineDetail])
async def list_medicines(query: Optional[str] = Query(None, description="Search term for medicine")):
    """
    Educational medicine lookup providing uses, precautions, side effects, and warnings.
    """
    return medicine_service.search_medicines(query)

@app.post("/api/medicines/check-safety", response_model=MedicineSafetyCheckResponse)
async def check_medicine_safety(request: MedicineSafetyCheckRequest):
    """
    Checks multiple medicines for duplicate active ingredients (e.g. Paracetamol toxicity)
    and high-risk drug combinations.
    """
    return medicine_service.check_safety_combination(request.medicine_ids)

@app.get("/api/medicines/{med_id}", response_model=MedicineDetail)
async def get_medicine(med_id: str):
    med = medicine_service.get_by_id(med_id)
    if not med:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Medicine '{med_id}' not found.")
    return med

@app.post("/api/navigator", response_model=NavigatorResponse)
async def navigate_healthcare(request: NavigatorRequest):
    """
    Healthcare Navigator: Maps symptoms/needs to medical specialties and provides
    consultation preparation checklists without diagnosing.
    """
    try:
        result = navigator_service.navigate(request.query, request.language)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to determine specialty recommendation. Please consult a general practitioner."
        )

@app.get("/api/analytics", response_model=AnalyticsStats)
async def get_analytics():
    """
    Returns system analytics and usage statistics.
    """
    return analytics_service.get_stats()

@app.post("/api/privacy/clear")
async def clear_user_documents():
    """
    Privacy endpoint: Deletes all in-memory and cached user session documents.
    """
    return {
        "status": "success",
        "message": "All session documents, cached report extractions, and temporary uploads have been permanently cleared.",
        "documents_cleared": True
    }

@app.get("/api/tts")
async def text_to_speech(
    text: str = Query(..., description="Text content to synthesize"),
    lang: str = Query("en", description="Target language code (e.g. ta, hi, kn, te, ml, bn, mr, en)")
):
    """
    Multilingual Text-to-Speech audio synthesizer supporting native Indian languages
    (Tamil, Kannada, Hindi, Telugu, Malayalam, Bengali, Marathi, and English).
    Returns audio/mpeg stream.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text cannot be empty.")

    audio_bytes = tts_service.synthesize_speech(text=text, lang=lang)
    if not audio_bytes:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to synthesize speech.")

    return Response(content=audio_bytes, media_type="audio/mpeg")
