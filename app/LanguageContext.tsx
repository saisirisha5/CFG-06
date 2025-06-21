import React, { createContext, useContext, useState, useEffect } from 'react';
import { openDatabase, getDBConnection, createTable, getLanguagePreference, saveLanguagePreference } from './db';

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

const englishTexts: { [key: string]: string } = {
  phone: 'Phone',
  email: 'Email',
  age: 'Age',
  location: 'Location',
  messagesFromAdmins: 'Messages from Admins',
  foundation: "FOUNDATION FOR",
  motherChild: "MOTHER & CHILD HEALTH",
  india: "INDIA",
  username: "Username",
  password: "Password",
  login: "LOGIN",
  forgot: "Forgot Password?",
  supportedBy: "supported by:",
  assignedMothers: "My Assigned Mothers",
  assignedFamilies: "Assigned Families",
  history: "History",
  resources: "Resources",
  motherNotFound: "Mother profile not found.",
  familyNotFound: "Family not found.",
  week: "Week",
  visitInfo: "Visit Info",
  lastVisit: "Last Visit",
  nextVisit: "Next Visit",
  summary: "Summary",
  weight: "Weight",
  hb: "Hemoglobin",
  bp: "Blood Pressure",
  risk: "Risk",
  risk_none: "None",
  risk_low: "Low",
  risk_mild_anemia: "Mild Anemia",
  counsellingTips: "Counselling Tips",
  notes: "Notes",
  familyMembers: "Family Members",
  years: "yrs",
  mother_1_name: "Asha Devi",
  mother_2_name: "Sunita Kumari",
  mother_3_name: "Meena Singh",
  history_4_name: "Radha Patel",
  history_5_name: "Kavita Joshi",
  family_1_name: "Devi Family",
  family_2_name: "Singh Family",
  resource_1_title: "Nutrition for Mothers",
  resource_1_desc: "Learn about essential nutrition during pregnancy.",
  resource_2_title: "Child Vaccination",
  resource_2_desc: "A guide to child vaccination schedules.",
  resource_3_title: "Mental Health",
  resource_3_desc: "Tips for maintaining mental health for mothers.",
  tip_1_1: "Eat iron-rich foods like spinach, lentils",
  tip_1_2: "Drink 2-3L water",
  tip_1_3: "Take iron & calcium supplements",
  tip_1_4: "Regular checkups",
  notes_1: "Mother is showing positive improvements. Fetal movement is normal. No signs of swelling or anemia.",
  family_1_1_name: "Ramu",
  family_1_1_relation: "Husband",
  family_1_2_name: "Maya",
  family_1_2_relation: "Mother-in-law",
  family_1_3_name: "Chintu",
  family_1_3_relation: "Elder Son",
  tip_2_1: "Avoid heavy lifting",
  tip_2_2: "Get enough sleep",
  tip_2_3: "Eat fruits and vegetables",
  notes_2: "Needs more rest and better diet. Slight fatigue reported.",
  family_2_1_name: "Suresh",
  family_2_1_relation: "Husband",
  tip_3_1: "Maintain regular sleep schedule",
  tip_3_2: "Moderate walking",
  notes_3: "Healthy and active. Monitoring closely.",
  family_3_1_name: "Vinod",
  family_3_1_relation: "Husband",
  tip_4_1: "Continue prenatal vitamins",
  tip_4_2: "Gentle walking daily",
  notes_4: "Doing well. Reports better appetite and energy.",
  family_4_1_name: "Ravi",
  family_4_1_relation: "Husband",
  tip_5_1: "Increase iron intake",
  tip_5_2: "Regular blood checks",
  notes_5: "Mild anemia detected. Iron supplements recommended.",
  family_5_1_name: "Raj",
  family_5_1_relation: "Husband",
  video_1_title: "Pregnancy Nutrition: Essential Foods for a Healthy Baby",
  video_1_desc: "Learn about the most important nutrients needed during pregnancy for both mother and baby.",
  video_2_title: "Breastfeeding Tips for New Mothers",
  video_2_desc: "Complete guide to successful breastfeeding techniques and common challenges.",
  video_3_title: "Child Vaccination Schedule Explained",
  video_3_desc: "Understanding the importance and timing of childhood vaccinations.",
  video_4_title: "Prenatal Yoga for Expecting Mothers",
  video_4_desc: "Safe and effective yoga exercises for pregnant women.",
  video_5_title: "Postpartum Mental Health: What to Expect",
  video_5_desc: "Understanding postpartum depression and anxiety, with coping strategies.",
  video_6_title: "Baby Sleep Training Methods",
  video_6_desc: "Gentle and effective methods to help your baby sleep through the night.",
  video_7_title: "First Aid for Infants and Toddlers",
  video_7_desc: "Essential first aid skills every parent should know for emergencies.",
  video_8_title: "Introducing Solid Foods to Your Baby",
  video_8_desc: "Step-by-step guide to starting your baby on solid foods safely.",
  video_9_title: "Managing Morning Sickness During Pregnancy",
  video_9_desc: "Natural remedies and tips to cope with morning sickness effectively.",
  video_10_title: "Child Development Milestones: 0-12 Months",
  video_10_desc: "Understanding your baby's growth and development in the first year.",
  video_11_title: "Maternity Exercise: Safe Workouts During Pregnancy",
  video_11_desc: "Safe and beneficial exercises for each trimester of pregnancy.",
  video_12_title: "Creating a Safe Nursery Environment",
  video_12_desc: "Essential tips for baby-proofing and creating a safe nursery space.",
  video_13_title: "Understanding Baby Cries and Communication",
  video_13_desc: "Learn to decode your baby's different cries and early communication signals.",
  video_14_title: "Maternal Health: Warning Signs to Watch For",
  video_14_desc: "Important health warning signs during pregnancy and postpartum period.",
  video_15_title: "Building Strong Mother-Child Bond",
  video_15_desc: "Activities and practices to strengthen the emotional bond with your child.",
  video_16_title: "Dealing with Colic in Newborns",
  video_16_desc: "Understanding and managing colic symptoms in newborn babies.",
  video_17_title: "Preparing for Labor and Delivery",
  video_17_desc: "Complete guide to preparing mentally and physically for childbirth.",
  video_18_title: "Postpartum Recovery: What No One Tells You",
  video_18_desc: "Honest discussion about postpartum recovery and self-care tips.",
  video_19_title: "Childproofing Your Home: Complete Checklist",
  video_19_desc: "Room-by-room guide to making your home safe for toddlers.",
  video_20_title: "Supporting Partners During Pregnancy",
  video_20_desc: "How partners can provide emotional and practical support during pregnancy.",
};

const LanguageContext = createContext<{
  language: keyof typeof languageCodes;
  setLanguage: (lang: keyof typeof languageCodes) => void;
  translate: (key: string) => string;
  loading: boolean;
}>({
  language: "English",
  setLanguage: () => {},
  translate: (key) => key,
  loading: false,
});

const DB_NAME = "LanguageDB";
const STORE_NAME = "LanguageStore";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<keyof typeof languageCodes>('English');
  const [translations, setTranslations] = useState<{ [key: string]: string }>(englishTexts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupDB = async () => {
      try {
        const db = await openDatabase(DB_NAME, STORE_NAME);
        await createTable(db, STORE_NAME);
        
        const savedLang = await getLanguagePreference(db, STORE_NAME);
        if (savedLang && languageCodes[savedLang as keyof typeof languageCodes]) {
          setLanguage(savedLang as keyof typeof languageCodes);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };
    setupDB();
  }, []);

  useEffect(() => {
    const fetchAndCacheTranslations = async () => {
      if (language === 'English') {
        setTranslations(englishTexts);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const db = await getDBConnection(DB_NAME, STORE_NAME);
        if (!db) {
          setTranslations(englishTexts);
          setLoading(false);
          return;
        }

        const cachedTranslations = await getTranslations(db, STORE_NAME, language);
        if (cachedTranslations) {
          setTranslations(cachedTranslations);
          setLoading(false);
          return;
        }

        const keys = Object.keys(englishTexts);
        const texts = Object.values(englishTexts);
        const translationPromises = texts.map(text =>
          fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${languageCodes[language]}`)
            .then(res => res.json())
            .then(data => data.responseData.translatedText || text)
            .catch(() => text)
        );

        const translatedTexts = await Promise.all(translationPromises);
        const newTranslations: { [key: string]: string } = {};
        keys.forEach((key, index) => {
          newTranslations[key] = translatedTexts[index];
        });

        await saveTranslations(db, STORE_NAME, language, newTranslations);
        setTranslations(newTranslations);
        setLoading(false);
      } catch (error) {
        console.error("Translation error:", error);
        const db = await getDBConnection(DB_NAME, STORE_NAME);
        if (db) {
          const cachedTranslations = await getTranslations(db, STORE_NAME, language);
          if (cachedTranslations) {
            setTranslations(cachedTranslations);
          } else {
            setTranslations(englishTexts);
          }
        } else {
          setTranslations(englishTexts);
        }
        setLoading(false);
      }
    };

    fetchAndCacheTranslations();
  }, [language]);

  const translate = (key: string) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

const getTranslations = (db: IDBDatabase, storeName: string, language: string): Promise<{ [key: string]: string } | null> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(`translations_${language}`);

    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => reject(request.error);
  });
};

const saveTranslations = (db: IDBDatabase, storeName: string, language: string, translations: { [key: string]: string }): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put({ id: `translations_${language}`, value: translations });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const useLanguage = () => useContext(LanguageContext);