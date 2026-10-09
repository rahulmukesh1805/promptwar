import re
from typing import Dict, Any, List
from backend.schemas import NavigatorResponse, SupportedLanguage
from backend.services.safety_service import safety_service

class NavigatorService:
    """
    Helps patients identify appropriate healthcare categories and specialties
    based on their described symptoms or health questions.
    """

    SPECIALTY_DIRECTORY = [
        {
            "id": "dermatology",
            "keywords": ["skin", "rash", "itching", "acne", "mole", "hair loss", "scalp", "eczema", "psoriasis", "spots"],
            "specialty_name": "Dermatologist",
            "specialty_description": (
                "Based on your query, a Dermatologist is the medical doctor specializing in "
                "the diagnosis and treatment of conditions affecting skin, hair, and nails."
            ),
            "common_conditions": ["Skin rashes & dermatitis", "Acne & hormonal breakouts", "Hair thinning or scalp irritation", "Chronic itching & hives", "Skin lesion checks"],
            "preparation_checklist": [
                "List of all current topical creams, soaps, and oral medicines",
                "Photos or dates showing when the skin changes first appeared",
                "History of known allergies, detergents, or cosmetics used recently",
                "Avoid applying heavy makeup or tinted ointments on the day of examination"
            ],
            "questions_for_specialist": [
                "Could an environmental factor or allergy be triggering this skin response?",
                "Are there specific skin-care cleansers or moisturizers you recommend?",
                "How long should I try this treatment before scheduling a follow-up?"
            ]
        },
        {
            "id": "cardiology",
            "keywords": ["heart", "chest", "palpitation", "high blood pressure", "cholesterol", "fluttering", "short of breath on walking"],
            "specialty_name": "Cardiologist",
            "specialty_description": (
                "Based on your query, a Cardiologist is a medical specialist focused on disorders of "
                "the cardiovascular system, heart rhythm, and blood vessel health."
            ),
            "common_conditions": ["Hypertension management", "Elevated lipid / cholesterol profiles", "Heart rhythm palpitations", "Cardiovascular wellness assessments"],
            "preparation_checklist": [
                "Record of your home blood pressure readings over the last 1-2 weeks",
                "Previous ECG, 2D-Echocardiogram, or lipid blood test results",
                "Complete list of existing medications and supplements",
                "Details on whether heart conditions run in your immediate family"
            ],
            "questions_for_specialist": [
                "What is my target blood pressure and cholesterol level?",
                "Are there safe levels of daily exercise or walking for my condition?",
                "What warning signs should prompt immediate medical attention?"
            ]
        },
        {
            "id": "endocrinology",
            "keywords": ["sugar", "diabetes", "hba1c", "thyroid", "tsh", "hormone", "weight gain suddenly", "fatigue thyroid"],
            "specialty_name": "Endocrinologist",
            "specialty_description": (
                "Based on your query, an Endocrinologist is a doctor who specializes in the endocrine glands "
                "and hormones, including diabetes, thyroid metabolism, and adrenal health."
            ),
            "common_conditions": ["Blood glucose & HbA1c elevation", "Hypothyroidism or Hyperthyroidism", "Metabolic health & insulin resistance", "Polycystic ovarian concerns"],
            "preparation_checklist": [
                "Recent fasting blood sugar, HbA1c, and thyroid panel (TSH, Free T4) reports",
                "Log of daily dietary habits and meal timings",
                "Current list of antidiabetic or thyroid medications",
                "Notes on any unexplained weight, appetite, or energy shifts"
            ],
            "questions_for_specialist": [
                "How frequently should I monitor my blood sugar or thyroid markers?",
                "What dietary modifications will most directly support my metabolic targets?",
                "Do my current medications need any periodic dosage reviews?"
            ]
        },
        {
            "id": "orthopedics",
            "keywords": ["bone", "joint", "knee", "back pain", "spine", "fracture", "shoulder", "swelling joint", "walking pain"],
            "specialty_name": "Orthopedic Specialist / Orthopedist",
            "specialty_description": (
                "Based on your query, an Orthopedic Specialist evaluates and treats the musculoskeletal system, "
                "including bones, joints, ligaments, tendons, and spine."
            ),
            "common_conditions": ["Knee osteoarthritis & joint wear", "Lower back ache & postural strain", "Sports injuries & ligament sprains", "Bone density & calcium health"],
            "preparation_checklist": [
                "Previous X-rays, MRI scans, or bone density (DEXA) reports",
                "Timeline of when pain began and activities that ease or aggravate it",
                "List of pain medications or physical therapy exercises previously tried",
                "Comfortable clothing suitable for physical joint range movement exams"
            ],
            "questions_for_specialist": [
                "Will targeted physical therapy or strengthening exercises improve mobility?",
                "Are there specific movements or weight-bearing activities I should avoid?",
                "What non-surgical therapies are most appropriate at this stage?"
            ]
        },
        {
            "id": "pediatrics",
            "keywords": ["child", "baby", "infant", "toddler", "growth", "vaccination", "pediatric"],
            "specialty_name": "Pediatrician",
            "specialty_description": (
                "Based on your query, a Pediatrician provides specialized medical care and developmental tracking "
                "for infants, children, and adolescents."
            ),
            "common_conditions": ["Childhood immunizations & milestones", "Childhood fevers and viral illness", "Growth and nutritional tracking", "Pediatric allergies & asthma"],
            "preparation_checklist": [
                "Child's vaccination card / immunization booklet",
                "Growth chart (height and weight records over time)",
                "Temperature log if the child has experienced recent fever",
                "Notes on changes in sleeping, eating, or fluid intake"
            ],
            "questions_for_specialist": [
                "Is my child reaching expected developmental and growth milestones?",
                "What signs indicate that this fever requires immediate reassessment?",
                "Which immunizations are due in the upcoming months?"
            ]
        },
        {
            "id": "gastroenterology",
            "keywords": ["stomach", "acidity", "reflux", "constipation", "bloating", "digestion", "liver", "abdomen pain", "gas"],
            "specialty_name": "Gastroenterologist",
            "specialty_description": (
                "Based on your query, a Gastroenterologist specializes in disorders of the digestive tract, "
                "stomach, intestines, gallbladder, and liver."
            ),
            "common_conditions": ["Acid reflux / GERD", "Irritable bowel & bloating", "Fatty liver & liver function checks", "Persistent digestive discomfort"],
            "preparation_checklist": [
                "Recent ultrasound scans or liver function blood test reports",
                "Diary of foods or beverages that trigger digestive discomfort",
                "List of all antacids, pain medications, or digestive enzymes used",
                "Notations on changes in bowel frequency or consistency"
            ],
            "questions_for_specialist": [
                "Could specific food intolerances be contributing to these digestive symptoms?",
                "Do I need any specialized imaging or endoscopic evaluation?",
                "What lifestyle adjustments support long-term digestive gut health?"
            ]
        },
        {
            "id": "neurology",
            "keywords": ["headache", "migraine", "dizziness", "nerve", "tremor", "tingling", "seizure", "memory loss"],
            "specialty_name": "Neurologist",
            "specialty_description": (
                "Based on your query, a Neurologist is a physician who specializes in the diagnosis and management "
                "of conditions affecting the brain, spinal cord, and peripheral nervous system."
            ),
            "common_conditions": ["Chronic migraines and recurrent headaches", "Peripheral nerve tingling & neuropathy", "Balance disorders & vertigo", "Tremors & neuromuscular conditions"],
            "preparation_checklist": [
                "Headache or symptom diary noting time, severity, and triggers",
                "Any previous brain MRI or CT scan imaging discs/reports",
                "Complete list of medications taken, including over-the-counter pain relievers",
                "Observation notes from family members regarding episodes if applicable"
            ],
            "questions_for_specialist": [
                "Are there specific triggers or lifestyle factors linked to these episodes?",
                "What is the difference between preventive and rescue treatment options?",
                "What red-flag neurological symptoms should prompt immediate hospital evaluation?"
            ]
        },
        {
            "id": "general_physician",
            "keywords": ["fever", "cough", "cold", "body ache", "fatigue", "general checkup", "weakness"],
            "specialty_name": "General Physician / Family Medicine",
            "specialty_description": (
                "Based on your query, a General Physician or Family Medicine doctor is the ideal first point of contact "
                "for comprehensive evaluation, acute seasonal ailments, and coordinated medical care."
            ),
            "common_conditions": ["Seasonal infections, viral fever, flu", "General preventive health assessments", "Initial evaluation of fatigue or malaise", "Care coordination for specialist referrals"],
            "preparation_checklist": [
                "Record of your symptoms and how many days they have been present",
                "List of any medications or home remedies already tried",
                "Recent lab reports or medical history from past year",
                "List of questions you would like answered during the visit"
            ],
            "questions_for_specialist": [
                "What do you suspect might be causing these symptoms?",
                "Do I need routine screening lab tests or blood investigations?",
                "Should I follow up with a specific medical subspecialist if symptoms continue?"
            ]
        }
    ]

    @classmethod
    def navigate(cls, query: str, lang: SupportedLanguage = SupportedLanguage.EN) -> NavigatorResponse:
        is_urgent, urgent_msg = safety_service.check_urgency(query)
        q_lower = query.lower()

        # Find best matching specialty
        best_match = cls.SPECIALTY_DIRECTORY[-1]  # default to General Physician
        highest_score = 0

        for item in cls.SPECIALTY_DIRECTORY:
            score = sum(1 for kw in item["keywords"] if kw in q_lower)
            if score > highest_score:
                highest_score = score
                best_match = item

        urgency_level = "emergency" if is_urgent else ("priority" if "severe" in q_lower or "chronic" in q_lower else "routine")

        return NavigatorResponse(
            specialty_name=best_match["specialty_name"],
            specialty_description=best_match["specialty_description"],
            common_conditions=best_match["common_conditions"],
            preparation_checklist=best_match["preparation_checklist"],
            questions_for_specialist=best_match["questions_for_specialist"],
            urgency_level=urgency_level,
            emergency_warning=urgent_msg,
            safety_disclaimer=safety_service.get_standard_disclaimer()
        )

navigator_service = NavigatorService()
