import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Type for book data
interface Book {
  id: number;
  title: string;
  author: string;
  authorId: number;
  cover: string;
  rating: number;
  sales: string;
}

const BestSellersSection: React.FC = () => {
  const { language } = useLanguage();
  
  // Title translations
  const sectionTitle = {
    en: 'Best Sellers',
    fr: 'Meilleures ventes',
    ar: 'الأكثر مبيعًا'
  };

  // Button text translations
  const buttonText = {
    en: 'Read now',
    fr: 'Lire maintenant',
    ar: 'اقرأ الآن'
  };

  const salesText = {
    en: 'copies sold',
    fr: 'exemplaires vendus',
    ar: 'نسخة مباعة'
  };

  // Mock data for best sellers
  const bestSellers: Book[] = [
    {
      id: 1,
      title: 'Les Fleurs du Mal',
      author: 'Charles Baudelaire',
      authorId: 1,
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.8,
      sales: '500K+'
    },
    {
      id: 2,
      title: 'Notre-Dame de Paris',
      author: 'Victor Hugo',
      authorId: 2,
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.9,
      sales: '1M+'
    },
    {
      id: 3,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      authorId: 3,
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 5.0,
      sales: '2M+'
    }
  ];

  // Function to render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="fill-yellow-400 text-yellow-400" size={16} fill="url(#half)" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
    }
    
    return (
      <div className="flex items-center">
        <svg width="0" height="0">
          <defs>
            <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
        </svg>
        {stars}
      </div>
    );
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{sectionTitle[language]}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((book) => (
            <div key={book.id} className="block">
              <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-full md:w-1/3 aspect-[2/3] overflow-hidden rounded-md">
                  <Link to={`/book/${book.id}`}>
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                </div>
                <div className="flex-1">
                  <Link to={`/book/${book.id}`} className="block">
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <Link to={`/author/${book.authorId}`} className="text-gray-600 mb-2 hover:text-primary hover:underline">
                    {book.author}
                  </Link>
                  {renderRating(book.rating)}
                  <p className="text-sm font-medium text-green-600 mt-2">
                    {book.sales} {salesText[language]}
                  </p>
                  <Link to={`/book/${book.id}`}>
                    <Button className="mt-4 w-full" size="sm">
                      {buttonText[language]}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
