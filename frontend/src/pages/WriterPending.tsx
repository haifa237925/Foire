
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WriterPending = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-br from-white to-blue-50 animate-fade-in">
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-bookly-primary" />
            </div>
            
            <h1 className="text-3xl font-serif font-bold mb-4">{t('pendingApproval')}</h1>
            
            <p className="text-gray-600 mb-8">
              {t('pendingMessage')}
            </p>
            
            <div className="border-t border-b border-gray-100 py-6 my-6">
              <h3 className="text-lg font-medium mb-4">What happens next?</h3>
              
              <div className="flex items-start space-x-4 text-left mb-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-bookly-primary font-medium">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Application review</h4>
                  <p className="text-gray-600 text-sm">
                    Our team will review your writer application
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 text-left mb-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-bookly-primary font-medium">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Email notification</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email regarding your application status
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 text-left">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-bookly-primary font-medium">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Start publishing</h4>
                  <p className="text-gray-600 text-sm">
                    Once approved, you can start publishing your books
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 mb-8 flex items-start text-left">
              <CheckCircle className="text-green-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-800">
                While your writer account is being approved, you can still use Bookly as a reader.
              </p>
            </div>
            
            <Link to="/">
              <Button className="bg-bookly-primary hover:bg-bookly-secondary text-white">
                <Home className="mr-2 h-4 w-4" />
                {t('backToHome')}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WriterPending;
