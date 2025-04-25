import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, BookOpen, Users, Calendar, ChevronLeft, Headphones, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BookDetails {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  readers: string;
  publishDate: string;
  price: string;
  description: string;
  categories: string[];
  hasAudioVersion: boolean;
  audioSample?: string;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Translations
  const translations = {
    backToHome: {
      en: 'Back to home',
      fr: 'Retour à l\'accueil',
      ar: 'العودة إلى الصفحة الرئيسية'
    },
    pages: {
      en: 'Pages',
      fr: 'Pages',
      ar: 'صفحات'
    },
    readers: {
      en: 'Readers',
      fr: 'Lecteurs',
      ar: 'القراء'
    },
    published: {
      en: 'Published',
      fr: 'Publié',
      ar: 'نشر'
    },
    buyNow: {
      en: 'Buy Now',
      fr: 'Acheter maintenant',
      ar: 'اشتري الآن'
    },
    addToCart: {
      en: 'Add to cart',
      fr: 'Ajouter au panier',
      ar: 'أضف إلى السلة'
    },
    description: {
      en: 'Description',
      fr: 'Description',
      ar: 'وصف'
    },
    categories: {
      en: 'Categories',
      fr: 'Catégories',
      ar: 'فئات'
    },
    audioVersion: {
      en: 'Audio Version',
      fr: 'Version Audio',
      ar: 'النسخة الصوتية'
    },
    audioAvailable: {
      en: 'Audio version available',
      fr: 'Version audio disponible',
      ar: 'النسخة الصوتية متاحة'
    },
    audioUnavailable: {
      en: 'Audio version not available',
      fr: 'Version audio non disponible',
      ar: 'النسخة الصوتية غير متاحة'
    },
    listenSample: {
      en: 'Listen to sample',
      fr: 'Écouter un extrait',
      ar: 'استمع إلى العينة'
    },
    pause: {
      en: 'Pause',
      fr: 'Pause',
      ar: 'توقف'
    }
  };

  // Mocked data for a book (in a real app, you would fetch this data from an API)
  const bookData: BookDetails = {
    id: id || '1',
    title: 'Les Fleurs du Mal',
    author: 'Charles Baudelaire',
    cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
    rating: 4.8,
    pages: 320,
    readers: '500K+',
    publishDate: '1857',
    price: '24.99€',
    description: language === 'en' 
      ? 'Les Fleurs du Mal (The Flowers of Evil) is a volume of French poetry by Charles Baudelaire. First published in 1857, it was important in the symbolist and modernist movements. The poems deal with themes relating to decadence and eroticism.'
      : language === 'fr'
      ? 'Les Fleurs du mal est un recueil de poèmes de Charles Baudelaire, englobant la quasi-totalité de sa production en vers, de 1840 jusqu\'à sa mort survenue fin août 1867. Ce recueil est l\'une des œuvres les plus importantes de la poésie moderne.'
      : 'زهور الشر هو ديوان شعر فرنسي من تأليف شارل بودلير. نُشر لأول مرة عام 1857، وكان له أهمية في الحركات الرمزية والحداثية. تتناول القصائد مواضيع تتعلق بالانحطاط والإيروتيكية.',
    categories: ['Poetry', 'Classic', 'French Literature'],
    hasAudioVersion: true,
    audioSample: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Example audio URL
  };

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

  // Handle audio playback
  const toggleAudio = () => {
    if (!audioElement && bookData.audioSample) {
      const audio = new Audio(bookData.audioSample);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    } else if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cleanup audio on component unmount
  React.useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
          <ChevronLeft size={18} />
          <span>{translations.backToHome[language]}</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="col-span-1 mb-6">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg mb-4">
              <img 
                src={bookData.cover} 
                alt={bookData.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Audio Version Availability */}
            <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${bookData.hasAudioVersion ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
              {bookData.hasAudioVersion ? (
                <Headphones className="shrink-0" />
              ) : (
                <VolumeX className="shrink-0" />
              )}
              <span className="font-medium">
                {bookData.hasAudioVersion 
                  ? translations.audioAvailable[language]
                  : translations.audioUnavailable[language]
                }
              </span>
            </div>
            
            {/* Audio Sample Player */}
            {bookData.hasAudioVersion && (
              <div className="mt-4">
                <Button 
                  onClick={toggleAudio}
                  variant="outline"
                  className="w-full"
                >
                  <Headphones className="mr-2" size={18} />
                  {isPlaying ? translations.pause[language] : translations.listenSample[language]}
                </Button>
                
                {isPlaying && (
                  <div className="mt-3 w-full">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3 animate-pulse-slow"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="col-span-1 lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{bookData.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{bookData.author}</p>
            
            <div className="flex items-center gap-2 mb-6">
              {renderRating(bookData.rating)}
              <span className="text-sm text-gray-500">({bookData.rating})</span>
            </div>
            
            {/* Book Metadata */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <BookOpen className="text-primary mb-2" size={20} />
                <p className="text-sm text-gray-500">{translations.pages[language]}</p>
                <p className="font-semibold">{bookData.pages}</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <Users className="text-primary mb-2" size={20} />
                <p className="text-sm text-gray-500">{translations.readers[language]}</p>
                <p className="font-semibold">{bookData.readers}</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <Calendar className="text-primary mb-2" size={20} />
                <p className="text-sm text-gray-500">{translations.published[language]}</p>
                <p className="font-semibold">{bookData.publishDate}</p>
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-2xl font-bold">{bookData.price}</p>
              <div className="flex gap-4">
                <Button>{translations.buyNow[language]}</Button>
                <Button variant="outline">{translations.addToCart[language]}</Button>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">{translations.description[language]}</h2>
              <p className="text-gray-700 leading-relaxed">{bookData.description}</p>
            </div>
            
            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold mb-4">{translations.categories[language]}</h2>
              <div className="flex flex-wrap gap-2">
                {bookData.categories.map((category, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetail;