
import { compareAsc } from 'date-fns';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

// Add all translations here
const translations: Translations = {
  welcome: {
    en: 'Read, Listen, Publish    All in one place',
    fr: 'Lisez, Écoutez, Publiez    Tout en un seul lieu',
    ar: 'اقرأ، استمع، انشر  كل ذلك في مكان واحد'
  },
  login: {
    en: 'Sign in',
    fr: 'Se connecter',
    ar: 'تسجيل الدخول'
  },
  register: {
    en: 'Register',
    fr: "S'inscrire",
    ar: 'التسجيل'
  },
  email: {
    en: 'Email',
    fr: 'Email',
    ar: 'البريد الإلكتروني'
  },
  password: {
    en: 'Password',
    fr: 'Mot de passe',
    ar: 'كلمة المرور'
  },
  confirmPassword: {
    en: 'Confirm Password',
    fr: 'Confirmer le mot de passe',
    ar: 'تأكيد كلمة المرور'
  },
  forgotPassword: {
    en: 'Forgot password?',
    fr: 'Mot de passe oublié?',
    ar: 'نسيت كلمة المرور؟'
  },
  rememberMe: {
    en: 'Remember me',
    fr: 'Se souvenir de moi',
    ar: 'تذكرني'
  },
  orSignInWith: {
    en: 'Or sign in with',
    fr: 'Ou se connecter avec',
    ar: 'أو تسجيل الدخول باستخدام'
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte ?",
    ar: 'ليس لديك حساب؟'
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    fr: 'Vous avez déjà un compte ?',
    ar: 'لديك حساب بالفعل؟'
  },
  signUp: {
    en: 'Sign up',
    fr: "S'inscrire",
    ar: 'التسجيل'
  },
  chooseAccountType: {
    en: 'Choose your account type',
    fr: 'Choisissez votre type de compte',
    ar: 'اختر نوع حسابك'
  },
  reader: {
    en: 'Reader',
    fr: 'Lecteur',
    ar: 'قارئ'
  },
  writer: {
    en: 'Writer',
    fr: 'Écrivain',
    ar: 'كاتب'
  },
  PublishingCompany: {
    en: 'Publishing house',
    fr: 'Maison d edition',
    ar: 'دار النشر'
  },


  readerDescription: {
    en: 'I want to read books',
    fr: 'Je veux lire des livres',
    ar: 'أريد قراءة الكتب'
  },
  writerDescription: {
    en: 'I want to publish books',
    fr: 'Je veux publier des livres',
    ar: 'أريد نشر الكتب'
  },
  firstName: {
    en: 'First Name',
    fr: 'Prénom',
    ar: 'الاسم الأول'
  },
  lastName: {
    en: 'Last Name',
    fr: 'Nom',
    ar: 'اسم العائلة'
  },
  username: {
    en: 'Username',
    fr: "Nom d'utilisateur",
    ar: 'اسم المستخدم'
  },
  bio: {
    en: 'Biography',
    fr: 'Biographie',
    ar: 'السيرة الذاتية'
  },
  website: {
    en: 'Website',
    fr: 'Site web',
    ar: 'الموقع الإلكتروني'
  },
  profilePhoto: {
    en: 'Profile Photo',
    fr: 'Photo de profil',
    ar: 'صورة الملف الشخصي'
  },
  genres: {
    en: 'Literary Genres',
    fr: 'Genres littéraires',
    ar: 'الأنواع الأدبية'
  },
  languages: {
    en: 'Writing Languages',
    fr: "Langues d'écriture",
    ar: 'لغات الكتابة'
  },
  termsAgree: {
    en: 'I agree to the terms and conditions',
    fr: "J'accepte les termes et conditions",
    ar: 'أوافق على الشروط والأحكام'
  },
  submit: {
    en: 'Submit',
    fr: 'Soumettre',
    ar: 'إرسال'
  },
  pendingApproval: {
    en: 'Your account is pending approval',
    fr: "Votre compte est en attente d'approbation",
    ar: 'حسابك في انتظار الموافقة'
  },
  pendingMessage: {
    en: 'Thank you for registering as a writer. Your account is currently under review. We will notify you once your account has been approved.',
    fr: "Merci de vous être inscrit en tant qu'écrivain. Votre compte est actuellement en cours d'examen. Nous vous notifierons une fois que votre compte aura été approuvé.",
    ar: 'شكرا لتسجيلك كمؤلف. حسابك قيد المراجعة حاليا. سنخطرك بمجرد الموافقة على حسابك.'
  },
  backToHome: {
    en: 'Back to Home',
    fr: "Retour à l'accueil",
    ar: 'العودة إلى الصفحة الرئيسية'
  },
  readBooks: {
    en: 'Read Books',
    fr: 'Lire des livres',
    ar: 'قراءة الكتب'
  },
  publishBooks: {
    en: 'Publish Your Books',
    fr: 'Publiez vos livres',
    ar: 'انشر كتبك'
  },
  discoverBooks: {
    en: 'Discover thousands of books',
    fr: 'Découvrez des milliers de livres',
    ar: 'اكتشف آلاف الكتب'
  },
  shareBooks: {
    en: 'Share your literary creations',
    fr: 'Partagez vos créations littéraires',
    ar: 'شارك إبداعاتك الأدبية'
  },
  exploreLibrary: {
    en: 'Explore Library',
    fr: 'Explorer la bibliothèque',
    ar: 'استكشاف المكتبة'
  },
  becomeAuthor: {
    en: 'Become an Author',
    fr: 'Devenir auteur',
    ar: 'كن مؤلفًا'
  },
  footer: {
    en: '© 2023 Bookly. All rights reserved.',
    fr: '© 2023 Bookly. Tous droits réservés.',
    ar: '© 2023 بوكلي. جميع الحقوق محفوظة.'
  },
  connectToAccount: {
    en: 'Connect to your account',
    fr: 'Connectez-vous à votre compte',
    ar: 'تواصل مع حسابك'
  },
  createAccount: {
    en: 'Create your account',
    fr: 'Créez votre compte',
    ar: 'أنشئ حسابك'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage, default to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
    
    // Update document direction for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
