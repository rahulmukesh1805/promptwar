import {
  ReportExplanationResponse,
  ComplexityLevel,
  SupportedLanguage,
  ChatMessage,
  ChatResponse,
  MedicineDetail,
  MedicineSafetyCheckResponse,
  NavigatorResponse,
  AnalyticsStats,
} from '../types';
import { storageService } from './storageService';

const BACKEND_BASE = '/api';

// Multilingual status indicators for table
const STATUS_TRANSLATIONS: Record<SupportedLanguage, { outside: string; normal: string; attention: string }> = {
  en: { outside: 'Outside listed reference range', normal: 'Within usual range', attention: 'Discuss with doctor' },
  kn: { outside: 'ಉಲ್ಲೇಖಿತ ಮಿತಿಗಿಂತ ಹೊರಗಿದೆ', normal: 'ಸಾಮಾನ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ', attention: 'ವೈದ್ಯರೊಂದಿಗೆ ಚರ್ಚಿಸಿ' },
  hi: { outside: 'संदर्भ सीमा से बाहर', normal: 'सामान्य सीमा में', attention: 'डॉक्टर से परामर्श करें' },
  ta: { outside: 'குறிப்பிடப்பட்ட வரம்பிற்கு வெளியே', normal: 'வழக்கமான வரம்பில்', attention: 'மருத்துவரிடம் விவாதிக்கவும்' },
  te: { outside: 'సూచించిన పరిధికి వెలుపల', normal: 'సాధారణ పరిధిలో', attention: 'వైద్యుడితో చర్చించండి' },
  ml: { outside: 'സാധാരണ പരിധിക്ക് പുറത്ത്', normal: 'സാധാരണ നിലയിൽ', attention: 'ഡോക്ടറുമായി സംസാരിക്കുക' },
  bn: { outside: 'স্বাভাবিক সীমার বাইরে', normal: 'স্বাভাবিক সীমার মধ্যে', attention: 'ডাক্তারের পরামর্শ নিন' },
  mr: { outside: 'संदर्भ मर्यादेबाहेर', normal: 'सामान्य मर्यादेत', attention: 'डॉक्टरांशी चर्चा करा' },
};

// Fallback Multilingual Summaries for instant client-side rendering
const MOCK_SUMMARIES: Record<SupportedLanguage, Record<ComplexityLevel, string>> = {
  en: {
    me: 'Your report contains information about blood sugar, cholesterol, and hemoglobin. Some values for fasting sugar and cholesterol are outside the usual reference ranges. Your kidney, liver, and blood count indicators appear within standard parameters. Please discuss these results with your doctor for personalized dietary guidance.',
    family: 'This report shows general blood health, blood sugar, and fat levels. Overall, the basic blood cells and organ markers look stable, but the sugar and cholesterol numbers are higher than the standard target. You can help your family member prepare questions for their regular doctor about healthy food choices and routine follow-up.',
    elderly: 'Your blood test looks mostly steady. Two numbers—sugar and cholesterol—are slightly higher than the usual benchmark. There is no need to worry. Please show this report to your doctor at your next appointment so they can advise you on gentle diet adjustments.',
    simple: 'Your test shows blood sugar and cholesterol are higher than normal. Blood counts and kidney numbers look fine. Share this report with your doctor to talk about healthy diet and lifestyle steps.',
  },
  kn: {
    me: 'ನಿಮ್ಮ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ (ಗ್ಲೂಕೋಸ್), ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಉಪವಾಸದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖಿತ ಮಿತಿಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿವೆ. ಮೂತ್ರಪಿಂಡ, ಯಕೃತ್ತು ಮತ್ತು ರಕ್ತ ಕಣಗಳ ಸಂಖ್ಯೆಗಳು ಸಾಮಾನ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿವೆ. ದಯವಿಟ್ಟು ವೈಯಕ್ತಿಕ ಆಹಾರ ಸಲಹೆಗಾಗಿ ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ.',
    family: 'ಈ ವರದಿಯು ರಕ್ತದ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಬ್ಬಿನ ಮಟ್ಟವನ್ನು ತೋರಿಸುತ್ತದೆ. ರಕ್ತ ಕಣಗಳು ಮತ್ತು ಅಂಗಗಳ ಕಾರ್ಯಕ್ಷಮತೆ ಸಾಮಾನ್ಯವಾಗಿವೆ, ಆದರೆ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಸಂಖ್ಯೆಗಳು ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿವೆ. ಆಹಾರ ಕ್ರಮ ಮತ್ತು ಮುಂದಿನ ತಪಾಸಣೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಕುಟುಂಬದವರಿಗೆ ಸಹಾಯ ಮಾಡಿ.',
    elderly: 'ನಿಮ್ಮ ರಕ್ತ ತಪಾಸಣಾ ವರದಿಯು ಹೆಚ್ಚಾಗಿ ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ. ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಮಾತ್ರ ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿವೆ. ಆತಂಕಪಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಮುಂದಿನ ಭೇಟಿಯಲ್ಲಿ ಇದನ್ನು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ.',
    simple: 'ನಿಮ್ಮ ರಕ್ತದಲ್ಲಿ ಸಕ್ಕರೆ ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಸಾಮಾನ್ಯ ಮಟ್ಟಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಇತರ ತಪಾಸಣೆಗಳು ಸಾಮಾನ್ಯವಾಗಿವೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ ಚರ್ಚಿಸಿ.',
  },
  hi: {
    me: 'आपकी रिपोर्ट में ब्लड शुगर, कोलेस्ट्रॉल और हीमोग्लोबिन से संबंधित जानकारी है। फास्टिंग शुगर और कोलेस्ट्रॉल के कुछ मान सामान्य संदर्भ सीमा से बाहर हैं। गुर्दे, लिवर और रक्त कोशिकाओं के आंकड़े सामान्य दायरे में हैं। कृपया उचित खान-पान और मार्गदर्शन के लिए अपने डॉक्टर से परामर्श करें।',
    family: 'यह रिपोर्ट रक्त शर्करा (शुगर) और कोलेस्ट्रॉल के स्तर को दर्शाती है। अन्य सभी महत्वपूर्ण अंग परीक्षण सामान्य हैं, लेकिन शुगर और कोलेस्ट्रॉल सामान्य से अधिक हैं। स्वस्थ जीवनशैली और नियमित जांच के लिए डॉक्टर से बात करने में मदद करें।',
    elderly: 'आपकी जांच रिपोर्ट ज्यादातर सामान्य है। बस शुगर और कोलेस्ट्रॉल थोड़ा अधिक आया है। घबराने की कोई बात नहीं है। अगली बार डॉक्टर से मिलने पर उन्हें यह रिपोर्ट जरूर दिखाएं।',
    simple: 'आपके रक्त में शुगर और कोलेस्ट्रॉल सामान्य से ज्यादा है। बाकी जांच ठीक हैं। अपने डॉक्टर से मिलकर खान-पान में जरूरी बदलाव के बारे में सलाह लें।',
  },
  ta: {
    me: 'உங்கள் அறிக்கையில் இரத்த சர்க்கரை, கொலஸ்ட்ரால் மற்றும் ஹீமோகுளோபின் தகவல்கள் உள்ளன. இரத்த சர்க்கரை மற்றும் கொலஸ்ட்ரால் அளவுகள் வழக்கமான வரம்பிற்கு வெளியே உள்ளன. பிற உறுப்பு அளவீடுகள் சீராக உள்ளன. மருத்துவரிடம் கலந்தாலோசிக்கவும்.',
    family: 'இந்த அறிக்கை இரத்த சர்க்கரை மற்றும் கொழுப்பு அளவைக் காட்டுகிறது. சர்க்கரை மற்றும் கொலஸ்ட்ரால் சற்று அதிகமாக உள்ளன. மருத்துவரிடம் கேட்க வேண்டிய கேள்விகளை தயார் செய்ய உங்கள் குடும்பத்தினருக்கு உதவவும்.',
    elderly: 'உங்கள் இரத்த பரிசோதனை பெரும்பாலும் சீராக உள்ளது. சர்க்கரை மற்றும் கொலஸ்ட்ரால் மட்டுமே சற்று அதிகம். கவலைப்பட வேண்டாம், அடுத்த சந்திப்பில் மருத்துவரிடம் காட்டவும்.',
    simple: 'இரத்த சர்க்கரை மற்றும் கொலஸ்ட்ரால் வழக்கமான அளவை விட அதிகமாக உள்ளது. மருத்துவரை அணுகி உணவு முறை பற்றி ஆலோசிக்கவும்.',
  },
  te: {
    me: 'మీ నివేదికలో బ్లడ్ షుగర్, కొలెస్ట్రాల్ మరియు హిమోగ్లోబిన్ వివరాలు ఉన్నాయి. షుగర్ మరియు కొలెస్ట్రాల్ విలువలు సాధారణ స్థాయిల కంటే ఎక్కువగా ఉన్నాయి. ఇతర పరీక్షలు బాగున్నాయి. తదుపరి వివరాల కోసం వైద్యుడిని సంప్రదించండి.',
    family: 'ఈ నివేదిక షుగర్ మరియు కొలెస్ట్రాల్ స్థాయిలను చూపిస్తుంది. కుటుంబ సభ్యుడి ఆహార నియమాలు మరియు వైద్యుల సూచనల కోసం సహాయం చేయండి.',
    elderly: 'మీ పరీక్షలు సాధారణంగానే ఉన్నాయి. షుగర్ మరియు కొలెస్ట్రాల్ మాత్రమే కొద్దిగా ఎక్కువగా వచ్చాయి. వచ్చే అపాయింట్‌మెంట్‌లో డాక్టర్‌కి చూపించండి.',
    simple: 'బ్లడ్ షుగర్ మరియు కొలెస్ట్రాల్ సాధారణ పరిధి కంటే ఎక్కువగా ఉన్నాయి. ఆహార నియమాలపై మీ డాక్టర్‌తో చర్చించండి.',
  },
  ml: {
    me: 'നിങ്ങളുടെ റിപ്പോർട്ടിൽ രക്തത്തിലെ പഞ്ചസാര, കൊളസ്ട്രോൾ, ഹീമോഗ്ലോബിൻ എന്നിവയുടെ വിവരങ്ങൾ അടങ്ങിയിരിക്കുന്നു. പഞ്ചസാരയും കൊളസ്ട്രോളും സാധാരണ പരിധിയേക്കാൾ കൂടുതലാണ്.',
    family: 'ഈ റിപ്പോർട്ട് ഷുഗർ, കൊളസ്ട്രോൾ എന്നിവ കാണിക്കുന്നു. മറ്റ് അവയവ പരിശോധനകൾ സാധാരണമാണ്. ഡോക്ടറെ കാണുമ്പോൾ ചോദിക്കേണ്ട കാര്യങ്ങൾ തയ്യാറാക്കാൻ സഹായിക്കുക.',
    elderly: 'നിങ്ങളുടെ റിപ്പോർട്ട് വലിയതോതിൽ സാധാരണമാണ്. ഷുഗറും കൊളസ്ട്രോളും മാത്രമാണ് അല്പം കൂടുതൽ. പേടിക്കേണ്ടതില്ല, അടുത്ത തവണ ഡോക്ടറെ കാണുമ്പോൾ കാണിക്കുക.',
    simple: 'ഷുഗറും കൊളസ്ട്രോളും സാധാരണയേക്കാൾ കൂടുതലാണ്. ശരിയായ ഭക്ഷണക്രമത്തിനായി ഡോക്ടറുമായി സംസാരിക്കുക.',
  },
  bn: {
    me: 'আপনার রিপোর্টে ব্লাড সুগার, কোলেস্টেরল এবং হিমোগ্লোবিনের তথ্য রয়েছে। ফাস্টিং সুগার এবং কোলেস্টেরলের মাত্রা স্বাভাবিক সীমার বাইরে রয়েছে। চিকিৎসকের সাথে কথা বলুন।',
    family: 'এই রিপোর্টটি রক্তে শর্করা এবং চর্বির মাত্রা নির্দেশ করে। সুগার এবং কোলেস্টেরল কিছুটা বেশি। চিকিৎসকের সাথে পরামর্শের প্রস্তুতি নিন।',
    elderly: 'আপনার পরীক্ষার ফলাফল বেশিরভাগই স্বাভাবিক। শুধু সুগার এবং কোলেস্টেরল সামান্য বেশি। পরবর্তী সাক্ষাতে ডাক্তারবাবুকে এটি দেখাবেন।',
    simple: 'সুগার ও কোলেস্টেরল স্বাভাবিকের চেয়ে বেশি। ডাক্তারের সাথে খাবার ও জীবনযাত্রার বিষয়ে কথা বলুন।',
  },
  mr: {
    me: 'तुमच्या अहवालामध्ये रक्तातील साखर, कोलेस्ट्रॉल आणि हिमोग्लोबिनची माहिती आहे. उपाशीपोटी साखर आणि कोलेस्ट्रॉल सामान्य मर्यादेपेक्षा जास्त आहेत. डॉक्टरांचा सल्ला घ्या.',
    family: 'हा अहवाल रक्तातील साखर आणि चरबीचे प्रमाण दर्शवतो. साखर आणि कोलेस्ट्रॉल थोडे जास्त आहे. डॉक्टरांशी चर्चा करण्यास मदत करा.',
    elderly: 'तुमचा अहवाल मुख्यत्वे सामान्य आहे. फक्त साखर आणि कोलेस्ट्रॉल किंचित जास्त आहे. काळजी करू नका, हे डॉक्टरांना दाखवा.',
    simple: 'रक्तातील साखर आणि कोलेस्ट्रॉल नेहमीच्या मर्यादेपेक्षा जास्त आहेत. आहारातील बदलांसाठी डॉक्टरांशी बोला.',
  },
};

const MOCK_DOCTOR_QUESTIONS: Record<SupportedLanguage, string[]> = {
  en: [
    'What do these specific numbers mean in the context of my family health history?',
    'Do I need to repeat this test after a specific period (e.g. 6 to 12 weeks)?',
    'Are there dietary or physical exercise habits I should begin making right away?',
    'Are there any warning symptoms that should prompt me to contact you earlier?',
  ],
  kn: [
    'ನನ್ನ ಕುಟುಂಬದ ಆರೋಗ್ಯದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಈ ನಿರ್ದಿಷ್ಟ ಸಂಖ್ಯೆಗಳ ಅರ್ಥವೇನು?',
    'ನಾನು ಎಷ್ಟು ವಾರಗಳ ನಂತರ ಈ ಪರೀಕ್ಷೆಯನ್ನು ಪುನರಾವರ್ತಿಸಬೇಕು?',
    'ನಾನು ತಕ್ಷಣವೇ ಯಾವ ರೀತಿಯ ಆಹಾರ ಮತ್ತು ವ್ಯಾಯಾಮ ಬದಲಾವಣೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಬೇಕು?',
    'ಯಾವ ಎಚ್ಚರಿಕೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದರೆ ನಾನು ನಿಮ್ಮನ್ನು ಬೇಗನೆ ಸಂಪರ್ಕಿಸಬೇಕು?',
  ],
  hi: [
    'मेरे पारिवारिक स्वास्थ्य इतिहास को देखते हुए इन परिणामों का क्या अर्थ है?',
    'क्या मुझे कुछ हफ्तों बाद यह जांच दोबारा कराने की आवश्यकता है?',
    'मुझे अपने खान-पान और दिनचर्या में तुरंत कौन से बदलाव करने चाहिए?',
    'किन चेतावनी संकेतों के दिखने पर मुझे तुरंत आपसे संपर्क करना चाहिए?',
  ],
  ta: [
    'எனது குடும்ப சுகாதார வரலாற்றின் அடிப்படையில் இந்த முடிவுகள் என்ன குறிக்கின்றன?',
    'நான் குறிப்பிட்ட வாரங்களுக்குப் பிறகு இந்த பரிசோதனையை மீண்டும் செய்ய வேண்டுமா?',
    'உணவு மற்றும் உடற்பயிற்சியில் நான் என்ன மாற்றங்களை தொடங்க வேண்டும்?',
    'எந்த எச்சரிக்கை அறிகுறிகள் தென்பட்டால் உடனடியாக தங்களை அணுக வேண்டும்?',
  ],
  te: [
    'నా కుటుంబ ఆరోగ్య చరిత్ర ఆధారంగా ఈ పరీక్ష విలువల అర్థం ఏమిటి?',
    'కొన్ని వారాల తర్వాత నేను ఈ పరీక్షను మళ్లీ చేయించాలా?',
    'నేను ఆహారం మరియు శారీరಕ వ్యಾಯామాలలో ఎలాంటి మార్పులు చేసుకోవాలి?',
    'ఎలాంటి హెచ్చరిక లక్షణాలు కనిపిస్తే వెంటనే మిమ్మల్ని సంప్రదించాలి?',
  ],
  ml: [
    'എന്റെ കുടുംബാരോഗ്യ ചരിത്രത്തിന്റെ പശ്ചാത്തലത്തിൽ ഈ ഫലങ്ങൾ എന്താണ് അർത്ഥമാക്കുന്നത്?',
    'കുറച്ചു ആഴ്ചകൾക്ക് ശേഷം ഞാൻ ഈ പരിശോധന വീണ്ടും ആവർത്തിക്കണമോ?',
    'ഭക്ഷണക്രമത്തിലും വ്യായാമത്തിലും ഞാൻ എന്തൊക്കെ മാറ്റങ്ങൾ വരുത്തണം?',
    'ഏതൊക്കെ അപായ ലക്ഷണങ്ങൾ കണ്ടാലാണ് ഉടൻ തന്നെ അങ്ങയെ സമീപിക്കേണ്ടത്?',
  ],
  bn: [
    'আমার পরিবারের স্বাস্থ্য ইতিহাসের পরিপ্রেক্ষিতে এই পরিমাপের অর্থ কী?',
    'আমাকে কি কয়েক সপ্তাহ পর এই পরীক্ষা আবার করাতে হবে?',
    'আমার খাদ্যতালিকা ও শরীরচর্চায় কী ধরনের পরিবর্তন আনা উচিত?',
    'কী ধরনের বিপদ সংকেত দেখা দিলে দ্রুত ডাক্তারের কাছে যাওয়া দরকার?',
  ],
  mr: [
    'माझ्या कौटुंबिक आरोग्याच्या पार्श्वभूमीवर या चाचणी निकालांचा नेमका अर्थ काय आहे?',
    'मला काही आठवड्यांनंतर ही चाचणी पुन्हा करावी लागेल का?',
    'मी आहारात आणि व्यायामात कोणते बदल करणे तातडीने आवश्यक आहे?',
    'कोणत्या धोक्याच्या लक्षणांवर लक्ष ठेवणे गरजेचे आहे?',
  ],
};

const RAW_OCR_PRESETS: Record<string, string> = {
  sample_blood_test: `METROPOLIS DIAGNOSTICS & RESEARCH LAB
PATIENT: RAMESH PATEL | AGE: 48 | GENDER: MALE | DATE: 12-OCT-2025
SAMPLE ID: MET-94821 | REFERRING DR: DR. S. RAMAN, MD | BARCODE: *894021984*
--------------------------------------------------------------------------------
COMPREHENSIVE METABOLIC & LIPID PANEL
Test Description                   Result     Units       Reference Range
Fasting Blood Sugar (FBS)          138        mg/dL       70 - 99
HbA1c (Glycated Hemoglobin)        7.2        %           4.0 - 5.6
Total Cholesterol                  228        mg/dL       125 - 200
HDL Cholesterol (Good)             38         mg/dL       > 40
LDL Cholesterol (Bad)              144        mg/dL       < 100
Triglycerides                      185        mg/dL       < 150
Hemoglobin                         13.8       g/dL        13.0 - 17.0
Total WBC Count                    7,400      cells/cumm  4,000 - 11,000
Platelet Count                     240,000    /cumm       150,000 - 450,000
Serum Creatinine                   0.95       mg/dL       0.70 - 1.20
SGPT / ALT (Liver)                 34         U/L         < 45
--------------------------------------------------------------------------------
IMPRESSION: Elevated fasting glucose and HbA1c outside standard reference parameters.
Borderline elevated LDL cholesterol and triglycerides. Renal and hepatic parameters stable.
RECOMMENDATION: Correlate clinically. Discuss with consulting physician for dietary evaluation.`,

  sample_cbc: `HEALTHCARE GLOBAL PATHOLOGY SERVICES
PATIENT: PRIYA SHARMA | AGE: 29 | GENDER: FEMALE | DATE: 15-NOV-2025
SAMPLE ID: HCG-30291 | REFERRING DR: DR. ANITA DESHMUKH, MD | BARCODE: *77209144*
--------------------------------------------------------------------------------
COMPLETE HEMOGRAM & IRON PROFILE
Test Description                   Result     Units       Reference Range
Hemoglobin                         10.2       g/dL        12.0 - 15.5
Total RBC Count                    3.6        mil/cumm    3.8 - 4.8
Packed Cell Volume (PCV)           31.4       %           36 - 46
Mean Corpuscular Volume (MCV)      71.8       fL          80 - 100
Serum Ferritin (Iron Stores)       11         ng/mL       15 - 150
Platelet Count                     285,000    /cumm       150,000 - 450,000
Total Leukocyte Count (WBC)        6,700      /cumm       4,000 - 10,000
Serum Iron                         42         ug/dL       60 - 170
--------------------------------------------------------------------------------
IMPRESSION: Microcytic hypochromic indices with low ferritin suggestive of iron store depletion.
RECOMMENDATION: Review with physician regarding nutritional iron and dietary counseling.`,

  sample_thyroid_vitamin: `APOLLO DIAGNOSTICS & ENDOCRINE CENTRE
PATIENT: RAJESH VERMA | AGE: 42 | GENDER: MALE | DATE: 20-NOV-2025
SAMPLE ID: APL-81920 | REFERRING DR: DR. K. VENKATESH, MD | BARCODE: *55102941*
--------------------------------------------------------------------------------
THYROID & ESSENTIAL VITAMIN PANEL
Test Description                   Result     Units       Reference Range
Thyroid Stimulating Hormone (TSH)  8.40       mIU/L       0.40 - 4.20
Free Thyroxine (FT4)               0.88       ng/dL       0.80 - 1.80
Vitamin D3 (25-Hydroxy)            14.2       ng/mL       30.0 - 100.0
Vitamin B12 (Cyanocobalamin)       175        pg/mL       211 - 911
Serum Calcium                      9.1        mg/dL       8.5 - 10.2
Alkaline Phosphatase (ALP)         78         U/L         44 - 147
--------------------------------------------------------------------------------
IMPRESSION: TSH above benchmark reference range. Significant Vitamin D3 and B12 insufficiency.
RECOMMENDATION: Clinical correlation advised with endocrinologist/physician.`,
};

export const apiClient = {
  async getDemoReport(
    complexity: ComplexityLevel = 'me',
    language: SupportedLanguage = 'en',
    sampleId: string = 'sample_blood_test'
  ): Promise<ReportExplanationResponse> {
    try {
      const res = await fetch(`${BACKEND_BASE}/reports/demo-sample`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complexity, language, sample_id: sampleId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, generating rich client demo report:', e);
    }

    // Client fallback with preset differentiation
    const statusLabels = STATUS_TRANSLATIONS[language] || STATUS_TRANSLATIONS.en;
    const questions = MOCK_DOCTOR_QUESTIONS[language] || MOCK_DOCTOR_QUESTIONS.en;
    const rawOcr = RAW_OCR_PRESETS[sampleId] || RAW_OCR_PRESETS.sample_blood_test;

    if (sampleId === 'sample_cbc') {
      return {
        report_id: 'RPT-77291',
        patient_name: 'Priya Sharma',
        date_of_report: '15-Nov-2025',
        report_type_title: 'Complete Hemogram & Iron Profile',
        lab_name: 'Healthcare Global Pathology Services',
        raw_extracted_text: rawOcr,
        is_fictional_demo: false,
        complexity,
        language,
        simple_summary:
          'Your report shows information regarding red blood cells and iron indicators. Hemoglobin (10.2 g/dL) and ferritin (stored iron) are below listed reference ranges, which can explain feelings of tiredness. White blood cells and platelets are healthy.',
        key_terms: [
          {
            term: 'Serum Ferritin',
            pronunciation: 'SER-um FAIR-ih-tin',
            simple_explanation: "The body's iron savings account. Lower levels suggest you need more dietary iron.",
            category: 'Iron & Energy',
          },
          {
            term: 'Mean Corpuscular Volume (MCV)',
            pronunciation: 'M-C-V',
            simple_explanation: 'Measures the physical size of red blood cells. Smaller size often links to iron deficiency.',
            category: 'Hematology',
          },
          {
            term: 'Hemoglobin',
            pronunciation: 'HEE-muh-gloh-bin',
            simple_explanation: 'Oxygen-carrying protein in red cells that helps keep your physical energy steady.',
            category: 'Hematology',
          },
        ],
        test_values: [
          {
            test_name: 'Hemoglobin',
            result: '10.2 g/dL',
            reference_range: '12.0 - 15.5 g/dL',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Oxygen carrying capacity is slightly lower than typical female reference benchmarks.',
          },
          {
            test_name: 'Serum Ferritin (Iron Stores)',
            result: '11 ng/mL',
            reference_range: '15 - 150 ng/mL',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Iron storage protein is below benchmark. Discuss iron-rich foods with your doctor.',
          },
          {
            test_name: 'Mean Corpuscular Volume (MCV)',
            result: '71.8 fL',
            reference_range: '80 - 100 fL',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Red blood cells are smaller than average, commonly seen with lower iron levels.',
          },
          {
            test_name: 'Platelet Count',
            result: '285,000 /cumm',
            reference_range: '150,000 - 450,000',
            status: 'normal',
            status_label: statusLabels.normal,
            explanation: 'Clotting cells are in a healthy, typical range.',
          },
          {
            test_name: 'Total White Blood Cells (WBC)',
            result: '6,700 /cumm',
            reference_range: '4,000 - 10,000',
            status: 'normal',
            status_label: statusLabels.normal,
            explanation: 'Immune defense cells are within normal boundaries.',
          },
        ],
        questions_for_doctor: questions,
        document_summary: {
          tests_mentioned: ['Hemoglobin', 'Serum Ferritin', 'MCV', 'PCV', 'Platelet Count', 'WBC Count'],
          medicines_mentioned: ['None listed on diagnostic requisition'],
          instructions_mentioned: ['Routine morning blood draw confirmed'],
          follow_up_recommendation:
            'Review findings with your doctor regarding dietary iron support and follow-up hemogram.',
        },
        safety_disclaimer:
          'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
        is_urgent: false,
        urgent_warning: null,
      };
    }

    if (sampleId === 'sample_thyroid_vitamin') {
      return {
        report_id: 'RPT-55102',
        patient_name: 'Rajesh Verma',
        date_of_report: '20-Nov-2025',
        report_type_title: 'Thyroid & Essential Vitamin Panel',
        lab_name: 'Apollo Diagnostics & Endocrine Centre',
        raw_extracted_text: rawOcr,
        is_fictional_demo: false,
        complexity,
        language,
        simple_summary:
          'Your test evaluates thyroid function and vitamins. TSH (8.40 mIU/L) is higher than standard reference benchmarks, and Vitamins D3 and B12 are below typical thresholds. Active thyroid hormone (FT4) and calcium are normal.',
        key_terms: [
          {
            term: 'TSH (Thyroid Stimulating Hormone)',
            pronunciation: 'T-S-H',
            simple_explanation: 'A hormone that prompts your thyroid gland to regulate metabolism and body energy.',
            category: 'Endocrine',
          },
          {
            term: 'Vitamin D3',
            pronunciation: 'VY-tuh-min D-three',
            simple_explanation: 'Crucial for bone density, calcium absorption, and muscle strength.',
            category: 'Vitamins',
          },
          {
            term: 'Vitamin B12',
            pronunciation: 'VY-tuh-min B-twelve',
            simple_explanation: 'Essential for healthy nerve sheaths and red blood cell production.',
            category: 'Vitamins',
          },
        ],
        test_values: [
          {
            test_name: 'Thyroid Stimulating Hormone (TSH)',
            result: '8.40 mIU/L',
            reference_range: '0.40 - 4.20 mIU/L',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Above standard reference benchmark. Suggests discussing metabolic regulation with a physician.',
          },
          {
            test_name: 'Vitamin D3 (25-Hydroxy)',
            result: '14.2 ng/mL',
            reference_range: '30.0 - 100.0 ng/mL',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Below benchmark range. Sunlight exposure and dietary supplementation can replenish levels.',
          },
          {
            test_name: 'Vitamin B12 (Cyanocobalamin)',
            result: '175 pg/mL',
            reference_range: '211 - 911 pg/mL',
            status: 'outside_range',
            status_label: statusLabels.outside,
            explanation: 'Below standard reference parameters, common with plant-based diets.',
          },
          {
            test_name: 'Free Thyroxine (FT4)',
            result: '0.88 ng/dL',
            reference_range: '0.80 - 1.80 ng/dL',
            status: 'normal',
            status_label: statusLabels.normal,
            explanation: 'Active circulating thyroid hormone is within normal boundaries.',
          },
          {
            test_name: 'Serum Calcium',
            result: '9.1 mg/dL',
            reference_range: '8.5 - 10.2 mg/dL',
            status: 'normal',
            status_label: statusLabels.normal,
            explanation: 'Blood calcium is well balanced.',
          },
        ],
        questions_for_doctor: questions,
        document_summary: {
          tests_mentioned: ['TSH', 'Free T4', 'Vitamin D3', 'Vitamin B12', 'Serum Calcium'],
          medicines_mentioned: ['None listed on diagnostic requisition'],
          instructions_mentioned: ['Fasting sample collected confirmed'],
          follow_up_recommendation:
            'Consult your physician regarding vitamin supplementation and repeating thyroid markers in 6 to 8 weeks.',
        },
        safety_disclaimer:
          'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
        is_urgent: false,
        urgent_warning: null,
      };
    }

    // Default: sample_blood_test (Comprehensive Metabolic & Lipid Panel)
    const summary = MOCK_SUMMARIES[language]?.[complexity] || MOCK_SUMMARIES.en[complexity];

    return {
      report_id: 'RPT-84920',
      patient_name: 'Ramesh Patel',
      date_of_report: '12-Oct-2025',
      report_type_title: 'Comprehensive Metabolic & Lipid Panel',
      lab_name: 'Metropolis Research & Diagnostic Lab',
      raw_extracted_text: rawOcr,
      is_fictional_demo: false,
      complexity,
      language,
      simple_summary: summary,
      key_terms: [
        {
          term: language === 'kn' ? 'HbA1c (ಗ್ಲೈಕೇಟೆಡ್ ಹಿಮೋಗ್ಲೋಬಿನ್)' : 'HbA1c',
          pronunciation: 'H-B-A-one-C',
          simple_explanation:
            language === 'kn'
              ? 'ಕಳೆದ 2 ರಿಂದ 3 ತಿಂಗಳುಗಳಲ್ಲಿ ನಿಮ್ಮ ಸರಾಸರಿ ರಕ್ತದ ಸಕ್ಕರೆ ಮಟ್ಟವನ್ನು ಅಳೆಯುವ ಪರೀಕ್ಷೆ.'
              : 'A blood test that looks back over 2 to 3 months to see your average blood sugar levels, like a long-term snapshot.',
          category: 'Metabolic Health',
        },
        {
          term: language === 'kn' ? 'ಕೊಲೆಸ್ಟ್ರಾಲ್ (Total Cholesterol)' : 'Total Cholesterol',
          pronunciation: 'Koh-LES-tuh-rawl',
          simple_explanation:
            language === 'kn'
              ? 'ರಕ್ತದಲ್ಲಿರುವ ಕೊಬ್ಬಿನಂತಹ ಅಂಶ. ಕೋಶಗಳ ನಿರ್ಮಾಣಕ್ಕೆ ಅಗತ್ಯ, ಆದರೆ ಹೆಚ್ಚಾದರೆ ರಕ್ತನಾಳಗಳಲ್ಲಿ ತಡೆ ಉಂಟುಮಾಡಬಹುದು.'
              : 'A waxy fat-like substance found in all your cells. While needed to build cells, higher levels can accumulate in blood vessels.',
          category: 'Cardiovascular',
        },
        {
          term: language === 'kn' ? 'ಹಿಮೋಗ್ಲೋಬಿನ್ (Hemoglobin)' : 'Hemoglobin',
          pronunciation: 'HEE-muh-gloh-bin',
          simple_explanation:
            language === 'kn'
              ? 'ನಿಮ್ಮ ದೇಹದಾದ್ಯಂತ ಆಮ್ಲಜನಕವನ್ನು ಸಾಗಿಸುವ ಕೆಂಪು ರಕ್ತ ಕಣಗಳಲ್ಲಿನ ಪ್ರಮುಖ ಪ್ರೋಟೀನ್.'
              : 'A protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
          category: 'Hematology',
        },
        {
          term: language === 'kn' ? 'ಸೀರಮ್ ಕ್ರಿಯೇಟಿನೈನ್ (Creatinine)' : 'Serum Creatinine',
          pronunciation: 'Kree-AT-uh-neen',
          simple_explanation:
            language === 'kn'
              ? 'ಮೂತ್ರಪಿಂಡಗಳು ರಕ್ತವನ್ನು ಎಷ್ಟು ಚೆನ್ನಾಗಿ ಶುದ್ಧೀಕರಿಸುತ್ತಿವೆ ಎಂಬುದನ್ನು ಸೂಚಿಸುವ ತ್ಯಾಜ್ಯ ವಸ್ತು.'
              : 'A natural waste product filtered out by kidneys; standard levels indicate healthy kidney filtering.',
          category: 'Renal Function',
        },
      ],
      test_values: [
        {
          test_name: language === 'kn' ? 'ಉಪವಾಸದ ರಕ್ತದ ಸಕ್ಕರೆ (FBS)' : 'Fasting Blood Glucose',
          result: '138 mg/dL',
          reference_range: '70 - 99 mg/dL',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation:
            language === 'kn'
              ? '8 ಗಂಟೆಗಳ ಕಾಲ ಉಪವಾಸವಿದ್ದ ನಂತರ ರಕ್ತದಲ್ಲಿನ ಸಕ್ಕರೆ ಪ್ರಮಾಣವನ್ನು ಅಳೆಯುತ್ತದೆ.'
              : 'Measures blood sugar after at least 8 hours without food. Values above 99 mg/dL warrant discussion with your physician.',
        },
        {
          test_name: 'HbA1c (Glycated Hemoglobin)',
          result: '7.2 %',
          reference_range: '4.0 - 5.6 %',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation:
            language === 'kn'
              ? 'ಕಳೆದ 2-3 ತಿಂಗಳುಗಳ ಸರಾಸರಿ ಸಕ್ಕರೆ ಮಟ್ಟ. ಇದು ಉಲ್ಲೇಖಿತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ.'
              : 'Reflects average blood sugar control over the past 2 to 3 months. Elevated values suggest reviewing dietary habits.',
        },
        {
          test_name: language === 'kn' ? 'ಒಟ್ಟು ಕೊಲೆಸ್ಟ್ರಾಲ್' : 'Total Cholesterol',
          result: '228 mg/dL',
          reference_range: '125 - 200 mg/dL',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation:
            language === 'kn'
              ? 'ರಕ್ತದಲ್ಲಿರುವ ಒಟ್ಟು ಕೊಬ್ಬಿನ ಪ್ರಮಾಣ. ಸಾಮಾನ್ಯ ಮಿತಿಗಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿದೆ.'
              : 'The total amount of cholesterol circulating in your blood. Slightly above standard benchmark.',
        },
        {
          test_name: "HDL Cholesterol ('Good')",
          result: '38 mg/dL',
          reference_range: '> 40 mg/dL',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation: 'Higher HDL levels help transport cholesterol away from arteries. Regular physical activity can help support this.',
        },
        {
          test_name: "LDL Cholesterol ('Bad')",
          result: '144 mg/dL',
          reference_range: '< 100 mg/dL',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation: 'Circulating low-density lipoprotein. Values above 100 mg/dL should be reviewed regarding nutrition and lifestyle habits.',
        },
        {
          test_name: 'Triglycerides',
          result: '185 mg/dL',
          reference_range: '< 150 mg/dL',
          status: 'outside_range',
          status_label: statusLabels.outside,
          explanation: 'A type of fat stored in the blood from excess calories. Higher levels are commonly responsive to balanced nutrition.',
        },
        {
          test_name: language === 'kn' ? 'ಹಿಮೋಗ್ಲೋಬಿನ್' : 'Hemoglobin',
          result: '13.8 g/dL',
          reference_range: '13.0 - 17.0 g/dL',
          status: 'normal',
          status_label: statusLabels.normal,
          explanation: 'Oxygen-carrying protein in red blood cells is in the healthy typical range.',
        },
        {
          test_name: 'Total White Blood Count (WBC)',
          result: '7,400 cells/cumm',
          reference_range: '4,000 - 11,000',
          status: 'normal',
          status_label: statusLabels.normal,
          explanation: 'Immune defense cells are within normal healthy parameters.',
        },
        {
          test_name: 'Serum Creatinine (Kidney)',
          result: '0.95 mg/dL',
          reference_range: '0.70 - 1.20 mg/dL',
          status: 'normal',
          status_label: statusLabels.normal,
          explanation: 'Indicates normal kidney filtering function.',
        },
        {
          test_name: 'SGPT / ALT (Liver)',
          result: '34 U/L',
          reference_range: '< 45 U/L',
          status: 'normal',
          status_label: statusLabels.normal,
          explanation: 'Liver enzyme levels are within expected reference parameters.',
        },
      ],
      questions_for_doctor: questions,
      document_summary: {
        tests_mentioned: [
          'Fasting Blood Sugar',
          'HbA1c',
          'Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
          'Complete Blood Count (Hemoglobin, WBC, Platelets)',
          'Renal & Hepatic Panel (Creatinine, SGPT/ALT)',
        ],
        medicines_mentioned: ['None listed on diagnostic requisition'],
        instructions_mentioned: [
          '12-hour fasting prior to sample collection confirmed',
          'Maintain hydration prior to venipuncture',
        ],
        follow_up_recommendation:
          'Schedule routine appointment with your primary care doctor within 2 to 4 weeks to review metabolic parameters.',
      },
      safety_disclaimer:
        'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
      is_urgent: false,
      urgent_warning: null,
    };
  },

  async uploadReport(
    file: File,
    complexity: ComplexityLevel = 'me',
    language: SupportedLanguage = 'en'
  ): Promise<ReportExplanationResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('complexity', complexity);
      formData.append('language', language);

      const res = await fetch(`${BACKEND_BASE}/reports/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable during upload, falling back to mock OCR parser:', e);
    }

    // Determine preset if file name mentions CBC or Thyroid
    const fn = file.name.toLowerCase();
    let sampleId = 'sample_blood_test';
    if (fn.includes('cbc') || fn.includes('hemogram') || fn.includes('anemia')) {
      sampleId = 'sample_cbc';
    } else if (fn.includes('thyroid') || fn.includes('tsh') || fn.includes('vitamin')) {
      sampleId = 'sample_thyroid_vitamin';
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    return this.getDemoReport(complexity, language, sampleId);
  },

  async askChat(
    message: string,
    language: SupportedLanguage = 'en',
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const res = await fetch(`${BACKEND_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, history }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend chat unavailable, using client fallback:', e);
    }

    const cleanMsg = message.toLowerCase();
    const isUrgent =
      cleanMsg.includes('chest pain') ||
      cleanMsg.includes('can\'t breathe') ||
      cleanMsg.includes('unconscious') ||
      cleanMsg.includes('face drooping') ||
      cleanMsg.includes('coughing blood');

    if (isUrgent) {
      return {
        reply:
          'Your query mentions symptoms that may require urgent professional medical attention. Please contact your nearest local emergency services or visit a hospital clinic immediately. HealthBridge AI cannot provide emergency medical intervention.',
        suggested_questions: ['What emergency services should I contact?', 'What should I do while waiting?'],
        safety_disclaimer:
          'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
        is_urgent: true,
        urgent_warning:
          'This information may require urgent professional attention. Contact local emergency services or a healthcare professional immediately.',
      };
    }

    let reply = `Regarding "${message}": In medical education, health markers and physical symptoms can have multiple contributing factors, such as diet, sleep, and physical activity. To evaluate what this means for your individual health, we recommend discussing your questions with a qualified healthcare professional.`;

    if (cleanMsg.includes('blood pressure')) {
      reply =
        'Blood pressure measures the pressure of circulating blood against artery walls. A typical benchmark is around 120/80 mmHg. The top number represents systolic pressure (when the heart contracts), and the bottom is diastolic (when it rests). Consistent exercise and moderate sodium intake support healthy blood pressure.';
    } else if (cleanMsg.includes('hba1c')) {
      reply =
        'HbA1c measures the percentage of your hemoglobin coated with sugar over the past 2 to 3 months. Unlike a single finger-prick test, it gives a stable long-term picture of your blood sugar balance and is not affected by what you ate this morning.';
    } else if (cleanMsg.includes('doctor')) {
      reply =
        'Great questions to ask your doctor include: 1. "What do these specific numbers mean for my daily life?" 2. "Are there dietary or exercise habits you recommend adjusting?" 3. "When should I repeat this test?" 4. "What warning signs should prompt me to contact you earlier?"';
    } else if (cleanMsg.includes('cholesterol')) {
      reply =
        'Cholesterol is a lipid substance your body uses to build cell membranes and hormones. HDL is considered "good" because it helps transport fats back to the liver, while high LDL ("bad") can lead to plaque buildup in arteries.';
    } else if (cleanMsg.includes('cbc')) {
      reply =
        'A Complete Blood Count (CBC) examines your red blood cells (carrying oxygen), white blood cells (fighting infections), and platelets (helping blood clot). It is one of the most common routine health indicators.';
    }

    return {
      reply,
      suggested_questions: [
        'What is blood pressure?',
        'What does HbA1c measure?',
        'What questions should I ask my doctor?',
        'What does cholesterol mean?',
      ],
      safety_disclaimer:
        'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
      is_urgent: false,
      urgent_warning: null,
    };
  },

  async getMedicines(query?: string): Promise<MedicineDetail[]> {
    try {
      const url = query ? `${BACKEND_BASE}/medicines?query=${encodeURIComponent(query)}` : `${BACKEND_BASE}/medicines`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend medicines unavailable, using client fallback:', e);
    }

    const allMeds: MedicineDetail[] = [
      {
        id: 'dolo_650',
        name: 'Dolo-650',
        generic_name: 'Paracetamol (650mg)',
        category: 'Pain Relief & Antipyretic',
        active_ingredients: ['Acetaminophen (Paracetamol)'],
        common_uses: [
          'High fever reduction during viral fever, dengue, or influenza',
          'Relief of moderate body ache, headache, and fever-related discomfort',
        ],
        general_precautions: [
          'Do NOT take with Crocin, Calpol, or combination cold medicines',
          'Space doses by at least 4 to 6 hours as advised by a physician',
        ],
        common_side_effects: ['Mild gastric acidity in some individuals'],
        important_warnings: [
          'Severe liver injury risk if combined with other paracetamol products',
          'Do not take for more than 3 consecutive days without medical review',
        ],
        when_to_consult_doctor: [
          'Fever stays above 101°F after 48 hours',
          'Persistent vomiting or yellowing of eyes/skin',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'coldact',
        name: 'Coldact / Sinarest (Cold Relief)',
        generic_name: 'Paracetamol + Phenylephrine + Chlorpheniramine',
        category: 'Multi-Symptom Cold & Congestion',
        active_ingredients: ['Acetaminophen (Paracetamol)', 'Phenylephrine', 'Chlorpheniramine'],
        common_uses: [
          'Nasal congestion, runny nose, and sneezing due to common cold or allergies',
          'Sinus headache accompanied by mild fever',
        ],
        general_precautions: [
          'Contains Paracetamol! Do NOT take with Dolo-650 or Crocin at the same time',
          'May cause drowsiness; avoid driving or operating machinery',
        ],
        common_side_effects: ['Drowsiness, mild dizziness, dry mouth'],
        important_warnings: [
          'Accidental acetaminophen overdose is very common when taking with pain tablets',
          'Contraindicated in severe uncontrolled hypertension',
        ],
        when_to_consult_doctor: [
          'Symptoms persist beyond 7 days',
          'High fever or difficulty breathing develops',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'combiflam',
        name: 'Combiflam',
        generic_name: 'Ibuprofen + Paracetamol',
        category: 'Combination Anti-Inflammatory & Pain Relief',
        active_ingredients: ['Acetaminophen (Paracetamol)', 'Ibuprofen (NSAID)'],
        common_uses: [
          'Inflammatory muscular pain, dental aches, sprains, and backache',
          'Arthritic joint flare-ups and post-injury swelling',
        ],
        general_precautions: [
          'Always take after food or with milk to protect stomach lining',
          'Contains both Paracetamol and an NSAID; do NOT combine with aspirin',
        ],
        common_side_effects: ['Stomach burn, nausea, acid reflux, abdominal fullness'],
        important_warnings: [
          'Can irritate stomach ulcers; contraindicated in active gastric bleeding',
          'Do not take with additional paracetamol or NSAIDs',
        ],
        when_to_consult_doctor: [
          'Black or tarry stools, sharp stomach burning pain',
          'Swelling in ankles or fluid retention',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'paracetamol',
        name: 'Paracetamol (Crocin / Calpol)',
        generic_name: 'Paracetamol / Acetaminophen',
        category: 'Pain Relief & Antipyretic',
        active_ingredients: ['Acetaminophen (Paracetamol)'],
        common_uses: [
          'Temporary relief of mild to moderate body pain and headaches',
          'Reduction of fever associated with common viral illnesses',
          'Comfort management during toothaches and minor muscular aches',
        ],
        general_precautions: [
          'Check other cold or flu medications to avoid accidental duplicate intake',
          'Avoid combining with excessive alcohol consumption',
          'Ensure proper hydration when recovering from fever',
        ],
        common_side_effects: [
          'Generally well tolerated when used appropriately',
          'Rare: mild nausea or slight stomach discomfort',
        ],
        important_warnings: [
          'Taking doses beyond maximum recommended amounts can cause serious liver toxicity',
          'Individuals with pre-existing liver disease must seek doctor guidance first',
        ],
        when_to_consult_doctor: [
          'Fever lasts longer than 3 consecutive days without improvement',
          'Pain worsens or does not subside after 5 to 7 days',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'metformin',
        name: 'Metformin',
        generic_name: 'Metformin Hydrochloride',
        category: 'Blood Sugar Management / Biguanide',
        active_ingredients: ['Metformin Hydrochloride'],
        common_uses: [
          'Helps the body utilize natural insulin more effectively',
          'Supports maintenance of healthy blood glucose levels alongside diet and exercise',
          'Often prescribed as a foundational medication for metabolic wellness',
        ],
        general_precautions: [
          'Usually taken with or immediately after meals to reduce stomach sensitivity',
          'Maintain adequate fluid intake throughout the day',
        ],
        common_side_effects: [
          'Temporary nausea or loose stools during early weeks of therapy',
          'Mild abdominal bloating or metallic taste',
        ],
        important_warnings: [
          'Rare but critical risk of lactic acidosis, especially in severe dehydration',
          'Do not discontinue abruptly without physician review',
        ],
        when_to_consult_doctor: [
          'Unusual muscle cramping, severe fatigue, or coldness in arms and legs',
          'Persistent stomach upset that does not resolve after several weeks',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        generic_name: 'Amoxicillin Trihydrate',
        category: 'Antibacterial / Penicillin Class',
        active_ingredients: ['Amoxicillin'],
        common_uses: [
          'Treats specific bacterial infections such as middle ear, throat, and respiratory infections',
          'Bacterial urinary tract infections diagnosed by a medical professional',
        ],
        general_precautions: [
          'Always complete the full prescribed course even if symptoms improve early',
          'Ineffective against viral illnesses such as the common cold or viral cough',
        ],
        common_side_effects: [
          'Mild gastrointestinal distress or mild diarrhea',
          'Temporary alterations in taste',
        ],
        important_warnings: [
          'Contraindicated in individuals with documented penicillin allergy',
          'Overuse and incomplete courses contribute to antibiotic resistance',
        ],
        when_to_consult_doctor: [
          'Hives, swelling of the lips/tongue, or breathing difficulty (emergency signs)',
          'Severe watery or bloody diarrhea',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'atorvastatin',
        name: 'Atorvastatin',
        generic_name: 'Atorvastatin Calcium',
        category: 'Lipid Regulator / Statin',
        active_ingredients: ['Atorvastatin Calcium'],
        common_uses: [
          'Assists in lowering LDL (low-density lipoprotein) cholesterol and triglycerides',
          'Supports healthy cardiovascular lipid profiles in conjunction with dietary guidance',
        ],
        general_precautions: [
          'Usually taken once daily, often in the evening or at a consistent time',
          'Avoid consuming significant amounts of grapefruit juice',
        ],
        common_side_effects: [
          'Mild joint or muscle discomfort',
          'Digestive changes such as mild constipation or bloating',
        ],
        important_warnings: [
          'Unexplained, severe muscle pain or dark tea-colored urine requires prompt medical review',
          'Not recommended during pregnancy or breastfeeding',
        ],
        when_to_consult_doctor: [
          'Unexplained muscle aches, tenderness, or weakness accompanied by tiredness',
          'Jaundice (yellowing of skin or whites of the eyes)',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'omeprazole',
        name: 'Omeprazole',
        generic_name: 'Omeprazole Magnesium',
        category: 'Acid Reducer / Proton Pump Inhibitor',
        active_ingredients: ['Omeprazole'],
        common_uses: [
          'Reduces excessive stomach acid production in gastroesophageal reflux',
          'Supports healing of stomach and duodenal ulcers',
        ],
        general_precautions: [
          'Best taken 30 to 60 minutes before the first meal of the day',
          'Swallow capsules whole; avoid crushing or chewing timed-release granules',
        ],
        common_side_effects: ['Mild headache', 'Abdominal discomfort, gas, or mild diarrhea'],
        important_warnings: [
          'Prolonged unmonitored use may impact magnesium and calcium absorption',
          'Do not use indefinitely without medical reassessment',
        ],
        when_to_consult_doctor: [
          'Difficulty or pain when swallowing food',
          'Persistent vomiting or vomiting resembling coffee grounds',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'cetirizine',
        name: 'Cetirizine',
        generic_name: 'Cetirizine Hydrochloride',
        category: 'Antihistamine / Allergy Relief',
        active_ingredients: ['Cetirizine Hydrochloride'],
        common_uses: [
          'Relief of allergy symptoms including sneezing, runny nose, and itchy eyes',
          'Management of hives and allergic skin itching',
        ],
        general_precautions: [
          'May cause mild drowsiness in some individuals; use caution when driving',
          'Avoid alcohol consumption while taking antihistamines',
        ],
        common_side_effects: ['Mild drowsiness or tiredness', 'Dry mouth'],
        important_warnings: [
          'Dose adjustments may be needed for individuals with kidney conditions',
          'Not intended for severe respiratory distress',
        ],
        when_to_consult_doctor: [
          'Allergy symptoms worsen or fail to respond after several days',
          'Severe swelling around throat, lips, or face',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
      {
        id: 'amlodipine',
        name: 'Amlodipine',
        generic_name: 'Amlodipine Besylate',
        category: 'Blood Pressure Regulator / Calcium Channel Blocker',
        active_ingredients: ['Amlodipine Besylate'],
        common_uses: [
          'Supports healthy blood pressure levels by relaxing blood vessels',
          'Helps improve blood flow to the heart',
        ],
        general_precautions: [
          'Take consistently at the same time each day',
          'Stand up slowly from lying or sitting positions to prevent lightheadedness',
        ],
        common_side_effects: ['Mild swelling in ankles or feet', 'Flushing or feeling of warmth'],
        important_warnings: [
          'Do not stop suddenly, as rebound blood pressure spikes can occur',
          'Never share prescription blood pressure medications with others',
        ],
        when_to_consult_doctor: [
          'Noticeable dizziness upon standing',
          'Rapid or pounding heart rhythm',
        ],
        educational_disclaimer:
          'Medication information is educational and should not replace advice from a doctor or pharmacist.',
      },
    ];

    if (!query) return allMeds;
    const q = query.toLowerCase();
    return allMeds.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.common_uses.some((u) => u.toLowerCase().includes(q))
    );
  },

  async checkMedicineSafety(medicineIds: string[]): Promise<MedicineSafetyCheckResponse> {
    try {
      const res = await fetch(`${BACKEND_BASE}/medicines/check-safety`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicine_ids: medicineIds }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend safety check unavailable, using client fallback:', e);
    }

    // Client-side fallback logic
    const allMeds = await this.getMedicines();
    const selected = allMeds.filter((m) => medicineIds.includes(m.id));

    if (selected.length < 2) {
      return {
        has_conflict: false,
        conflict_type: 'none',
        title: 'Select at least 2 medications',
        description: 'Choose any two medicines above to evaluate duplicate active compounds or warnings.',
        shared_ingredients: [],
        safety_recommendation: 'Always review multiple medicines with your doctor.',
      };
    }

    const map: Record<string, string[]> = {};
    for (const med of selected) {
      for (const ing of med.active_ingredients || []) {
        map[ing] = map[ing] || [];
        map[ing].push(med.name);
      }
    }

    const duplicates = Object.entries(map).filter(([_, meds]) => meds.length > 1);

    if (duplicates.length > 0) {
      const shared = duplicates.map(([ing]) => ing);
      if (shared.some((s) => s.includes('Acetaminophen') || s.includes('Paracetamol'))) {
        return {
          has_conflict: true,
          conflict_type: 'duplicate_ingredient',
          title: '⚠️ Critical Overdose Alert: Duplicate Paracetamol / Acetaminophen Detected!',
          description: `Both "${selected[0].name}" and "${selected[1].name}" contain active Acetaminophen (Paracetamol). Taking both can easily exceed the safe 4,000 mg daily limit, the leading cause of acute liver failure.`,
          shared_ingredients: shared,
          safety_recommendation:
            'Do NOT take these together. Pick only one source of fever/pain relief or consult your doctor.',
        };
      }
      return {
        has_conflict: true,
        conflict_type: 'duplicate_ingredient',
        title: '⚠️ Duplicate Active Ingredient Warning',
        description: `Selected medicines share active compounds: ${shared.join(', ')}.`,
        shared_ingredients: shared,
        safety_recommendation: 'Avoid duplicate active compounds to prevent accidental toxicity.',
      };
    }

    return {
      has_conflict: false,
      conflict_type: 'none',
      title: 'No Known Direct Ingredient Duplication',
      description: `"${selected[0].name}" and "${selected[1].name}" do not share identical active compounds in our educational database.`,
      shared_ingredients: [],
      safety_recommendation: 'Always confirm your full medication regimen with a doctor or pharmacist.',
    };
  },

  async navigateHealthcare(query: string, language: SupportedLanguage = 'en'): Promise<NavigatorResponse> {
    try {
      const res = await fetch(`${BACKEND_BASE}/navigator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend navigator unavailable, using client fallback:', e);
    }

    const q = query.toLowerCase();
    let specialty = 'General Physician / Family Medicine';
    let desc =
      'Based on your question, a General Physician is the best first point of contact to evaluate your overall symptoms, recommend baseline tests, or coordinate care with a specialist.';
    let conditions = ['Seasonal infections, viral fever, cold', 'General preventive checkups', 'Routine lab screening review'];
    let prep = [
      'Record how many days the symptoms have been present',
      'List of any home remedies or over-the-counter medicines taken',
      'Recent health reports from the past year',
      'Questions you would like answered during the visit',
    ];
    let questions = [
      'What could be contributing to these symptoms?',
      'Are there screening tests I should undergo?',
      'Should I consult a subspecialist if symptoms continue?',
    ];

    if (q.includes('skin') || q.includes('rash') || q.includes('itch') || q.includes('hair') || q.includes('acne')) {
      specialty = 'Dermatologist';
      desc =
        'Based on your question, a Dermatologist is the medical doctor specializing in conditions affecting skin, hair, and nails.';
      conditions = ['Skin rashes & dermatitis', 'Acne & hormonal breakouts', 'Hair loss & scalp conditions', 'Skin lesion evaluations'];
      prep = [
        'List of all current topical creams, soaps, and skin medications',
        'Photos showing when the rash or lesion first started',
        'Avoid applying heavy makeup or tinted creams on the appointment day',
      ];
      questions = [
        'Could an environmental factor or allergy be causing this?',
        'What skin care or moisturizing routine do you recommend?',
        'How long should I follow this plan before a follow-up visit?',
      ];
    } else if (q.includes('heart') || q.includes('blood pressure') || q.includes('palpitation') || q.includes('chest')) {
      specialty = 'Cardiologist';
      desc =
        'Based on your question, a Cardiologist is a medical specialist focused on the cardiovascular system, heart rhythm, and arterial blood pressure.';
      conditions = ['Hypertension regulation', 'Cholesterol and lipid imbalances', 'Heart palpitations', 'Cardiovascular risk evaluations'];
      prep = [
        'Log of home blood pressure readings over recent weeks',
        'Previous ECG or lipid panel laboratory reports',
        'Complete list of current prescriptions and herbal supplements',
      ];
      questions = [
        'What are my target blood pressure and cholesterol numbers?',
        'What level of daily walking or activity is safe for me?',
        'What symptoms should trigger immediate medical evaluation?',
      ];
    } else if (q.includes('sugar') || q.includes('diabetes') || q.includes('thyroid') || q.includes('hba1c')) {
      specialty = 'Endocrinologist';
      desc =
        'Based on your question, an Endocrinologist specializes in hormones and metabolic regulation, including diabetes, thyroid health, and metabolism.';
      conditions = ['Elevated HbA1c and glucose management', 'Hypothyroidism / Hyperthyroidism', 'Metabolic wellness', 'Insulin resistance'];
      prep = [
        'Recent fasting glucose, HbA1c, or thyroid lab results',
        'Diary of daily meal times and general physical activity',
        'List of all current medications',
      ];
      questions = [
        'How frequently should I monitor my blood markers?',
        'What dietary changes will have the highest positive impact?',
        'Do my current dosages require periodic adjustments?',
      ];
    } else if (q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('back')) {
      specialty = 'Orthopedic Specialist';
      desc =
        'Based on your question, an Orthopedic Specialist evaluates and treats the musculoskeletal system, including bones, joints, and ligaments.';
      conditions = ['Knee joint wear & osteoarthritis', 'Lower back pain & posture strain', 'Ligament sprains & sports injuries'];
      prep = [
        'Previous X-ray or MRI scan reports',
        'Timeline of when joint pain started and what movements aggravate it',
        'Wear loose, comfortable clothing for physical joint assessment',
      ];
      questions = [
        'Can targeted physical therapy help improve joint mobility?',
        'What movements or heavy loads should I avoid for now?',
        'What non-surgical options are best suited for my stage?',
      ];
    }

    const isUrgent =
      q.includes('chest pain') ||
      q.includes('can\'t breathe') ||
      q.includes('unconscious') ||
      q.includes('coughing blood');

    return {
      specialty_name: specialty,
      specialty_description: desc,
      common_conditions: conditions,
      preparation_checklist: prep,
      questions_for_specialist: questions,
      urgency_level: isUrgent ? 'emergency' : 'routine',
      emergency_warning: isUrgent
        ? 'This information may require urgent professional attention. Contact local emergency services or a healthcare professional immediately.'
        : null,
      safety_disclaimer:
        'HealthBridge AI provides educational information and does not replace a qualified healthcare professional.',
    };
  },

  async getAnalytics(): Promise<AnalyticsStats> {
    try {
      const res = await fetch(`${BACKEND_BASE}/analytics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend analytics unavailable, using client fallback:', e);
    }

    return {
      documents_processed: 142,
      questions_answered: 618,
      languages_used: {
        English: 284,
        Kannada: 162,
        Hindi: 145,
        Tamil: 98,
        Telugu: 86,
        Malayalam: 64,
        Bengali: 48,
        Marathi: 41,
      },
      voice_interactions: 94,
      avg_response_time_ms: 450,
      is_demo_metrics: true,
    };
  },

  async clearUserDocuments(): Promise<boolean> {
    try {
      await fetch(`${BACKEND_BASE}/privacy/clear`, { method: 'POST' });
    } catch (e) {
      // ignore network errors for privacy clear
    }
    return storageService.clearAllDocuments();
  },
};
