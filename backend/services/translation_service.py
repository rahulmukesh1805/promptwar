from typing import Dict, Any
from backend.schemas import SupportedLanguage, ComplexityLevel

class TranslationService:
    """
    Multilingual service tailored for Indian regional languages:
    Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali, Marathi, and English.
    """

    LANGUAGE_NAMES = {
        SupportedLanguage.EN: {"name": "English", "native": "English"},
        SupportedLanguage.HI: {"name": "Hindi", "native": "हिन्दी"},
        SupportedLanguage.KN: {"name": "Kannada", "native": "ಕನ್ನಡ"},
        SupportedLanguage.TA: {"name": "Tamil", "native": "தமிழ்"},
        SupportedLanguage.TE: {"name": "Telugu", "native": "తెలుగు"},
        SupportedLanguage.ML: {"name": "Malayalam", "native": "മലയാളം"},
        SupportedLanguage.BN: {"name": "Bengali", "native": "বাংলা"},
        SupportedLanguage.MR: {"name": "Marathi", "native": "मराठी"},
    }

    # High-quality medical explanations translated across all 8 languages for the sample report
    SAMPLE_SUMMARIES: Dict[SupportedLanguage, Dict[ComplexityLevel, str]] = {
        SupportedLanguage.EN: {
            ComplexityLevel.ME: (
                "Your report contains information about blood sugar, cholesterol, and hemoglobin. "
                "Some values for fasting sugar and cholesterol are outside the usual reference ranges. "
                "Your kidney, liver, and blood count indicators appear within standard parameters. "
                "Please discuss these results with your doctor for personalized dietary guidance."
            ),
            ComplexityLevel.FAMILY: (
                "This report shows general blood health, blood sugar, and fat levels. "
                "Overall, the basic blood cells and organ markers look stable, but the sugar and cholesterol "
                "numbers are higher than the standard target. You can help your family member prepare questions "
                "for their regular doctor about healthy food choices and routine follow-up."
            ),
            ComplexityLevel.ELDERLY: (
                "Your blood test looks mostly steady. Two numbers—sugar and cholesterol—are slightly higher than "
                "the usual benchmark. There is no need to worry. Please show this report to your doctor at your "
                "next appointment so they can advise you on gentle diet adjustments."
            ),
            ComplexityLevel.SIMPLE: (
                "Your test shows blood sugar and cholesterol are higher than normal. Blood counts and kidney numbers "
                "look fine. Share this report with your doctor to talk about healthy diet and lifestyle steps."
            ),
        },
        SupportedLanguage.KN: {
            ComplexityLevel.ME: (
                "ನಿಮ್ಮ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ (ಗ್ಲೂಕೋಸ್), ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. "
                "ಉಪವಾಸದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಿತ ಮಿತಿಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿವೆ. "
                "ಮೂತ್ರಪಿಂಡ, ಯಕೃತ್ತು ಮತ್ತು ರಕ್ತ ಕಣಗಳ ಸಂಖ್ಯೆಗಳು ಸಾಮಾನ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿವೆ. "
                "ದಯವಿಟ್ಟು ವೈಯಕ್ತಿಕ ಆಹಾರ ಸಲಹೆಗಾಗಿ ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ."
            ),
            ComplexityLevel.FAMILY: (
                "ಈ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಬ್ಬಿನ ಮಟ್ಟವನ್ನು ತೋರಿಸುತ್ತದೆ. "
                "ರಕ್ತ ಕಣಗಳು ಮತ್ತು ಅಂಗಗಳ ಕಾರ್ಯಕ್ಷಮತೆ ಸಾಮಾನ್ಯವಾಗಿವೆ, ಆದರೆ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಸಂಖ್ಯೆಗಳು ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿವೆ. "
                "ಆಹಾರ ಕ್ರಮ ಮತ್ತು ಮುಂದಿನ ತಪಾಸಣೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಕುಟುಂಬದವರಿಗೆ ಸಹಾಯ ಮಾಡಿ."
            ),
            ComplexityLevel.ELDERLY: (
                "ನಿಮ್ಮ ರಕ್ತ ತಪಾಸಣಾ ವರದಿಯು ಹೆಚ್ಚಾಗಿ ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ. ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಮಾತ್ರ ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿವೆ. "
                "ಆತಂಕಪಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಮುಂದಿನ ಭೇಟಿಯಲ್ಲಿ ಇದನ್ನು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ."
            ),
            ComplexityLevel.SIMPLE: (
                "ನಿಮ್ಮ ರಕ್ತದಲ್ಲಿ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಸಾಮಾನ್ಯ ಮಟ್ಟಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಇತರ ತಪಾಸಣೆಗಳು ಸಾಮಾನ್ಯವಾಗಿವೆ. "
                "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ ಚರ್ಚಿಸಿ."
            ),
        },
        SupportedLanguage.HI: {
            ComplexityLevel.ME: (
                "आपकी रिपोर्ट में ब्लड शुगर, कोलेस्ट्रॉल और हीमोग्लोबिन से संबंधित जानकारी है। "
                "फास्टिंग शुगर और कोलेस्ट्रॉल के कुछ मान सामान्य संदर्भ सीमा से बाहर हैं। "
                "गुर्दे, लिवर और रक्त कोशिकाओं के आंकड़े सामान्य दायरे में हैं। "
                "कृपया उचित खान-पान और मार्गदर्शन के लिए अपने डॉक्टर से परामर्श करें।"
            ),
            ComplexityLevel.FAMILY: (
                "यह रिपोर्ट रक्त शर्करा (शुगर) और कोलेस्ट्रॉल के स्तर को दर्शाती है। "
                "अन्य सभी महत्वपूर्ण अंग परीक्षण सामान्य हैं, लेकिन शुगर और कोलेस्ट्रॉल सामान्य से अधिक हैं। "
                "स्वस्थ जीवनशैली और नियमित जांच के लिए डॉक्टर से बात करने में मदद करें।"
            ),
            ComplexityLevel.ELDERLY: (
                "आपकी जांच रिपोर्ट ज्यादातर सामान्य है। बस शुगर और कोलेस्ट्रॉल थोड़ा अधिक आया है। "
                "घबराने की कोई बात नहीं है। अगली बार डॉक्टर से मिलने पर उन्हें यह रिपोर्ट जरूर दिखाएं।"
            ),
            ComplexityLevel.SIMPLE: (
                "आपके रक्त में शुगर और कोलेस्ट्रॉल सामान्य से ज्यादा है। बाकी जांच ठीक हैं। "
                "अपने डॉक्टर से मिलकर खान-पान में जरूरी बदलाव के बारे में सलाह लें।"
            ),
        },
        SupportedLanguage.TA: {
            ComplexityLevel.ME: (
                "உங்கள் பரிசோதனை அறிக்கையில் இரத்த சர்க்கரை, கொலஸ்ட்ரால் மற்றும் ஹீமோகுளோபின் விவரங்கள் உள்ளன. "
                "இரத்த சர்க்கரை மற்றும் கொலஸ்ட்ரால் அளவுகள் வழக்கமான வரம்பை விட அதிகமாக உள்ளன. "
                "சிறுநீரகம் மற்றும் கல்லீரல் அளவுகள் இயல்பாக உள்ளன. "
                "தனிப்பயனாக்கப்பட்ட உணவு ஆலோசனைகளுக்கு உங்கள் மருத்துவரிடம் கலந்தாலோசிக்கவும்."
            ),
            ComplexityLevel.FAMILY: (
                "இந்த அறிக்கை இரத்த சர்க்கரை மற்றும் கொழுப்பு அளவைக் காட்டுகிறது. "
                "உறுப்பு அளவீடுகள் சீராக உள்ளன, ஆனால் சர்க்கரை மற்றும் கொலஸ்ட்ரால் அதிகமாக உள்ளன. "
                "மருத்துவரிடம் கலந்தாலோசிக்க உங்கள் குடும்பத்தினருக்கு உதவவும்."
            ),
            ComplexityLevel.ELDERLY: (
                "உங்கள் இரத்த பரிசோதனை பெரும்பாலும் சீராக உள்ளது. சர்க்கரை மற்றும் கொலஸ்ட்ரால் சற்று அதிகமாக உள்ளது. "
                "பயப்பட வேண்டாம். அடுத்த முறை மருத்துவரை சந்திக்கும் போது இதை காண்பிக்கவும்."
            ),
            ComplexityLevel.SIMPLE: (
                "சர்க்கரை மற்றும் கொலஸ்ட்ரால் வழக்கமான அளவை விட அதிகமாக உள்ளது. மற்ற பரிசோதனைகள் இயல்பானவை. "
                "மருத்துவரை சந்தித்து ஆலோசனை பெறவும்."
            ),
        },
        SupportedLanguage.TE: {
            ComplexityLevel.ME: (
                "మీ నివేదికలో బ్లడ్ షుగర్, కొలెస్ట్రాల్ మరియు హిమోగ్లోబిన్ సమాచారం ఉంది. "
                "షుగర్ మరియు కొలెస్ట్రాల్ విలువలు సాధారణ స్థాయిల కంటే ఎక్కువగా ఉన్నాయి. "
                "కిడ్నీ, లివర్ పరీక్షలు సాధారణ పరిధిలో ఉన్నాయి. "
                "సరైన ఆహార ప్రణాళిక కోసం దయచేసి మీ వైద్యుడిని సంప్రదించండి."
            ),
            ComplexityLevel.FAMILY: (
                "ఈ నివేదిక షుగర్ మరియు కొలెస్ట్రాల్ స్థాయిలను చూపిస్తుంది. "
                "రక్త కణాలు మరియు ముఖ్యమైన అవయవాల పనితీరు బాగుంది, కానీ షుగర్ కొంచెం ఎక్కువగా ఉంది. "
                "డాక్టర్‌తో మాట్లాడటానికి మీ కుటుంబ సభ్యుడికి సహాయం చేయండి."
            ),
            ComplexityLevel.ELDERLY: (
                "మీ పరీక్షలు చాలా వరకు సాధారణంగానే ఉన్నాయి. షుగర్ మరియు కొలెస్ట్రాల్ మాత్రమే కొద్దిగా ఎక్కువగా వచ్చాయి. "
                "కంగారు పడకండి. వచ్చే అపాయింట్‌మెంట్‌లో డాక్టర్‌కి చూపించండి."
            ),
            ComplexityLevel.SIMPLE: (
                "బ్లడ్ షుగర్ మరియు కొలెస్ట్రాల్ సాధారణ పరిధి కంటే ఎక్కువగా ఉన్నాయి. "
                "ఆహార నియమాలపై మీ డాక్టర్‌తో చర్చించండి."
            ),
        },
        SupportedLanguage.ML: {
            ComplexityLevel.ME: (
                "നിങ്ങളുടെ റിപ്പോർട്ടിൽ രക്തത്തിലെ പഞ്ചസാര, കൊളസ്ട്രോൾ, ഹീമോഗ്ലോബിൻ എന്നിവയുടെ വിവരങ്ങൾ അടങ്ങിയിരിക്കുന്നു. "
                "പഞ്ചസാരയും കൊളസ്ട്രോളും സാധാരണ പരിധിയേക്കാൾ കൂടുതലാണ്. "
                "വൃക്ക, കരൾ പരിശോധനകൾ സാധാരണ നിലയിലാണ്. വ്യക്തിഗത ഭക്ഷണ ഉപദേശത്തിനായി നിങ്ങളുടെ ഡോക്ടറുമായി സംസാരിക്കുക."
            ),
            ComplexityLevel.FAMILY: (
                "ഈ റിപ്പോർട്ട് ഷുഗർ, കൊളസ്ട്രോൾ എന്നിവ കാണിക്കുന്നു. മറ്റ് അവയവ പരിശോധനകൾ സാധാരണമാണ്. "
                "ഡോക്ടറെ കാണുമ്പോൾ ചോദിക്കേണ്ട കാര്യങ്ങൾ തയ്യാറാക്കാൻ സഹായിക്കുക."
            ),
            ComplexityLevel.ELDERLY: (
                "നിങ്ങളുടെ റിപ്പോർട്ട് വലിയതോതിൽ സാധാരണമാണ്. ഷുഗറും കൊളസ്ട്രോളും മാത്രമാണ് അല്പം കൂടുതൽ. "
                "പേടിക്കേണ്ടതില്ല, അടുത്ത തവണ ഡോക്ടറെ കാണുമ്പോൾ കാണിക്കുക."
            ),
            ComplexityLevel.SIMPLE: (
                "ഷുഗറും കൊളസ്ട്രോളും സാധാരണയേക്കാൾ കൂടുതലാണ്. ശരിയായ ഭക്ഷണക്രമത്തിനായി ഡോക്ടറുമായി സംസാരിക്കുക."
            ),
        },
        SupportedLanguage.BN: {
            ComplexityLevel.ME: (
                "আপনার রিপোর্টে ব্লাড সুগার, কোলেস্টেরল এবং হিমোগ্লোবিনের তথ্য রয়েছে। "
                "ফাস্টিং সুগার এবং কোলেস্টেরলের মাত্রা স্বাভাবিক সীমার বাইরে রয়েছে। "
                "কিডনি ও লিভারের মাত্রা স্বাভাবিক। বিস্তারিত পরামর্শের জন্য আপনার চিকিৎসকের সাথে কথা বলুন।"
            ),
            ComplexityLevel.FAMILY: (
                "এই রিপোর্টটি রক্তে শর্করা এবং চর্বির মাত্রা নির্দেশ করে। "
                "সুগার এবং কোলেস্টেরল কিছুটা বেশি, বাকি অঙ্গের পরীক্ষাগুলি স্বাভাবিক। চিকিৎসকের সাথে পরামর্শের প্রস্তুতি নিন।"
            ),
            ComplexityLevel.ELDERLY: (
                "আপনার পরীক্ষার ফলাফল বেশিরভাগই স্বাভাবিক। শুধু সুগার এবং কোলেস্টেরল সামান্য বেশি। "
                "উদ্বেগের কিছু নেই, পরবর্তী সাক্ষাতে ডাক্তারবাবুকে এটি দেখাবেন।"
            ),
            ComplexityLevel.SIMPLE: (
                "সুগার ও কোলেস্টেরল স্বাভাবিকের চেয়ে বেশি। ডাক্তারের সাথে খাবার ও জীবনযাত্রার বিষয়ে কথা বলুন।"
            ),
        },
        SupportedLanguage.MR: {
            ComplexityLevel.ME: (
                "तुमच्या अहवालामध्ये रक्तातील साखर, कोलेस्ट्रॉल आणि हिमोग्लोबिनची माहिती आहे. "
                "उपाशीपोटी साखर आणि कोलेस्ट्रॉल सामान्य मर्यादेपेक्षा जास्त आहेत. "
                "मूत्रपिंड आणि यकृत चाचण्या सामान्य आहेत. योग्य आहाराच्या मार्गदर्शनासाठी कृपया डॉक्टरांचा सल्ला घ्या."
            ),
            ComplexityLevel.FAMILY: (
                "हा अहवाल रक्तातील साखर आणि चरबीचे प्रमाण दर्शवतो. "
                "इतर सर्व मुख्य चाचण्या सामान्य आहेत, फक्त साखर आणि कोलेस्ट्रॉल जास्त आहे. डॉक्टरांशी चर्चा करण्यास मदत करा."
            ),
            ComplexityLevel.ELDERLY: (
                "तुमचा अहवाल मुख्यत्वे सामान्य आहे. फक्त साखर आणि कोलेस्ट्रॉल किंचित जास्त आहे. "
                "काळजी करू नका, पुढील भेटीमध्ये हे डॉक्टरांना दाखवा."
            ),
            ComplexityLevel.SIMPLE: (
                "रक्तातील साखर आणि कोलेस्ट्रॉल नेहमीच्या मर्यादेपेक्षा जास्त आहेत. आहारातील बदलांसाठी डॉक्टरांशी बोला."
            ),
        },
    }

    QUESTIONS_BY_LANGUAGE = {
        SupportedLanguage.EN: [
            "What do these fasting blood sugar and HbA1c levels mean for me?",
            "Do I need to repeat this lipid profile test after a specific period?",
            "Are there dietary or physical activity changes I should begin making?",
            "Should we monitor my blood pressure and weight regularly?",
        ],
        SupportedLanguage.KN: [
            "ನನ್ನ ಉಪವಾಸದ ರಕ್ತದ ಸಕ್ಕರೆ ಮತ್ತು HbA1c ಮಟ್ಟಗಳ ಅರ್ಥವೇನು?",
            "ನಾನು ಎಷ್ಟು ಸಮಯದ ನಂತರ ಈ ಕೊಲೆಸ್ಟ್ರಾಲ್ ಪರೀಕ್ಷೆಯನ್ನು ಪುನರಾವರ್ತಿಸಬೇಕು?",
            "ನಾನು ಯಾವ ರೀತಿಯ ಆಹಾರ ಮತ್ತು ವ್ಯಾಯಾಮ ಬದಲಾವಣೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಬೇಕು?",
            "ನಾನು ರಕ್ತದೊತ್ತಡ ಮತ್ತು ತೂಕವನ್ನು ನಿಯಮಿತವಾಗಿ ಗಮನಿಸಬೇಕೇ?",
        ],
        SupportedLanguage.HI: [
            "फास्टिंग ब्लड शुगर और HbA1c के इस स्तर का मेरे स्वास्थ्य पर क्या प्रभाव हो सकता है?",
            "क्या मुझे कुछ समय बाद यह लिपिड प्रोफाइल टेस्ट दोबारा कराने की आवश्यकता है?",
            "मुझे अपने खान-पान और दिनचर्या में कौन से बदलाव करने चाहिए?",
            "क्या मुझे नियमित रूप से ब्लड प्रेशर और वजन की निगरानी करनी चाहिए?",
        ],
        SupportedLanguage.TA: [
            "இந்த இரத்த சர்க்கரை மற்றும் HbA1c அளவுகள் எனது உடல்நலத்திற்கு என்ன குறிக்கின்றன?",
            "நான் குறிப்பிட்ட காலத்திற்குப் பிறகு இந்த கொலஸ்ட்ரால் பரிசோதனையை மீண்டும் செய்ய வேண்டுமா?",
            "நான் என்ன உணவு மற்றும் உடற்பயிற்சி மாற்றங்களை தொடங்க வேண்டும்?",
            "எனது இரத்த அழுத்தம் மற்றும் எடையை தொடர்ந்து கண்காணிக்க வேண்டுமா?",
        ],
        SupportedLanguage.TE: [
            "నా ఫాస్టింగ్ బ్లడ్ షుగర్ మరియు HbA1c స్థాయిల అర్థం ఏమిటి?",
            "కొంత సమయం తర్వాత నేను ఈ లిపిడ్ ప్రొఫైల్ పరీక్షను మళ్లీ చేయించాలా?",
            "నేను ఆహారం మరియు శారీరక వ్యాయామాలలో ఎలాంటి మార్పులు చేసుకోవాలి?",
            "నేను రక్తపోటు మరియు బరువును క్రమం తప్పకుండా పర్యవేక్షించాలా?",
        ],
        SupportedLanguage.ML: [
            "എന്റെ ഫാസ്റ്റിംഗ് ബ്ലഡ് ഷുഗറും HbA1c അളവുകളും എന്താണ് അർത്ഥമാക്കുന്നത്?",
            "കുറച്ചു നാളുകൾക്ക് ശേഷം ഞാൻ ഈ കൊളസ്ട്രോൾ പരിശോധന വീണ്ടും ആവർത്തിക്കണമോ?",
            "ഭക്ഷണക്രമത്തിലും വ്യായാമത്തിലും ഞാൻ എന്തൊക്കെ മാറ്റങ്ങൾ വരുത്തണം?",
            "രക്തസമ്മർദ്ദവും ശരീരഭാരവും പതിവായി നിരീക്ഷിക്കേണ്ടതുണ്ടോ?",
        ],
        SupportedLanguage.BN: [
            "আমার ফাস্টিং সুগার এবং HbA1c পরিমাপের অর্থ কী?",
            "আমাকে কি কিছুদিন পর এই লিপিড প্রোফাইল পরীক্ষা আবার করাতে হবে?",
            "আমার খাদ্যতালিকা ও শরীরচর্চায় কী ধরনের পরিবর্তন আনা উচিত?",
            "আমার কি নিয়মিত রক্তচাপ ও ওজন মাপা দরকার?",
        ],
        SupportedLanguage.MR: [
            "माझ्या फास्टिंग शुगर आणि HbA1c पातळीचा नेमका अर्थ काय आहे?",
            "मला काही काळानंतर ही लिपिड प्रोफाइल चाचणी पुन्हा करावी लागेल का?",
            "मी आहारात आणि व्यायामात कोणते बदल करणे आवश्यक आहे?",
            "मी नियमितपणे रक्तदाब आणि वजनाची नोंद ठेवली पाहिजे का?",
        ],
    }

    KEY_TERMS_BY_LANGUAGE = {
        SupportedLanguage.KN: [
            {"term": "HbA1c (ಗ್ಲೈಕೇಟೆಡ್ ಹಿಮೋಗ್ಲೋಬಿನ್)", "simple_explanation": "ಕಳೆದ 2 ರಿಂದ 3 ತಿಂಗಳುಗಳಲ್ಲಿ ನಿಮ್ಮ ಸರಾಸರಿ ರಕ್ತದ ಸಕ್ಕರೆ ಮಟ್ಟವನ್ನು ಅಳೆಯುವ ಪರೀಕ್ಷೆ."},
            {"term": "ಹಿಮೋಗ್ಲೋಬಿನ್ (Hemoglobin)", "simple_explanation": "ನಿಮ್ಮ ದೇಹದಾದ್ಯಂತ ಆಮ್ಲಜನಕವನ್ನು ಸಾಗಿಸುವ ಕೆಂಪು ರಕ್ತ ಕಣಗಳಲ್ಲಿನ ಪ್ರಮುಖ ಪ್ರೋಟೀನ್."},
            {"term": "ಕೊಲೆಸ್ಟ್ರಾಲ್ (Total Cholesterol)", "simple_explanation": "ರಕ್ತದಲ್ಲಿರುವ ಕೊಬ್ಬಿನಂತಹ ಅಂಶ. ಕೋಶಗಳ ನಿರ್ಮಾಣಕ್ಕೆ ಇದು ಅಗತ್ಯ, ಆದರೆ ಹೆಚ್ಚಾದರೆ ರಕ್ತನಾಳಗಳಲ್ಲಿ ತಡೆ ಉಂಟುಮಾಡಬಹುದು."},
            {"term": "ಸೀರಮ್ ಕ್ರಿಯೇಟಿನೈನ್ (Serum Creatinine)", "simple_explanation": "ಮೂತ್ರಪಿಂಡಗಳು ರಕ್ತವನ್ನು ಎಷ್ಟು ಚೆನ್ನಾಗಿ ಶುದ್ಧೀಕರಿಸುತ್ತಿವೆ ಎಂಬುದನ್ನು ಸೂಚಿಸುವ ತ್ಯಾಜ್ಯ ವಸ್ತು."},
        ],
        SupportedLanguage.HI: [
            {"term": "HbA1c (ग्लाइकेटेड हीमोग्लोबिन)", "simple_explanation": "यह परीक्षण पिछले 2 से 3 महीनों में आपके औसत ब्लड शुगर का स्तर दर्शाता है।"},
            {"term": "हीमोग्लोबिन (Hemoglobin)", "simple_explanation": "लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो पूरे शरीर में ऑक्सीजन पहुंचाने का काम करता है।"},
            {"term": "कोलेस्ट्रॉल (Total Cholesterol)", "simple_explanation": "रक्त में पाया जाने वाला मोम जैसा वसा। कोशिकाओं के लिए जरूरी है, लेकिन अधिक होने पर सतर्कता आवश्यक है।"},
            {"term": "सीरम क्रिएटिनिन (Creatinine)", "simple_explanation": "मांसपेशियों से निकलने वाला अपशिष्ट पदार्थ, जो बताता है कि गुर्दे (किडनी) कितना बेहतर काम कर रहे हैं।"},
        ],
    }

    @classmethod
    def get_summary(cls, lang: SupportedLanguage, complexity: ComplexityLevel) -> str:
        lang_data = cls.SAMPLE_SUMMARIES.get(lang, cls.SAMPLE_SUMMARIES[SupportedLanguage.EN])
        return lang_data.get(complexity, lang_data[ComplexityLevel.ME])

    @classmethod
    def get_doctor_questions(cls, lang: SupportedLanguage) -> list:
        return cls.QUESTIONS_BY_LANGUAGE.get(lang, cls.QUESTIONS_BY_LANGUAGE[SupportedLanguage.EN])

    @classmethod
    def get_key_terms(cls, lang: SupportedLanguage) -> list:
        return cls.KEY_TERMS_BY_LANGUAGE.get(lang, None)

translation_service = TranslationService()
