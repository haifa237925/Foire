
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Star, Headphones, Book } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Types de livres
interface Book {
  id: number;
  title: string;
  author: string;
  authorId: number;
  cover: string;
  rating: number;
  isAudiobook?: boolean;
  price: number;
  releaseDate: string;
  language: string;
  category: string;
  subcategory?: string;
}

const CategoryPage = () => {
  const { type, categoryName } = useParams<{ type: string; categoryName: string }>();
  const { language } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Traductions
  const translations = {
    search: {
      en: 'Search',
      fr: 'Rechercher',
      ar: 'بحث'
    },
    advancedSearch: {
      en: 'Advanced Search',
      fr: 'Recherche Avancée',
      ar: 'بحث متقدم'
    },
    price: {
      en: 'Price',
      fr: 'Prix',
      ar: 'السعر'
    },
    language: {
      en: 'Language',
      fr: 'Langue',
      ar: 'اللغة'
    },
    rating: {
      en: 'Rating',
      fr: 'Évaluation',
      ar: 'تقييم'
    },
    sortBy: {
      en: 'Sort by',
      fr: 'Trier par',
      ar: 'ترتيب حسب'
    },
    relevance: {
      en: 'Relevance',
      fr: 'Pertinence',
      ar: 'الصلة'
    },
    newest: {
      en: 'Newest',
      fr: 'Plus récent',
      ar: 'الأحدث'
    },
    priceAsc: {
      en: 'Price: Low to High',
      fr: 'Prix: Croissant',
      ar: 'السعر: من الأقل إلى الأعلى'
    },
    priceDesc: {
      en: 'Price: High to Low',
      fr: 'Prix: Décroissant',
      ar: 'السعر: من الأعلى إلى الأقل'
    },
    apply: {
      en: 'Apply Filters',
      fr: 'Appliquer les filtres',
      ar: 'تطبيق الفلاتر'
    },
    reset: {
      en: 'Reset',
      fr: 'Réinitialiser',
      ar: 'إعادة التعيين'
    },
    results: {
      en: 'results',
      fr: 'résultats',
      ar: 'نتائج'
    }
  };

  // Générer des livres fictifs pour la démo
  useEffect(() => {
    const isAudiobook = type === 'audiobook';
    
    // Générer des titres basés sur la catégorie
    const generateTitle = (index: number) => {
      const categoryPrefix = categoryName?.split('-').join(' ') || 'Unknown';
      return `${categoryPrefix} Book ${index + 1}${isAudiobook ? ' (Audio Edition)' : ''}`;
    };

    // Générer des langues
    const languages = ['English', 'French', 'Spanish', 'German', 'Arabic'];

    // Générer des données fictives
    const mockBooks: Book[] = Array(20).fill(null).map((_, index) => ({
      id: index + 100,
      title: generateTitle(index),
      author: `Author ${index % 8 + 1}`,
      authorId: index % 8 + 1,
      cover: '/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png',
      rating: Math.min(5, Math.floor(Math.random() * 50 + 30) / 10), // Valeur entre 3.0 et 5.0
      isAudiobook,
      price: Math.floor(Math.random() * 40) + 10, // Prix entre 10 et 49
      releaseDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      language: languages[Math.floor(Math.random() * languages.length)],
      category: categoryName || 'general',
      subcategory: Math.random() > 0.5 ? `Subcategory ${Math.floor(Math.random() * 3 + 1)}` : undefined
    }));

    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, [type, categoryName]);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    let result = [...books];
    
    // Filtre par recherche
    if (searchQuery) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par prix
    result = result.filter(book => book.price >= priceRange[0] && book.price <= priceRange[1]);
    
    // Filtre par langue
    if (selectedLanguages.length > 0) {
      result = result.filter(book => selectedLanguages.includes(book.language));
    }
    
    // Filtre par note
    if (selectedRating !== null) {
      result = result.filter(book => Math.floor(book.rating) >= selectedRating);
    }
    
    // Tri
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // Par défaut, ne change pas l'ordre
        break;
    }
    
    setFilteredBooks(result);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 100]);
    setSelectedLanguages([]);
    setSelectedRating(null);
    setSortBy('relevance');
    setFilteredBooks(books);
  };

  // Fonction pour générer les étoiles en fonction de la note
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar pour les filtres */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="sticky top-28">
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{translations.advancedSearch[language]}</h2>
            
              <div className="space-y-6">
                {/* Recherche par texte */}
                <div>
                  <Label htmlFor="search">{translations.search[language]}</Label>
                  <Input
                    id="search"
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
              
                {/* Filtre par prix */}
                <div>
                  <Accordion type="single" collapsible defaultValue="price">
                    <AccordionItem value="price">
                      <AccordionTrigger className="text-sm font-medium">{translations.price[language]}</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-8">
                          <Slider
                            defaultValue={priceRange}
                            max={100}
                            step={1}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="my-4"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              
                {/* Filtre par langue */}
                <div>
                  <Accordion type="single" collapsible defaultValue="language">
                    <AccordionItem value="language">
                      <AccordionTrigger className="text-sm font-medium">{translations.language[language]}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {['English', 'French', 'Spanish', 'German', 'Arabic'].map((lang) => (
                            <div key={lang} className="flex items-center">
                              <Checkbox 
                                id={`lang-${lang}`}
                                checked={selectedLanguages.includes(lang)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedLanguages([...selectedLanguages, lang]);
                                  } else {
                                    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`lang-${lang}`} 
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {lang}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              
                {/* Filtre par note */}
                <div>
                  <Accordion type="single" collapsible defaultValue="rating">
                    <AccordionItem value="rating">
                      <AccordionTrigger className="text-sm font-medium">{translations.rating[language]}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {[4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center">
                              <Checkbox 
                                id={`rating-${stars}`}
                                checked={selectedRating === stars}
                                onCheckedChange={(checked) => {
                                  setSelectedRating(checked ? stars : null);
                                }}
                              />
                              <label 
                                htmlFor={`rating-${stars}`} 
                                className="ml-2 flex items-center"
                              >
                                <div className="flex">
                                  {Array(stars).fill(0).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                  {Array(5 - stars).fill(0).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-gray-300" />
                                  ))}
                                </div>
                                <span className="text-xs ml-1">& up</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              
                {/* Tri */}
                <div>
                  <Label htmlFor="sort">{translations.sortBy[language]}</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort" className="mt-1">
                      <SelectValue placeholder={translations.relevance[language]} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{translations.relevance[language]}</SelectItem>
                      <SelectItem value="newest">{translations.newest[language]}</SelectItem>
                      <SelectItem value="priceAsc">{translations.priceAsc[language]}</SelectItem>
                      <SelectItem value="priceDesc">{translations.priceDesc[language]}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
                <div className="flex gap-3 pt-2">
                  <Button onClick={applyFilters} className="flex-1">
                    {translations.apply[language]}
                  </Button>
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    {translations.reset[language]}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          {/* En-tête de la page */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold capitalize mb-2">
              {categoryName?.split('-').join(' ')} {type === 'audiobook' ? 'Audiobooks' : 'eBooks'}
            </h1>
            <p className="text-muted-foreground">
              {filteredBooks.length} {translations.results[language]}
            </p>
          </div>
          
          {/* Grille de livres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="block">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative pb-[140%]">
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="absolute inset-0 h-full w-full object-cover" 
                    />
                    {book.isAudiobook && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-white p-1 rounded-md">
                        <Headphones className="h-4 w-4" />
                      </div>
                    )}
                    {!book.isAudiobook && (
                      <div className="absolute top-2 right-2 bg-secondary/90 text-secondary-foreground p-1 rounded-md">
                        <Book className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <Link to={`/author/${book.authorId}`} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      {book.author}
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      {renderRating(book.rating)}
                      <span className="font-medium">${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;