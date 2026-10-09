# HealthBridge AI
> **"Making healthcare information simple, accessible, and multilingual."**

A college hackathon prototype built for the challenge: **AI for Healthcare Accessibility**.

[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-teal)](https://react.dev/)
[![Powered by FastAPI](https://img.shields.io/badge/Backend-Python%20FastAPI-blue)](https://fastapi.tiangolo.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/UI-Tailwind%20CSS%20v4-38bdf8)](https://tailwindcss.com/)
[![Speech API](https://img.shields.io/badge/Audio-Web%20Speech%20API-emerald)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Demo Ready](https://img.shields.io/badge/Hackathon-Demo%20Mode%20Ready-amber)](#demo-mode)

---

## 📌 Problem Statement & Motivation

In India and across developing regions, more than **70% of patients struggle to comprehend clinical laboratory and diagnostic reports**.
1. **Medical Jargon & Fear**: Reports are written in technical medical abbreviations (e.g., HbA1c, SGPT, MCV, Creatinine), causing anxiety or misunderstandings.
2. **Language Exclusion**: Diagnostic reports are almost exclusively printed in English, effectively alienating the hundreds of millions of people who speak regional Indian languages.
3. **Accessibility Divide**: Senior citizens and patients with low visual literacy or limited reading fluency struggle with dense, tiny laboratory prints.

**HealthBridge AI** bridges these 3 barriers by transforming dense clinical reports into calm, simplified, non-diagnostic educational summaries available in **8 Indian languages**, backed by **browser voice narration**, **appointment preparation checklists**, and **strict clinical safety guardrails**.

---

## 🚀 Key Features

### 1. Medical Document Explainer (Primary Feature)
- **Drag & Drop Upload**: Accepts PDF, JPG, and PNG medical reports.
- **5-Step Animated Extraction Pipeline**: Visualizes `Uploading -> Extracting text -> Understanding medical terms -> Layperson simplification -> Multilingual generation`.
- **Fictional Sample One-Click Demo**: Instant load of a verified 11-parameter metabolic and lipid panel for live hackathon presentations.
- **Simple Summary**: Neutral, educational overview without diagnostic panic.
- **Key Terms Cards**: Tap-to-expand explanations for HbA1c, Hemoglobin, Total Cholesterol, Creatinine, etc.
- **Values Benchmark Table**: Clearly displays test name, result, reference interval, and status with neutral wording (*"Within usual range"*, *"Outside listed reference range"*, *"Discuss with doctor"*).
- **Questions for Your Doctor**: Auto-generates 4 contextual, high-value questions for the patient's next clinical visit.

### 2. "Explain Like..." Adaptive Complexity
- **🧑 Me**: Balanced, clear layperson overview.
- **👨‍👩‍👧 Family**: Actionable summary with guidance on how to support a relative.
- **👴 Elderly**: **Dynamic large typography (18px+)**, short sentences, calm pacing, and prominent voice triggers.
- **🧒 Simple**: Plain everyday words with zero medical terminology.

### 3. Multilingual By Design (8 Indian Regional Languages)
Instant real-time translation into:
- **English**
- **ಕನ್ನಡ (Kannada)**
- **हिन्दी (Hindi)**
- **தமிழ் (Tamil)**
- **తెలుగు (Telugu)**
- **മലയാളം (Malayalam)**
- **বাংলা (Bengali)**
- **मराठी (Marathi)**

### 4. Interactive Voice Assistant (Speech-to-Text & Text-to-Speech)
- Powered by native browser **Web Speech API** (zero extra external installations or paid subscriptions required).
- Voice query recognition with pulsing microphone waveforms.
- Automatic **audio read-aloud** in regional Indian accents with rate control (calm, slower speech in Elderly mode).

### 5. AI Health Assistant
- Educational conversational assistant with quick example prompt chips (*"What is blood pressure?"*, *"What does HbA1c measure?"*).
- Built-in clinical neutralization preventing diagnostic claims (*"You have diabetes"* is blocked).
- Copy answer and text-to-speech triggers on every message.

### 6. Medicine Educational Directory
- Searchable database of common medications (Paracetamol, Metformin, Amoxicillin, Atorvastatin, Omeprazole, Cetirizine, Amlodipine).
- Details: Common uses, general precautions, common side effects, important warnings, and when to seek medical help.
- Strict disclaimer prohibiting prescription advice or personalized dosage alteration.

### 7. Healthcare Navigator & Triage
- Input patient symptoms (e.g., *"I have an itchy rash on my arms"* or *"Knee pain when climbing stairs"*).
- Recommends the appropriate medical subspecialist (e.g., Dermatologist, Orthopedist, Cardiologist, Endocrinologist).
- Generates **"What to prepare for your appointment"** checklists (current medicines, previous scans, timeline, and questions).

### 8. Clinical Safety Layer (`<MedicalSafetyNotice />`)
- **No Unsupported Diagnosis**: Replaces definitive diagnostic declarations with educational descriptions.
- **Red-Flag Emergency Detection**: Identifies critical keywords (e.g., severe crushing chest pain, difficulty breathing, slurred speech) and immediately surfaces an emergency notice.
- **Standardized Medical Disclaimers** across all views.

### 9. Privacy Center (Privacy by Design)
- **Zero Persistent Storage**: Files are processed in ephemeral session memory.
- **"Delete My Documents" Action**: Permanently purges all cached uploads, extractions, and activity history in one click.
- **Honest Compliance**: Avoids misleading claims of regulatory certification while maintaining strict local session isolation.

### 10. 🎬 10-Step Guided Presentation Demo
- Accessible via the **"🎬 Presentation Demo"** button on the navbar and hero section.
- An automated walkthrough designed specifically for hackathon judges covering:
  `Problem -> Upload -> OCR -> AI Explanation -> Elderly Mode -> Kannada Translation -> Voice Output -> Doctor Questions -> Privacy -> Safety`.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HEALTHBRIDGE AI FRONTEND                        │
│                   React 19 + TypeScript + Tailwind CSS                 │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐   ┌──────────────┐   │
│   │ Medical Explainer  │   │ Explain Like...    │   │ Multilingual │   │
│   │ (Upload & Table)   │   │ (Me/Elderly/Simple)│   │ (8 Languages)│   │
│   └────────────────────┘   └────────────────────┘   └──────────────┘   │
│   ┌────────────────────┐   ┌────────────────────┐   ┌──────────────┐   │
│   │ Web Speech API     │   │ Medicine Directory │   │ Navigator    │   │
│   │ (STT Voice & TTS)  │   │ & Safety Filters   │   │ & Triage     │   │
│   └────────────────────┘   └────────────────────┘   └──────────────┘   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ API Client with Automatic Client-Side Mock Fallback            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ REST APIs (JSON / Multipart)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND SERVICE                         │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ API Routers (/reports, /chat, /medicines, /navigator, /privacy) │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                  │                                     │
│   ┌──────────────┐ ┌─────────────▼───┐ ┌────────────────┐ ┌──────────┐ │
│   │ OCR Pipeline │ │ Safety Layer    │ │ AI Abstraction │ │ Lexicon  │ │
│   │ Parser & Mock│ │ Red-Flag Triage │ │ LLM / Mock AI  │ │ 8 Langs  │ │
│   └──────────────┘ └─────────────────┘ └────────────────┘ └──────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

- **Frontend**:
  - React 19 + TypeScript
  - Vite 8.3
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - Lucide React (clean medical & navigation icons)
  - HTML5 Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
  - Canvas Confetti
- **Backend**:
  - Python 3.11
  - FastAPI
  - Uvicorn
  - Pydantic v2
  - HTTPX / Requests
  - uv (Modern Python package manager)
- **Database & Storage**:
  - Ephemeral session memory
  - Local browser storage for activity logs

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18+ (Verified with v24.15)
- **Python**: v3.10+ (Installed via `uv` or system Python)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/healthbridge-ai.git
cd healthbridge-ai
```

### 2. Backend Setup
From the project root:
```bash
# If using uv (recommended):
cd backend
uv venv --python 3.11
uv pip install -r requirements.txt

# Or with standard python venv:
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will run on `http://127.0.0.1:8000`. Test health status at `http://127.0.0.1:8000/api/health`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at `http://127.0.0.1:5173`.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:
```env
# AI LLM Provider Key (Optional: Google Gemini or OpenAI compatible)
AI_API_KEY=
GEMINI_API_KEY=

# OCR Provider (Optional: Google Cloud Vision / AWS Textract / Tesseract)
OCR_API_KEY=

# Multilingual Translation API (Optional)
TRANSLATION_API_KEY=

# Demo Mode toggle (Default: true)
DEMO_MODE=true
```

> **Note for Judges**: When `DEMO_MODE=true` (or when API keys are blank), HealthBridge AI operates in **zero-dependency Demo Mode** with complete mock datasets. No external paid API keys are required for the presentation.

---

## 🎯 What Works in DEMO MODE vs REAL API

| Feature | Demo Mode (No Keys) | With Real API Key |
| :--- | :---: | :---: |
| **Medical Report Simplification** | ✅ Fully functional (sample & uploaded lab panels) | ✅ Dynamic LLM prompt with safety instructions |
| **"Explain Like..." (Me, Elderly, Simple)**| ✅ Verified adaptive content across all 4 modes | ✅ Real-time temperature & tone control |
| **8 Indian Regional Languages** | ✅ Pre-verified clinical translations (Kannada, Hindi, etc.) | ✅ Dynamic real-time language translation |
| **Browser Web Speech (TTS & STT)** | ✅ Native browser Web Speech API | ✅ Native browser Web Speech API |
| **Medicine Educational Directory** | ✅ 7+ foundational medications with full precautions | ✅ Extensible to online pharmacology databases |
| **Healthcare Navigator & Triage** | ✅ 8+ specialties with preparation checklists | ✅ Dynamic specialty search |
| **Safety Guardrails & Emergency Triage** | ✅ Active regex red-flag detection & disclaimer | ✅ Active guardrails + AI content filter |
| **Privacy Document Purging** | ✅ One-click ephemeral deletion | ✅ One-click ephemeral deletion |

---

## ⚠️ Safety & Ethical Limitations

1. **Not a Diagnostic Tool**: HealthBridge AI does not diagnose illnesses, interpret medical imaging for diagnostic certainty, or replace a medical doctor.
2. **No Personalized Prescription Alteration**: The system explicitly instructs users never to stop, start, or alter medication dosages without consulting their prescribing physician.
3. **Emergency Care Protocol**: If potentially life-threatening symptoms (e.g., acute chest pain, shortness of breath, loss of consciousness) are detected, the system immediately displays an urgent triage banner.

---

## 🔮 Future Improvements
1. **Direct Tesseract OCR & Camera Capture**: Mobile camera intake with edge perspective correction.
2. **Audio-to-Audio Translation**: Seamless native speech translation for regional Indian dialects without text intermediate steps.
3. **Doctor Teleconsultation Connect**: Direct handoff to licensed tele-health platforms with pre-formatted patient appointment summaries.
4. **Offline Mobile App**: Progressive Web App (PWA) with cached offline medical educational guides.

---

## 🎙️ 2-Minute Hackathon Presentation Script

> **[0:00 - 0:25] Hook & Problem**  
> *"Good morning judges. How many times have you or your parents received a blood test report, seen unfamiliar medical terms like HbA1c or SGPT outside the normal range, and immediately panicked? In India, diagnostic reports are printed in English, filled with clinical jargon. Over 70% of people cannot understand their own laboratory results, and elderly patients or regional language speakers are completely left behind. That is why we built **HealthBridge AI**."*

> **[0:25 - 0:55] Live Demo: Document Explainer & Elderly Mode**  
> *"Let's click 'Load Sample Blood Test Report'. Within seconds, our 5-step OCR pipeline extracts 11 parameters. Notice what HealthBridge does: it doesn't give a scary diagnosis like 'You have diabetes'. Instead, it generates a calm, educational summary highlighting that fasting glucose is outside the usual range, while kidney and liver markers look healthy. Now watch this: If we switch to 'Elderly Mode', the typography scales up to 18px, sentences become short and gentle, and the voice button takes center stage."*

> **[0:55 - 1:25] Multilingual & Voice Accessibility**  
> *"Now let's switch the language to Kannada [ಅಧಿಕ ರಕ್ತದೊತ್ತಡ...]. The entire summary, key terms, and questions to ask the doctor are translated accurately into Kannada. Let's tap 'Listen to Explanation' [play voice audio]. Utilizing the native Web Speech API, patients can listen to their health summary in their mother tongue without installing any third-party apps."*

> **[1:25 - 1:45] Safety Guardrails & Navigator**  
> *"Safety is our number one priority. If a user asks a question mentioning severe chest pain or shortness of breath, our AI safety layer instantly detects the red flag and displays an urgent medical attention warning. We also include a Healthcare Navigator that prepares patients for their visits—telling them exactly what reports to bring and what questions to ask their doctor."*

> **[1:45 - 2:00] Closing & Impact**  
> *"HealthBridge AI breaks the complexity barrier, the language barrier, and the accessibility barrier. It makes healthcare simple, accessible, and multilingual for every Indian family. Thank you!"*
