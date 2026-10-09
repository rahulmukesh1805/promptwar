from typing import List, Optional, Dict
from backend.schemas import MedicineDetail, MedicineSafetyCheckResponse

class MedicineService:
    DISCLAIMER = (
        "Medication information is educational and should not replace advice from a doctor or pharmacist. "
        "Never begin, discontinue, or alter dosages without direct consultation with your healthcare provider."
    )

    MEDICINES_DB: List[MedicineDetail] = [
        MedicineDetail(
            id="paracetamol",
            name="Paracetamol (Crocin / Calpol)",
            generic_name="Paracetamol / Acetaminophen",
            category="Pain Relief & Antipyretic",
            active_ingredients=["Acetaminophen (Paracetamol)"],
            common_uses=[
                "Temporary relief of mild to moderate body pain and headaches",
                "Reduction of fever associated with common viral illnesses",
                "Comfort management during toothaches and minor muscular aches"
            ],
            general_precautions=[
                "Check other cold or flu medications to avoid accidental duplicate intake",
                "Avoid combining with excessive alcohol consumption",
                "Ensure proper hydration when recovering from fever"
            ],
            common_side_effects=[
                "Generally well tolerated when used appropriately",
                "Rare: mild nausea or slight stomach discomfort",
                "Rare: mild allergic skin rash in sensitive individuals"
            ],
            important_warnings=[
                "Taking doses beyond maximum recommended amounts can cause serious liver toxicity",
                "Individuals with pre-existing liver disease must seek doctor guidance first",
                "Do not take multiple products containing acetaminophen at the same time"
            ],
            when_to_consult_doctor=[
                "Fever lasts longer than 3 consecutive days without improvement",
                "Pain worsens or does not subside after 5 to 7 days",
                "Development of skin rash, yellowing of eyes/skin, or unexplained nausea"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="dolo_650",
            name="Dolo-650",
            generic_name="Paracetamol (650mg)",
            category="Pain Relief & Antipyretic",
            active_ingredients=["Acetaminophen (Paracetamol)"],
            common_uses=[
                "High fever reduction during viral fever, dengue, or influenza",
                "Relief of moderate body ache, joint pain, and fever-induced headaches"
            ],
            general_precautions=[
                "Do not consume alongside Crocin, Calpol, or combination cold medicines",
                "Space doses by at least 4 to 6 hours as directed by physician",
                "Never exceed daily limits set by healthcare professionals"
            ],
            common_side_effects=[
                "Mild gastric acidity in some individuals",
                "Generally safe when taken as prescribed"
            ],
            important_warnings=[
                "Severe liver injury risk if combined with other paracetamol products or alcohol",
                "Do not take for more than 3 consecutive days without medical review"
            ],
            when_to_consult_doctor=[
                "Fever does not reduce below 101°F after 48 hours",
                "Persistent vomiting or loss of appetite"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="coldact",
            name="Coldact / Sinarest (Cold Relief)",
            generic_name="Paracetamol + Phenylephrine + Chlorpheniramine",
            category="Multi-Symptom Cold & Congestion",
            active_ingredients=["Acetaminophen (Paracetamol)", "Phenylephrine", "Chlorpheniramine"],
            common_uses=[
                "Nasal congestion, runny nose, and sneezing due to common cold or allergies",
                "Mild fever and sinus headache accompanied by head congestion"
            ],
            general_precautions=[
                "Contains Paracetamol! Do NOT take with Dolo-650 or Crocin simultaneously",
                "May cause drowsiness due to antihistamine component; avoid driving",
                "Check blood pressure if you have hypertension due to decongestant"
            ],
            common_side_effects=[
                "Drowsiness, mild dizziness, dry mouth, mild sleepiness"
            ],
            important_warnings=[
                "Accidental acetaminophen overdose is very common when taking with pain tablets",
                "Contraindicated in severe uncontrolled hypertension"
            ],
            when_to_consult_doctor=[
                "Symptoms continue beyond 7 days",
                "High fever develops or breathing difficulty occurs"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="combiflam",
            name="Combiflam",
            generic_name="Ibuprofen + Paracetamol",
            category="Combination Anti-Inflammatory & Pain Relief",
            active_ingredients=["Acetaminophen (Paracetamol)", "Ibuprofen (NSAID)"],
            common_uses=[
                "Inflammatory muscular pain, dental aches, sprains, and backache",
                "Arthritic pain flares and acute post-injury swelling"
            ],
            general_precautions=[
                "Always take after food or with milk to protect stomach lining",
                "Contains both Paracetamol and an NSAID; avoid combining with aspirin",
                "Stay well hydrated to protect renal function"
            ],
            common_side_effects=[
                "Stomach burn, nausea, acid reflux, abdominal fullness"
            ],
            important_warnings=[
                "Can irritate stomach ulcers; contraindicated in active gastric bleeding",
                "Do not take with additional paracetamol or additional NSAIDs"
            ],
            when_to_consult_doctor=[
                "Black or tarry stools, sharp stomach burning pain",
                "Noticeable fluid retention or swelling in lower legs"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="metformin",
            name="Metformin",
            generic_name="Metformin Hydrochloride",
            category="Blood Sugar Management / Biguanide",
            active_ingredients=["Metformin Hydrochloride"],
            common_uses=[
                "Helps the body utilize natural insulin more effectively",
                "Supports maintenance of healthy blood glucose levels alongside diet and exercise",
                "Foundational medication for type 2 metabolic wellness"
            ],
            general_precautions=[
                "Take with or immediately after meals to reduce stomach sensitivity",
                "Maintain adequate fluid intake throughout the day",
                "Inform healthcare team before planned surgeries or contrast dye X-ray procedures"
            ],
            common_side_effects=[
                "Temporary nausea or loose stools during early weeks",
                "Mild abdominal bloating or metallic taste"
            ],
            important_warnings=[
                "Rare risk of lactic acidosis in severe dehydration or advanced kidney impairment",
                "Do not discontinue abruptly without physician review"
            ],
            when_to_consult_doctor=[
                "Unusual muscle cramping, severe fatigue, or persistent diarrhea",
                "Extreme weakness or dizziness"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="amoxicillin",
            name="Amoxicillin",
            generic_name="Amoxicillin Trihydrate",
            category="Antibacterial / Penicillin Class",
            active_ingredients=["Amoxicillin"],
            common_uses=[
                "Treats bacterial respiratory, middle ear, throat, and dental infections",
                "Bacterial urinary tract infections confirmed by clinical testing"
            ],
            general_precautions=[
                "Always complete the full prescribed course even if symptoms resolve",
                "Does not work against viral illnesses such as the common cold or viral cough"
            ],
            common_side_effects=[
                "Mild gastrointestinal distress, loose stools, mild nausea"
            ],
            important_warnings=[
                "Contraindicated in individuals with documented penicillin allergy",
                "Incomplete courses contribute to dangerous antibiotic resistance"
            ],
            when_to_consult_doctor=[
                "Signs of allergic reaction: hives, lip/tongue swelling, breathing wheeze",
                "Severe persistent watery diarrhea"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="atorvastatin",
            name="Atorvastatin",
            generic_name="Atorvastatin Calcium",
            category="Lipid Regulator / Statin",
            active_ingredients=["Atorvastatin Calcium"],
            common_uses=[
                "Lowers LDL cholesterol and triglycerides in blood",
                "Protects vascular endothelial lining and supports heart health"
            ],
            general_precautions=[
                "Usually taken once daily at dinner time or before bed",
                "Avoid consuming large quantities of grapefruit juice",
                "Periodic routine liver and lipid enzyme checks are standard"
            ],
            common_side_effects=[
                "Mild joint or muscle discomfort, mild digestive changes"
            ],
            important_warnings=[
                "Unexplained, severe muscle pain or dark tea-colored urine requires immediate doctor consultation",
                "Not recommended during pregnancy or breastfeeding"
            ],
            when_to_consult_doctor=[
                "Severe unexplained muscle tenderness or progressive weakness",
                "Jaundice (yellowing of eyes or skin)"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="omeprazole",
            name="Omeprazole (Omez / Prilosec)",
            generic_name="Omeprazole Magnesium",
            category="Acid Reducer / Proton Pump Inhibitor",
            active_ingredients=["Omeprazole"],
            common_uses=[
                "Reduces stomach acid in gastroesophageal reflux (GERD) and heartburn",
                "Supports healing of stomach and duodenal ulcers"
            ],
            general_precautions=[
                "Best taken 30 to 60 minutes before breakfast on an empty stomach",
                "Swallow capsules whole; do not crush or chew timed-release beads"
            ],
            common_side_effects=[
                "Mild headache, abdominal gas, nausea, or transient constipation"
            ],
            important_warnings=[
                "Prolonged unmonitored use can impact magnesium and calcium absorption",
                "Do not take indefinitely without physician re-evaluation"
            ],
            when_to_consult_doctor=[
                "Difficulty or sharp pain when swallowing",
                "Persistent vomiting, vomiting resembling coffee grounds, or unexpected weight loss"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="cetirizine",
            name="Cetirizine (Cetzine / Zyrtec)",
            generic_name="Cetirizine Hydrochloride",
            category="Antihistamine / Allergy Relief",
            active_ingredients=["Cetirizine Hydrochloride"],
            common_uses=[
                "Relief of allergy symptoms including sneezing, runny nose, and itchy eyes",
                "Management of hives and allergic skin itching"
            ],
            general_precautions=[
                "May cause mild drowsiness; exercise caution when driving or operating machinery",
                "Avoid alcohol consumption while taking antihistamines"
            ],
            common_side_effects=[
                "Mild drowsiness, dry mouth, mild fatigue"
            ],
            important_warnings=[
                "Dose adjustments may be required for individuals with kidney conditions",
                "Not designed for acute severe respiratory anaphylaxis"
            ],
            when_to_consult_doctor=[
                "Allergy symptoms worsen or fail to respond after 5 days",
                "Severe throat swelling or breathing distress"
            ],
            educational_disclaimer=DISCLAIMER
        ),
        MedicineDetail(
            id="amlodipine",
            name="Amlodipine (Norvasc / Stamlo)",
            generic_name="Amlodipine Besylate",
            category="Blood Pressure Regulator / Calcium Channel Blocker",
            active_ingredients=["Amlodipine Besylate"],
            common_uses=[
                "Maintains healthy arterial blood pressure by relaxing blood vessels",
                "Helps improve blood flow to the heart"
            ],
            general_precautions=[
                "Take consistently at the same hour each day",
                "Stand up slowly from sitting or lying down to prevent lightheadedness",
                "Keep a periodic log of home blood pressure readings"
            ],
            common_side_effects=[
                "Mild swelling (edema) in ankles or feet, mild flushing, mild tiredness"
            ],
            important_warnings=[
                "Do not discontinue abruptly, as rebound blood pressure elevation can occur",
                "Never share prescription blood pressure medications"
            ],
            when_to_consult_doctor=[
                "Pronounced lightheadedness upon standing",
                "Rapid or pounding heart palpitations",
                "Significant increase in lower limb swelling"
            ],
            educational_disclaimer=DISCLAIMER
        )
    ]

    @classmethod
    def search_medicines(cls, query: Optional[str] = None) -> List[MedicineDetail]:
        if not query:
            return cls.MEDICINES_DB
        q = query.strip().lower()
        return [
            m for m in cls.MEDICINES_DB
            if q in m.name.lower() or q in m.generic_name.lower() or q in m.category.lower() or any(q in u.lower() for u in m.common_uses)
        ]

    @classmethod
    def get_by_id(cls, med_id: str) -> Optional[MedicineDetail]:
        mid = med_id.lower().strip()
        for m in cls.MEDICINES_DB:
            if m.id == mid or mid in m.name.lower():
                return m
        return None

    @classmethod
    def check_safety_combination(cls, medicine_ids: List[str]) -> MedicineSafetyCheckResponse:
        """
        Detects duplicate active ingredients and high-risk combinations.
        Specifically alerts for duplicate Acetaminophen/Paracetamol intake.
        """
        selected = [cls.get_by_id(mid) for mid in medicine_ids if cls.get_by_id(mid)]
        if len(selected) < 2:
            return MedicineSafetyCheckResponse(
                has_conflict=False,
                conflict_type="none",
                title="Single Medication Selected",
                description="Please select at least two medicines to check for duplicate ingredients or combination warnings.",
                shared_ingredients=[],
                safety_recommendation="Always follow your doctor's instructions."
            )

        # Check for shared active ingredients
        ingredient_map: Dict[str, List[str]] = {}
        for med in selected:
            for ing in med.active_ingredients:
                ingredient_map.setdefault(ing, []).append(med.name)

        duplicates = {ing: meds for ing, meds in ingredient_map.items() if len(meds) > 1}

        if duplicates:
            shared_names = list(duplicates.keys())
            med_names = ", ".join([med.name for med in selected])
            
            # Special severe warning for Paracetamol overdose
            if any("Acetaminophen" in ing or "Paracetamol" in ing for ing in shared_names):
                return MedicineSafetyCheckResponse(
                    has_conflict=True,
                    conflict_type="duplicate_ingredient",
                    title="⚠️ Critical Overdose Alert: Duplicate Paracetamol / Acetaminophen Detected!",
                    description=(
                        f"Both '{selected[0].name}' and '{selected[1].name}' contain active Paracetamol (Acetaminophen). "
                        "Taking both medications simultaneously can easily exceed the safe daily threshold of 4,000 mg, "
                        "which is the leading cause of acute liver toxicity worldwide."
                    ),
                    shared_ingredients=shared_names,
                    safety_recommendation=(
                        "Do NOT take these two medicines together without explicit physician or pharmacist authorization. "
                        "Choose only one source of fever/pain relief or consult your doctor."
                    )
                )

            return MedicineSafetyCheckResponse(
                has_conflict=True,
                conflict_type="duplicate_ingredient",
                title="⚠️ Duplicate Active Ingredient Warning",
                description=f"The selected medications share active ingredients: {', '.join(shared_names)}.",
                shared_ingredients=shared_names,
                safety_recommendation="Avoid taking duplicate active compounds to prevent accidental toxicity."
            )

        # Check for NSAID + Blood Pressure interaction
        has_nsaid = any("NSAID" in ing or "Ibuprofen" in ing for med in selected for ing in med.active_ingredients)
        has_bp = any("Amlodipine" in ing for med in selected for ing in med.active_ingredients)

        if has_nsaid and has_bp:
            return MedicineSafetyCheckResponse(
                has_conflict=True,
                conflict_type="interaction_caution",
                title="⚠️ Caution: NSAID & Blood Pressure Medication Combination",
                description=(
                    "Regular or frequent use of NSAID pain relievers (like Ibuprofen in Combiflam) can reduce "
                    "the effectiveness of blood pressure lowering medications (like Amlodipine) and stress kidney function."
                ),
                shared_ingredients=["NSAID + Calcium Channel Blocker"],
                safety_recommendation="Consult your prescribing doctor regarding alternative pain relief options if you have high blood pressure."
            )

        return MedicineSafetyCheckResponse(
            has_conflict=False,
            conflict_type="none",
            title="No Known Direct Ingredient Duplication",
            description=f"'{selected[0].name}' and '{selected[1].name}' do not share identical active compounds in our educational database.",
            shared_ingredients=[],
            safety_recommendation="Always confirm your full medication regimen with a licensed doctor or clinical pharmacist."
        )

medicine_service = MedicineService()
