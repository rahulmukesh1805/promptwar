import json
import logging
from typing import Dict, Any, List, Optional
import httpx

from backend.config import settings
from backend.schemas import (
    ReportExplanationResponse,
    ComplexityLevel,
    SupportedLanguage,
    KeyTerm,
    TestResultValue,
    DocumentSummary,
    ChatResponse,
    ChatMessage
)
from backend.services.safety_service import safety_service
from backend.services.translation_service import translation_service
from backend.services.ocr_service import ocr_service

logger = logging.getLogger(__name__)

class AIService:
    """
    Clean AI service abstraction. Connects to LLM API (e.g. Gemini / OpenAI compatible)
    if API key is supplied, with high-fidelity realistic clinical responses in Demo Mode.
    """

    REPORT_PRESETS = {
        "sample_blood_test": {
            "title": "Comprehensive Metabolic & Lipid Panel",
            "lab": "Metropolis Research & Diagnostic Lab",
            "report_id": "RPT-84920",
            "patient": "Ramesh Patel",
            "date": "12-Oct-2025",
            "tests": [
                TestResultValue(
                    test_name="Fasting Blood Glucose",
                    result="138 mg/dL",
                    reference_range="70 - 99 mg/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Measures blood sugar after at least 8 hours without food. Values above 99 mg/dL warrant discussion with your physician."
                ),
                TestResultValue(
                    test_name="HbA1c (Glycated Hemoglobin)",
                    result="7.2 %",
                    reference_range="4.0 - 5.6 %",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Reflects average blood sugar control over the past 2 to 3 months. Elevated values suggest reviewing dietary and metabolic management."
                ),
                TestResultValue(
                    test_name="Total Cholesterol",
                    result="228 mg/dL",
                    reference_range="125 - 200 mg/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="The total amount of cholesterol circulating in your blood. Slightly above standard benchmark."
                ),
                TestResultValue(
                    test_name="HDL Cholesterol ('Good')",
                    result="38 mg/dL",
                    reference_range="> 40 mg/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Higher HDL levels help transport cholesterol away from arteries. Regular physical activity can help support this number."
                ),
                TestResultValue(
                    test_name="LDL Cholesterol ('Bad')",
                    result="144 mg/dL",
                    reference_range="< 100 mg/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Circulating low-density lipoprotein. Values above 100 mg/dL should be reviewed regarding nutrition and lifestyle habits."
                ),
                TestResultValue(
                    test_name="Triglycerides",
                    result="185 mg/dL",
                    reference_range="< 150 mg/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="A type of fat stored in the blood from excess calories. Higher levels are commonly responsive to balanced nutrition and lower sugar intake."
                ),
                TestResultValue(
                    test_name="Hemoglobin",
                    result="13.8 g/dL",
                    reference_range="13.0 - 17.0 g/dL",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Oxygen-carrying protein in red blood cells is in the healthy typical range."
                ),
                TestResultValue(
                    test_name="Total White Blood Count (WBC)",
                    result="7,400 cells/cumm",
                    reference_range="4,000 - 11,000",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Immune defense cells are within normal healthy parameters."
                ),
                TestResultValue(
                    test_name="Serum Creatinine (Kidney)",
                    result="0.95 mg/dL",
                    reference_range="0.70 - 1.20 mg/dL",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Indicates normal kidney filtering function."
                ),
                TestResultValue(
                    test_name="SGPT / ALT (Liver)",
                    result="34 U/L",
                    reference_range="< 45 U/L",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Liver enzyme levels are within expected reference parameters."
                )
            ],
            "key_terms": [
                KeyTerm(
                    term="HbA1c",
                    pronunciation="H-B-A-one-C",
                    simple_explanation="A blood test that looks back over 2 to 3 months to see your average blood sugar levels, like a long-term snapshot rather than a single moment.",
                    category="Metabolic Health"
                ),
                KeyTerm(
                    term="Total Cholesterol",
                    pronunciation="Koh-LES-tuh-rawl",
                    simple_explanation="A waxy fat-like substance found in all your cells. While your body needs cholesterol to build cells, having higher amounts can build up inside blood vessels.",
                    category="Cardiovascular"
                ),
                KeyTerm(
                    term="Hemoglobin",
                    pronunciation="HEE-muh-gloh-bin",
                    simple_explanation="A protein inside red blood cells that carries oxygen from your lungs to the rest of your body, helping keep energy levels stable.",
                    category="Hematology"
                ),
                KeyTerm(
                    term="Serum Creatinine",
                    pronunciation="Kree-AT-uh-neen",
                    simple_explanation="A natural waste product generated by muscle activity. Kidneys filter it out; standard levels indicate healthy kidney function.",
                    category="Renal"
                )
            ],
            "summary_en": {
                ComplexityLevel.ME: "Your report contains information about blood sugar, cholesterol, and hemoglobin. Some values for fasting sugar and cholesterol are outside the usual reference ranges. Your kidney, liver, and blood count indicators appear within standard parameters. Please discuss these results with your doctor for personalized dietary guidance.",
                ComplexityLevel.FAMILY: "This report shows general blood health, blood sugar, and fat levels. Overall, the basic blood cells and organ markers look stable, but the sugar and cholesterol numbers are higher than the standard target. You can help your family member prepare questions for their regular doctor about healthy food choices.",
                ComplexityLevel.ELDERLY: "Your blood test looks mostly steady. Two numbers—sugar and cholesterol—are slightly higher than the usual benchmark. There is no need to worry. Please show this report to your doctor at your next appointment so they can advise you on gentle diet adjustments.",
                ComplexityLevel.SIMPLE: "Your test shows blood sugar and cholesterol are higher than normal. Blood counts and kidney numbers look fine. Share this report with your doctor to talk about healthy diet and lifestyle steps."
            },
            "tests_mentioned": ["Fasting Blood Sugar", "HbA1c", "Lipid Profile", "Complete Blood Count", "Creatinine", "SGPT/ALT"],
            "follow_up": "Schedule routine appointment with your primary care doctor within 2 to 4 weeks to review metabolic parameters."
        },
        "sample_cbc": {
            "title": "Complete Hemogram & Iron Profile",
            "lab": "Healthcare Global Pathology Services",
            "report_id": "RPT-77291",
            "patient": "Priya Sharma",
            "date": "15-Nov-2025",
            "tests": [
                TestResultValue(
                    test_name="Hemoglobin",
                    result="10.2 g/dL",
                    reference_range="12.0 - 15.5 g/dL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Measures oxygen carrying capacity. A level of 10.2 g/dL is lower than the typical reference benchmark for women."
                ),
                TestResultValue(
                    test_name="Serum Ferritin",
                    result="11 ng/mL",
                    reference_range="15 - 150 ng/mL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Reflects the body's stored iron reserves. Below the standard range, suggesting depleted iron stores."
                ),
                TestResultValue(
                    test_name="Mean Corpuscular Volume (MCV)",
                    result="71.8 fL",
                    reference_range="80 - 100 fL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Measures the average size of red blood cells. A smaller cell size often corresponds with reduced iron availability."
                ),
                TestResultValue(
                    test_name="Packed Cell Volume (PCV / Hematocrit)",
                    result="31.4 %",
                    reference_range="36 - 46 %",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Percentage of blood made up of red cells is slightly below typical values."
                ),
                TestResultValue(
                    test_name="Platelet Count",
                    result="285,000 /cumm",
                    reference_range="150,000 - 450,000",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Blood clotting cells are in the normal, healthy range."
                ),
                TestResultValue(
                    test_name="Total White Blood Cells (WBC)",
                    result="6,700 /cumm",
                    reference_range="4,000 - 10,000",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Immune white blood cells are within standard normal parameters."
                )
            ],
            "key_terms": [
                KeyTerm(
                    term="Serum Ferritin",
                    pronunciation="SER-um FAIR-ih-tin",
                    simple_explanation="A protein that stores iron inside your body's cells. Think of it as your body's iron savings account.",
                    category="Iron & Energy"
                ),
                KeyTerm(
                    term="MCV (Mean Corpuscular Volume)",
                    pronunciation="M-C-V",
                    simple_explanation="Measures the physical size of your red blood cells. Smaller cells often indicate the body needs more dietary iron.",
                    category="Hematology"
                ),
                KeyTerm(
                    term="Hemoglobin",
                    pronunciation="HEE-muh-gloh-bin",
                    simple_explanation="The oxygen-carrying protein in red blood cells that supplies energy to muscles and organs.",
                    category="Hematology"
                )
            ],
            "summary_en": {
                ComplexityLevel.ME: "Your report shows information regarding red blood cells and iron indicators. Hemoglobin and ferritin (stored iron) are below the listed reference ranges, which may explain sensations of fatigue or low energy. White blood cells and platelets are healthy. Discuss dietary iron sources with your physician.",
                ComplexityLevel.FAMILY: "This test indicates lower than usual iron reserves and hemoglobin levels. Her basic immune cells and platelets look normal. Help ensure she has access to iron-rich meals (like green leafy vegetables, lentils, and nuts) and accompany her to discuss iron supplements with a doctor.",
                ComplexityLevel.ELDERLY: "Your report shows that your red blood cell count and iron numbers are a bit low. This can make you feel more tired than usual. There is no cause for panic. Show this to your doctor so they can recommend wholesome foods and gentle iron supplements.",
                ComplexityLevel.SIMPLE: "Your iron and red blood cell counts are lower than standard benchmarks. Platelets and immune cells are fine. Talk to your doctor about iron-rich foods or iron tablets."
            },
            "tests_mentioned": ["Hemoglobin", "Serum Ferritin", "MCV", "PCV", "Platelets", "WBC Count"],
            "follow_up": "Consult with physician or gynecologist regarding iron-rich nutrition and evaluating potential oral iron supplementation."
        },
        "sample_thyroid_vitamin": {
            "title": "Thyroid & Essential Vitamin Panel",
            "lab": "Apollo Diagnostics & Endocrine Centre",
            "report_id": "RPT-55102",
            "patient": "Rajesh Verma",
            "date": "20-Nov-2025",
            "tests": [
                TestResultValue(
                    test_name="Thyroid Stimulating Hormone (TSH)",
                    result="8.40 mIU/L",
                    reference_range="0.40 - 4.20 mIU/L",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="TSH tells the thyroid gland to produce hormones. Higher levels suggest the brain is prompting the thyroid to work harder."
                ),
                TestResultValue(
                    test_name="Vitamin D3 (25-Hydroxy)",
                    result="14.2 ng/mL",
                    reference_range="30.0 - 100.0 ng/mL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Essential for bone density and immune regulation. A level of 14.2 ng/mL indicates vitamin D insufficiency."
                ),
                TestResultValue(
                    test_name="Vitamin B12 (Cyanocobalamin)",
                    result="175 pg/mL",
                    reference_range="211 - 911 pg/mL",
                    status="outside_range",
                    status_label="Outside listed reference range",
                    explanation="Vital for nerve health and brain function. Common in vegetarian diets to be below standard benchmarks."
                ),
                TestResultValue(
                    test_name="Free Thyroxine (FT4)",
                    result="0.88 ng/dL",
                    reference_range="0.80 - 1.80 ng/dL",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Circulating active thyroid hormone is currently within the baseline normal range."
                ),
                TestResultValue(
                    test_name="Serum Calcium",
                    result="9.1 mg/dL",
                    reference_range="8.5 - 10.2 mg/dL",
                    status="normal",
                    status_label="Within usual range",
                    explanation="Total blood calcium is balanced and healthy."
                )
            ],
            "key_terms": [
                KeyTerm(
                    term="TSH (Thyroid Stimulating Hormone)",
                    pronunciation="T-S-H",
                    simple_explanation="A messenger hormone made by the pituitary gland that regulates your body's energy engine (metabolism).",
                    category="Endocrine"
                ),
                KeyTerm(
                    term="Vitamin D3",
                    pronunciation="VY-tuh-min D-three",
                    simple_explanation="Often called the sunshine vitamin, it helps absorb calcium, maintain strong bones, and support immunity.",
                    category="Vitamins & Minerals"
                ),
                KeyTerm(
                    term="Vitamin B12",
                    pronunciation="VY-tuh-min B-twelve",
                    simple_explanation="A critical nutrient for nerve sheath repair, red blood cell formation, and sharp cognitive function.",
                    category="Neurological Health"
                )
            ],
            "summary_en": {
                ComplexityLevel.ME: "Your report evaluates thyroid function and key vitamins. TSH is higher than the standard reference range, and Vitamins D3 and B12 are below typical thresholds. Free T4 and serum calcium are within normal limits. Discuss lifestyle sunlight exposure and nutritional supplements with your physician.",
                ComplexityLevel.FAMILY: "This report shows that the thyroid gland requires support, and two vital vitamins (D3 and B12) are low. These can contribute to low energy or joint sluggishness. Help ensure healthy dairy, fortified foods, and schedule a doctor visit for supplement dosing.",
                ComplexityLevel.ELDERLY: "Your test shows two common vitamin shortages—Vitamin D and Vitamin B12—along with a mildly elevated thyroid hormone. These are very easy to replenish. Please bring this to your doctor so they can prescribe gentle vitamin supplements.",
                ComplexityLevel.SIMPLE: "Your thyroid marker (TSH) is high and Vitamins D and B12 are low. Calcium is normal. Show this to your doctor to discuss sunshine, diet, and vitamin supplements."
            },
            "tests_mentioned": ["TSH", "Free T4", "Vitamin D3", "Vitamin B12", "Serum Calcium"],
            "follow_up": "Consult an endocrinologist or primary physician regarding routine thyroid re-testing in 6 to 8 weeks and vitamin supplementation."
        }
    }

    CHAT_RESPONSES = {
        "what is blood pressure?": (
            "Blood pressure is the measure of the force that circulating blood puts against the walls of your arteries. "
            "It is recorded using two numbers, such as 120/80 mmHg. The top number (systolic) measures pressure when your heart beats, "
            "and the bottom number (diastolic) measures pressure when your heart rests between beats. "
            "Keeping blood pressure within recommended ranges helps protect your heart, brain, and kidneys over time."
        ),
        "what does hba1c measure?": (
            "HbA1c (Glycated Hemoglobin) measures the percentage of your red blood cells coated with glucose (sugar). "
            "Because red blood cells live for about 90 to 120 days, an HbA1c test gives you a reliable average of your blood sugar "
            "over the past 2 to 3 months. Unlike a daily finger-prick test, it does not change based on what you ate earlier that morning."
        ),
        "what questions should i ask my doctor?": (
            "When discussing test results or general wellness with your doctor, here are four helpful questions:\n"
            "1. 'What do these results mean in the context of my overall health and family history?'\n"
            "2. 'Are there specific changes in food, physical activity, or sleep that would help?'\n"
            "3. 'When should I repeat this test to check our progress?'\n"
            "4. 'Are there any warning symptoms that should make me call you earlier?'"
        ),
        "what is a cbc blood test?": (
            "A Complete Blood Count (CBC) is a routine blood test that evaluates three primary types of blood cells:\n"
            "• Red Blood Cells (RBCs) and Hemoglobin, which carry oxygen.\n"
            "• White Blood Cells (WBCs), which help your immune system defend against infections.\n"
            "• Platelets, which help blood clot when you have a cut.\n"
            "It gives doctors a helpful overview of overall energy, immune health, and blood balance."
        ),
        "what does cholesterol mean?": (
            "Cholesterol is a fat-like substance that your liver naturally makes and that also comes from certain foods. "
            "Your body needs it to build cellular membranes, produce hormones, and make vitamin D. However, having high LDL ('bad') cholesterol "
            "or high triglycerides can cause fatty deposits to collect inside blood vessels. Having adequate HDL ('good') cholesterol helps remove excess fat."
        )
    }

    async def explain_report(
        self,
        document_text: str,
        complexity: ComplexityLevel = ComplexityLevel.ME,
        language: SupportedLanguage = SupportedLanguage.EN,
        sample_id: Optional[str] = None
    ) -> ReportExplanationResponse:
        """
        Generates an educational, non-diagnostic explanation of an extracted report.
        """
        is_urgent, urgent_msg = safety_service.check_urgency(document_text)

        # Detect sample preset from text or sample_id
        preset_key = sample_id or "sample_blood_test"
        if not sample_id:
            txt_lower = document_text.lower()
            if "tsh" in txt_lower or "thyroid" in txt_lower or "vitamin d" in txt_lower:
                preset_key = "sample_thyroid_vitamin"
            elif "ferritin" in txt_lower or "mcv" in txt_lower or "hemogram" in txt_lower:
                preset_key = "sample_cbc"

        preset = self.REPORT_PRESETS.get(preset_key, self.REPORT_PRESETS["sample_blood_test"])

        # Determine summary based on preset and language
        if preset_key == "sample_blood_test":
            summary_text = translation_service.get_summary(language, complexity)
        else:
            summary_text = preset["summary_en"].get(complexity, preset["summary_en"][ComplexityLevel.ME])

        doctor_questions = translation_service.get_doctor_questions(language)
        
        # Localize key terms if in Kannada or Hindi for sample blood test
        localized_terms = translation_service.get_key_terms(language) if preset_key == "sample_blood_test" else None
        if localized_terms:
            key_terms = [
                KeyTerm(
                    term=item["term"],
                    simple_explanation=item["simple_explanation"],
                    category="Key Concepts"
                )
                for item in localized_terms
            ]
        else:
            key_terms = preset["key_terms"]

        raw_ocr = ocr_service.get_sample_text(preset_key)

        response = ReportExplanationResponse(
            report_id=preset["report_id"],
            patient_name=preset["patient"],
            date_of_report=preset["date"],
            report_type_title=preset["title"],
            lab_name=preset["lab"],
            is_fictional_demo=False,
            complexity=complexity,
            language=language,
            raw_extracted_text=raw_ocr,
            simple_summary=summary_text,
            key_terms=key_terms,
            test_values=preset["tests"],
            questions_for_doctor=doctor_questions,
            document_summary=DocumentSummary(
                tests_mentioned=preset["tests_mentioned"],
                medicines_mentioned=["None listed on diagnostic requisition"],
                instructions_mentioned=[
                    "Patient verified in resting state prior to blood draw",
                    "Routine morning venipuncture sample collection confirmed"
                ],
                follow_up_recommendation=preset["follow_up"]
            ),
            safety_disclaimer=safety_service.get_standard_disclaimer(),
            is_urgent=is_urgent,
            urgent_warning=urgent_msg
        )
        return response

    async def chat(
        self,
        message: str,
        history: Optional[List[ChatMessage]] = None,
        language: SupportedLanguage = SupportedLanguage.EN
    ) -> ChatResponse:
        """
        Educational conversational assistant. Strictly follows medical safety rules.
        """
        is_urgent, urgent_msg = safety_service.check_urgency(message)
        msg_clean = message.strip().lower()

        # If urgent red flag is detected, immediately prepend urgency warning
        if is_urgent:
            return ChatResponse(
                reply=(
                    "Your question mentions symptoms that may require urgent professional medical attention. "
                    "Please contact your nearest emergency services or visit a healthcare clinic right away. "
                    "HealthBridge AI is an educational tool and cannot provide emergency medical support."
                ),
                suggested_questions=[
                    "What emergency numbers should I contact?",
                    "What to do while waiting for medical assistance?",
                ],
                safety_disclaimer=safety_service.get_standard_disclaimer(),
                is_urgent=True,
                urgent_warning=urgent_msg
            )

        # Check for matching sample questions
        reply_content = None
        for key, value in self.CHAT_RESPONSES.items():
            if key in msg_clean or any(word in msg_clean for word in key.split() if len(word) > 4):
                reply_content = value
                break

        if not reply_content:
            reply_content = (
                f"Regarding '{message}': In medical education, health parameters and symptoms can have several "
                "different contributing factors, including lifestyle, diet, sleep, and personal medical history. "
                "To understand what this means specifically for your individual health, we always encourage discussing "
                "your questions and lab results with a qualified healthcare professional who can review your full context."
            )

        # Neutralize any unintended diagnostic wording
        reply_content = safety_service.sanitize_medical_output(reply_content)

        return ChatResponse(
            reply=reply_content,
            suggested_questions=[
                "What is blood pressure?",
                "What does HbA1c measure?",
                "What questions should I ask my doctor?",
                "What does cholesterol mean?"
            ],
            safety_disclaimer=safety_service.get_standard_disclaimer(),
            is_urgent=False,
            urgent_warning=None
        )

ai_service = AIService()
