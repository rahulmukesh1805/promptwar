from typing import Dict
from backend.schemas import AnalyticsStats

class AnalyticsService:
    def __init__(self):
        self.documents_processed = 142
        self.questions_answered = 618
        self.voice_interactions = 94
        self.languages_used: Dict[str, int] = {
            "English": 284,
            "Kannada": 162,
            "Hindi": 145,
            "Tamil": 98,
            "Telugu": 86,
            "Malayalam": 64,
            "Bengali": 48,
            "Marathi": 41,
        }
        self.total_latencies_ms = 450 * 520
        self.request_count = 520

    def record_document_processed(self, language: str = "English"):
        self.documents_processed += 1
        self.languages_used[language] = self.languages_used.get(language, 0) + 1

    def record_question_answered(self, is_voice: bool = False, language: str = "English"):
        self.questions_answered += 1
        if is_voice:
            self.voice_interactions += 1
        self.languages_used[language] = self.languages_used.get(language, 0) + 1

    def get_stats(self) -> AnalyticsStats:
        avg_time = int(self.total_latencies_ms / max(1, self.request_count))
        return AnalyticsStats(
            documents_processed=self.documents_processed,
            questions_answered=self.questions_answered,
            languages_used=self.languages_used,
            voice_interactions=self.voice_interactions,
            avg_response_time_ms=avg_time,
            is_demo_metrics=True
        )

    def reset_stats(self):
        self.documents_processed = 0
        self.questions_answered = 0
        self.voice_interactions = 0
        self.languages_used = {"English": 0}

analytics_service = AnalyticsService()
