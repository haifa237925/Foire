import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
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
  cover: string;
  rating: number;
}

const NewReleasesSection: React.FC = () => {
  const { language } = useLanguage();
  
  // Title translations
  const sectionTitle = {
    en: 'New Releases',
    fr: 'Nouvelles parutions',
    ar: 'الإصدارات الجديدة'
  };

  // Button text translations
  const buttonText = {
    en: 'Discover',
    fr: 'Découvrir',
    ar: 'اكتشف'
  };

  // Mock data for new releases
  const newReleases: Book[] = [
    {
      id: 1,
      title: 'Le Mystère des Étoiles',
      author: 'Sophie Laurent',
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.5
    },
    {
      id: 2,
      title: 'L\'Horizon Perdu',
      author: 'Thomas Mercier',
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.2
    },
    {
      id: 3,
      title: 'Échos du Passé',
      author: 'Julie Dupont',
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.7
    },
    {
      id: 4,
      title: 'La Porte des Secrets',
      author: 'Michel Blanc',
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: 4.3
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
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{sectionTitle[language]}</h2>
        
        <Carousel className="w-full">
          <CarouselContent>
            {newReleases.map((book) => (
              <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/book/${book.id}`} className="block h-full">
                  <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <div className="mt-2">
                        {renderRating(book.rating)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button size="sm" variant="outline" className="w-full">
                        {buttonText[language]}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default NewReleasesSection;
