import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // UI texts from index.tsx
  foundation: "FOUNDATION FOR",
  motherChild: "MOTHER & CHILD HEALTH",
  india: "INDIA",
  username: "Username",
  password: "Password",
  login: "LOGIN",
  forgot: "Forgot Password?",
  supportedBy: "supported by:",
  // UI texts from home.tsx
  assignedMothers: "My Assigned Mothers",
  history: "History",
  resources: "Resources",
  // Static data from home.tsx
  mother_1_name: "Asha Devi",
  mother_2_name: "Sunita Kumari",
  mother_3_name: "Meena Singh",
  history_4_name: "Radha Patel",
  history_5_name: "Kavita Joshi",
  resource_1_title: "Nutrition for Mothers",
  resource_1_desc: "Learn about essential nutrition during pregnancy.",
  resource_2_title: "Child Vaccination",
  resource_2_desc: "A guide to child vaccination schedules.",
  resource_3_title: "Mental Health",
  resource_3_desc: "Tips for maintaining mental health for mothers.",
  // Static data from video.tsx (all 20 videos)
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

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<keyof typeof languageCodes>('English');
  const [translations, setTranslations] = useState<{ [key: string]: string }>(englishTexts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (language === 'English') {
      setTranslations(englishTexts);
      setLoading(false);
    } else {
      setLoading(true);
      const fetchTranslations = async () => {
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
        setTranslations(newTranslations);
        setLoading(false);
      };
      fetchTranslations();
    }
  }, [language]);

  const translate = (key: string) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);