
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, PenTool, Headphones, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewReleasesSection from '@/components/NewReleasesSection';
import BestSellersSection from '@/components/BestSellersSection';
const Index = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {t('welcome')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                A digital platform connecting writers and readers. Discover, read, and publish books in digital and audio formats.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register/reader">
                  <Button className="bg-bookly-primary hover:bg-bookly-secondary text-white px-6 py-3 rounded-md flex items-center gap-2 text-lg">
                    {t('readBooks')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/register/writer">
                  <Button variant="outline" className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white px-6 py-3 rounded-md flex items-center gap-2 text-lg">
                    {t('publishBooks')}
                    <PenTool size={18} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-bookly-primary/10 rounded-full -z-10 animate-pulse" />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-bookly-accent/20 rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
                <img 
                  src="/books-stack.png" 
                  alt="Books and digital devices" 
                  className="rounded-lg shadow-2xl max-w-full h-auto object-cover"
                  onError={(e) => {
                    // Fallback if the image doesn't exist
                    e.currentTarget.src = "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <BestSellersSection />
      <NewReleasesSection />
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              A complete platform for readers and writers
            </h2>
            <p className="text-gray-600">
              Discover all the features Bookly offers to enhance your reading and writing experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-bookly-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-bookly-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Digital Library</h3>
              <p className="text-gray-600">
                Access thousands of digital books from any device, anywhere, anytime.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-bookly-primary/10 rounded-full flex items-center justify-center mb-4">
                <Headphones className="text-bookly-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Audiobooks</h3>
              <p className="text-gray-600">
                Listen to your favorite books with our high-quality audiobook player.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-bookly-primary/10 rounded-full flex items-center justify-center mb-4">
                <PenTool className="text-bookly-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Publishing Tools</h3>
              <p className="text-gray-600">
                Easy-to-use tools for writers to publish and manage their books.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-bookly-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-bookly-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Content Protection</h3>
              <p className="text-gray-600">
                Advanced security features to protect authors' intellectual property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Readers */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 animate-slide-up">
              <h3 className="text-2xl font-serif font-bold mb-4">{t('discoverBooks')}</h3>
              <p className="text-gray-600 mb-6">
                Explore our vast library of books across different genres. Read on any device with our seamless reading experience.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">Access to thousands of digital books</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">High-quality audiobooks with advanced player</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">Personalized reading recommendations</span>
                </li>
              </ul>
              <Link to="/register/reader">
                <Button className="w-full bg-bookly-primary hover:bg-bookly-secondary text-white">
                  {t('exploreLibrary')}
                </Button>
              </Link>
            </div>
            
            {/* For Writers */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-serif font-bold mb-4">{t('shareBooks')}</h3>
              <p className="text-gray-600 mb-6">
                Publish your books and reach readers worldwide. Our platform provides all the tools you need to succeed.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">Easy-to-use publishing tools</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">Detailed analytics and sales reports</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-600">Content protection and copyright management</span>
                </li>
              </ul>
              <Link to="/register/writer">
                <Button className="w-full bg-bookly-primary hover:bg-bookly-secondary text-white">
                  {t('becomeAuthor')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
