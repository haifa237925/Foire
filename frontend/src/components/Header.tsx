
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 animate-fade-in"
        >
          <span className="text-2xl font-serif font-bold text-bookly-primary">Bookly</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
          <Link to="/" className="text-gray-700 hover:text-bookly-primary transition-colors">
            {t('home')}
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-bookly-primary transition-colors">
            {t('exploreLibrary')}
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-bookly-primary transition-colors">
            {t('about')}
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-bookly-primary transition-colors">
            {t('contact')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4 animate-fade-in">
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.firstName || user?.email}
              </span>
              <Button
                variant="outline"
                className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white"
                onClick={logout}
              >
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-bookly-primary hover:bg-bookly-secondary text-white">
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link to="/" className="text-gray-700 hover:text-bookly-primary transition-colors py-2">
              {t('home')}
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-bookly-primary transition-colors py-2">
              {t('exploreLibrary')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-bookly-primary transition-colors py-2">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-bookly-primary transition-colors py-2">
              {t('contact')}
            </Link>
            
            <div className="border-t border-gray-100 pt-3 mt-2">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <span className="text-sm text-gray-600">
                    {user?.firstName || user?.email}
                  </span>
                  <Button
                    variant="outline"
                    className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white w-full"
                    onClick={logout}
                  >
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white w-full">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="bg-bookly-primary hover:bg-bookly-secondary text-white w-full">
                      {t('register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
