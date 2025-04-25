import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, PenTool, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const { t } = useLanguage();

  // Configuration commune pour toutes les cartes
  const cardBaseClasses = "bg-white rounded-lg p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center h-full";

  const accountTypes = [
    {
      type: 'reader',
      title: t('reader'),
      description: t('readerDescription'),
      icon: <BookOpen className="text-indigo-600" size={28} />,
      iconBg: 'bg-blue-100',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      to: '/register/reader'
    },
    {
      type: 'writer',
      title: t('writer'),
      description: t('writerDescription'),
      icon: <PenTool className="text-indigo-600" size={28} />,
      iconBg: 'bg-indigo-100',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      to: '/register/writer',
      delay: '0.1s'
    },
    {
      type: 'publisher',
      title: t('PublishingCompany'), // "Maison d'édition" dans les traductions
      description: t('Publishing company'),
      icon: <Building2 className="text-indigo-600" size={28} />,
      iconBg: 'bg-indigo-100',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      to: '/register/publisher',
      delay: '0.2s'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gradient-to-br from-white to-blue-50">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">{t('chooseAccountType')}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('createAccount')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {accountTypes.map((account) => (
              <Link 
                key={account.type}
                to={account.to}
                className={cardBaseClasses}
                style={{ animationDelay: account.delay || '0s' }}
              >
                <div className={`w-14 h-14 ${account.iconBg} rounded-full flex items-center justify-center mb-4`}>
                  {account.icon}
                </div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{account.title}</h2>
                <p className="text-gray-600 text-sm mb-6 px-2 flex-grow">{account.description}</p>
                <div className="w-full mt-auto pt-2">
                  <div className={`${account.buttonBg} text-white py-2.5 px-4 rounded-md font-medium transition-colors text-sm w-full`}>
                    {t('signUp')} &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4">
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