import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageCodes = {
  English: "en",
  Hindi: "hi",
  Marathi: "mr",
  Gujarati: "gu",
  Telugu: "te",
  Bengali: "bn",
  Tamil: "ta",
  Punjabi: "pa",
  Kannada: "kn",
  Malayalam: "ml"
};

// Free translation dictionaries for common app texts
const translations = {
  en: {
    foundation: "Foundation",
    motherChild: "Mother & Child",
    india: "India",
    email: "Email",
    password: "Password",
    login: "Login",
    forgot: "Forgot Password?",
    supportedBy: "Supported By",
    validationError: "Validation Error",
    enterEmailPassword: "Please enter both email and password.",
    loginFailed: "Login Failed",
    invalidCredentials: "Invalid credentials. Please try again.",
    networkError: "Network Error",
    connectionError: "Unable to connect. Please check your internet connection and try again.",
    loginSuccessful: "Login successful"
  },
  hi: {
    foundation: "फाउंडेशन",
    motherChild: "माता और बच्चा",
    india: "भारत",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉगिन",
    forgot: "पासवर्ड भूल गए?",
    supportedBy: "द्वारा समर्थित",
    validationError: "सत्यापन त्रुटि",
    enterEmailPassword: "कृपया ईमेल और पासवर्ड दोनों दर्ज करें।",
    loginFailed: "लॉगिन असफल",
    invalidCredentials: "अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।",
    networkError: "नेटवर्क त्रुटि",
    connectionError: "कनेक्ट करने में असमर्थ। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।",
    loginSuccessful: "लॉगिन सफल"
  },
  mr: {
    foundation: "फाउंडेशन",
    motherChild: "आई आणि बाळ",
    india: "भारत",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉगिन",
    forgot: "पासवर्ड विसरलात?",
    supportedBy: "द्वारे समर्थित",
    validationError: "प्रमाणीकरण त्रुटी",
    enterEmailPassword: "कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा।",
    loginFailed: "लॉगिन अयशस्वी",
    invalidCredentials: "अवैध क्रेडेंशियल्स. कृपया पुन्हा प्रयत्न करा।",
    networkError: "नेटवर्क त्रुटी",
    connectionError: "कनेक्ट करण्यात अक्षम. कृपया तुमचे इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा।",
    loginSuccessful: "लॉगिन यशस्वी"
  },
  gu: {
    foundation: "ફાઉન્ડેશન",
    motherChild: "માતા અને બાળક",
    india: "ભારત",
    email: "ઇમેઇલ",
    password: "પાસવર્ડ",
    login: "લૉગિન",
    forgot: "પાસવર્ડ ભૂલી ગયા?",
    supportedBy: "દ્વારા સમર્થિત",
    validationError: "માન્યતા ભૂલ",
    enterEmailPassword: "કૃપા કરીને ઇમેઇલ અને પાસવર્ડ બંને દાખલ કરો.",
    loginFailed: "લૉગિન નિષ્ફળ",
    invalidCredentials: "અમાન્ય ઓળખપત્રો. કૃપા કરીને ફરી પ્રયાસ કરો.",
    networkError: "નેટવર્ક ભૂલ",
    connectionError: "કનેક્ટ કરવામાં અસમર્થ. કૃપા કરીને તમારું ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયાસ કરો.",
    loginSuccessful: "લૉગિન સફળ"
  },
  te: {
    foundation: "ఫౌండేషన్",
    motherChild: "తల్లి మరియు పిల్లవాడు",
    india: "భారతదేశం",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    login: "లాగిన్",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    supportedBy: "మద్దతు ఇచ్చిన వారు",
    validationError: "ధృవీకరణ లోపం",
    enterEmailPassword: "దయచేసి ఇమెయిల్ మరియు పాస్‌వర్డ్ రెండింటినీ నమోదు చేయండి.",
    loginFailed: "లాగిన్ విఫలమైంది",
    invalidCredentials: "చెల్లని ఆధారాలు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    networkError: "నెట్‌వర్క్ లోపం",
    connectionError: "కనెక్ట్ చేయడంలో అసమర్థత. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
    loginSuccessful: "లాగిన్ విజయవంతమైంది"
  },
  bn: {
    foundation: "ফাউন্ডেশন",
    motherChild: "মা এবং শিশু",
    india: "ভারত",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    login: "লগইন",
    forgot: "পাসওয়ার্ড ভুলে গেছেন?",
    supportedBy: "দ্বারা সমর্থিত",
    validationError: "বৈধতা ত্রুটি",
    enterEmailPassword: "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড উভয়ই প্রবেশ করান।",
    loginFailed: "লগইন ব্যর্থ",
    invalidCredentials: "অবৈধ শংসাপত্র। অনুগ্রহ করে আবার চেষ্টা করুন।",
    networkError: "নেটওয়ার্ক ত্রুটি",
    connectionError: "সংযোগ করতে অক্ষম। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।",
    loginSuccessful: "লগইন সফল"
  },
  ta: {
    foundation: "அறக்கட்டளை",
    motherChild: "தாய் மற்றும் குழந்தை",
    india: "இந்தியா",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    login: "உள்நுழைவு",
    forgot: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    supportedBy: "ஆதரவு வழங்கியவர்",
    validationError: "சரிபார்ப்பு பிழை",
    enterEmailPassword: "தயவுசெய்து மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்.",
    loginFailed: "உள்நுழைவு தோல்வி",
    invalidCredentials: "தவறான சான்றுகள். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    networkError: "நெட்வொர்க் பிழை",
    connectionError: "இணைக்க முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    loginSuccessful: "உள்நுழைவு வெற்றி"
  },
  pa: {
    foundation: "ਫਾਊਂਡੇਸ਼ਨ",
    motherChild: "ਮਾਂ ਅਤੇ ਬੱਚਾ",
    india: "ਭਾਰਤ",
    email: "ਈਮੇਲ",
    password: "ਪਾਸਵਰਡ",
    login: "ਲਾਗਿਨ",
    forgot: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    supportedBy: "ਦੁਆਰਾ ਸਮਰਥਿਤ",
    validationError: "ਪ੍ਰਮਾਣਿਕਤਾ ਦੀ ਗਲਤੀ",
    enterEmailPassword: "ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਦੋਵੇਂ ਦਾਖਲ ਕਰੋ।",
    loginFailed: "ਲਾਗਿਨ ਅਸਫਲ",
    invalidCredentials: "ਗਲਤ ਪ੍ਰਮਾਣ ਪੱਤਰ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    networkError: "ਨੈੱਟਵਰਕ ਗਲਤੀ",
    connectionError: "ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇੰਟਰਨੈੱਟ ਕਨੈਸ਼ਨ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    loginSuccessful: "ਲਾਗਿਨ ਸਫਲ"
  },
  kn: {
    foundation: "ಪ್ರತಿಷ್ಠಾನ",
    motherChild: "ತಾಯಿ ಮತ್ತು ಮಗು",
    india: "ಭಾರತ",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    login: "ಲಾಗಿನ್",
    forgot: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    supportedBy: "ಬೆಂಬಲಿತ",
    validationError: "ಮಾನ್ಯತೆ ದೋಷ",
    enterEmailPassword: "ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡನ್ನೂ ನಮೂದಿಸಿ.",
    loginFailed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
    invalidCredentials: "ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    networkError: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ",
    connectionError: "ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    loginSuccessful: "ಲಾಗಿನ್ ಯಶಸ್ವಿ"
  },
  ml: {
    foundation: "ഫൗണ്ടേഷൻ",
    motherChild: "അമ്മയും കുഞ്ഞും",
    india: "ഇന്ത്യ",
    email: "ഇമെയിൽ",
    password: "പാസ്‌വേഡ്",
    login: "ലോഗിൻ",
    forgot: "പാസ്‌വേഡ് മറന്നോ?",
    supportedBy: "പിന്തുണച്ചത്",
    validationError: "സാധുത പിശക്",
    enterEmailPassword: "ദയവായി ഇമെയിലും പാസ്‌വേഡും നൽകുക.",
    loginFailed: "ലോഗിൻ പരാജയപ്പെട്ടു",
    invalidCredentials: "തെറ്റായ അംഗീകാര വിവരങ്ങൾ. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    networkError: "നെറ്റ്‌വർക്ക് പിശക്",
    connectionError: "കണക്റ്റ് ചെയ്യാൻ കഴിയുന്നില്ല. ദയവായി നിങ്ങളുടെ ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.",
    loginSuccessful: "ലോഗിൻ വിജയകരം"
  }
};

interface LanguageContextType {
  language: keyof typeof languageCodes;
  setLanguage: (lang: keyof typeof languageCodes) => void;
  translate: (text: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "English",
  setLanguage: () => {},
  translate: (text) => text,
  loading: false,
});

const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<keyof typeof languageCodes>('English');
  const [loading, setLoading] = useState(false);

  // Load saved language preference on app start
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && languageCodes[savedLanguage as keyof typeof languageCodes]) {
          setLanguageState(savedLanguage as keyof typeof languageCodes);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  // Save language preference and update state
  const setLanguage = useCallback(async (lang: keyof typeof languageCodes) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Translate function using local dictionaries
  const translate = useCallback((text: string): string => {
    if (!text) return '';
    
    const langCode = languageCodes[language];
    const langTranslations = translations[langCode as keyof typeof translations];
    
    // Return translation if available, otherwise return original text
    return langTranslations?.[text] || text;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    translate,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languageCodes };