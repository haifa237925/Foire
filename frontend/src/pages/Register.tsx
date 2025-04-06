
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, PenTool } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-br from-white to-blue-50 animate-fade-in">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{t('chooseAccountType')}</h1>
            <p className="text-gray-600">{t('createAccount')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reader Option */}
            <Link 
              to="/register/reader"
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center animate-slide-up"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="text-bookly-primary" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-medium mb-3">{t('reader')}</h2>
              <p className="text-gray-600 mb-6">{t('readerDescription')}</p>
              <div className="mt-auto pt-4 w-full">
                <div className="bg-bookly-primary text-white py-2.5 px-4 rounded-md font-medium transition-colors hover:bg-bookly-secondary">
                  {t('signUp')} &rarr;
                </div>
              </div>
            </Link>
            
            {/* Writer Option */}
            <Link 
              to="/register/writer"
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <PenTool className="text-bookly-secondary" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-medium mb-3">{t('writer')}</h2>
              <p className="text-gray-600 mb-6">{t('writerDescription')}</p>
              <div className="mt-auto pt-4 w-full">
                <div className="bg-bookly-secondary text-white py-2.5 px-4 rounded-md font-medium transition-colors hover:bg-bookly-primary">
                  {t('signUp')} &rarr;
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-bookly-primary hover:text-bookly-secondary font-medium">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
