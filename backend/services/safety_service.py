import re
from typing import Tuple, Optional

class SafetyService:
    DEFAULT_DISCLAIMER = (
        "HealthBridge AI provides educational information and does not replace a "
        "qualified healthcare professional."
    )
    
    EMERGENCY_NOTICE = (
        "This information may require urgent professional attention. Contact local "
        "emergency services or consult a healthcare professional immediately."
    )

    # Urgent / red-flag keywords and phrases
    URGENT_PATTERNS = [
        r"severe chest pain",
        r"crushing chest",
        r"difficulty breathing",
        r"can'?t breathe",
        r"shortness of breath",
        r"sudden numbness",
        r"face drooping",
        r"arm weakness",
        r"slurred speech",
        r"coughing (up )?blood",
        r"unconscious",
        r"suicid",
        r"severe allergic reaction",
        r"anaphylaxis",
        r"heavy bleeding",
        r"sudden loss of vision",
    ]

    # Disallowed diagnostic phrases
    DIAGNOSTIC_REPLACEMENTS = [
        (r"\b(you have|you are suffering from) diabetes\b", "these readings may indicate elevated blood glucose"),
        (r"\b(you have|you are suffering from) hypertension\b", "these readings reflect blood pressure outside the usual range"),
        (r"\b(you have|you are suffering from) an infection\b", "certain markers may suggest an inflammatory or immune response"),
        (r"\b(diagnosed with|your diagnosis is)\b", "findings that should be discussed with a doctor include"),
    ]

    @classmethod
    def check_urgency(cls, text: str) -> Tuple[bool, Optional[str]]:
        """Checks if input text contains potentially life-threatening red flags."""
        text_lower = text.lower()
        for pattern in cls.URGENT_PATTERNS:
            if re.search(pattern, text_lower):
                return True, cls.EMERGENCY_NOTICE
        return False, None

    @classmethod
    def sanitize_medical_output(cls, text: str) -> str:
        """Ensures the text avoids definitive diagnostic declarations."""
        sanitized = text
        for pattern, replacement in cls.DIAGNOSTIC_REPLACEMENTS:
            sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
        return sanitized

    @classmethod
    def get_standard_disclaimer(cls) -> str:
        return cls.DEFAULT_DISCLAIMER

safety_service = SafetyService()
