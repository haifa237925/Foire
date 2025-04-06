
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold text-bookly-primary">Bookly</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              A platform connecting writers and readers, making literature accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-bookly-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-bookly-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-bookly-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-bookly-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">For Readers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Explore Books
                </Link>
              </li>
              <li>
                <Link to="/audiobooks" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Audiobooks
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/reading-lists" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Reading Lists
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">For Writers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/publish" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Publish a Book
                </Link>
              </li>
              <li>
                <Link to="/writer-guidelines" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Writer Guidelines
                </Link>
              </li>
              <li>
                <Link to="/royalties" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Royalties & Payments
                </Link>
              </li>
              <li>
                <Link to="/writer-resources" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-bookly-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t('footer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
