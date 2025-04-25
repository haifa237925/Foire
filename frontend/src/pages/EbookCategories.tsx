import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Book, BookOpen, Bookmark, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EbookCategories = () => {
  const { language } = useLanguage();
  
  // Traductions
  const translations = {
    pageTitle: {
      en: 'eBook Categories',
      fr: 'Catégories d\'eBooks',
      ar: 'فئات الكتب الإلكترونية'
    },
    popular: {
      en: 'Popular Categories',
      fr: 'Catégories Populaires',
      ar: 'الفئات الشعبية'
    },
    all: {
      en: 'All Categories',
      fr: 'Toutes les Catégories',
      ar: 'جميع الفئات'
    },
    browse: {
      en: 'Browse',
      fr: 'Parcourir',
      ar: 'تصفح'
    }
  };

  // Définition des catégories et sous-catégories
  const categories = [
    {
      name: 'Inspiration & Personal Growth',
      subcategories: ['Personal Development', 'Motivation & Inspiration'],
      icon: <Star className="h-8 w-8" />,
      count: 342,
      color: 'bg-blue-100'
    },
    {
      name: 'Health & Meditation',
      subcategories: ['Productivity', 'Religion & Spirituality'],
      icon: <BookOpen className="h-8 w-8" />,
      count: 218,
      color: 'bg-green-100'
    },
    {
      name: 'Career & Business',
      subcategories: ['Communication Skills', 'Education'],
      icon: <MessageCircle className="h-8 w-8" />,
      count: 185,
      color: 'bg-yellow-100'
    },
    {
      name: 'Relationship & Family',
      subcategories: ['Philosophy'],
      icon: <Bookmark className="h-8 w-8" />,
      count: 125,
      color: 'bg-purple-100'
    },
    {
      name: 'Science & Technology',
      subcategories: ['Creativity'],
      icon: <Book className="h-8 w-8" />,
      count: 237,
      color: 'bg-red-100'
    },
    {
      name: 'Culture & Humanity',
      subcategories: ['Biography & Memoir'],
      icon: <BookOpen className="h-8 w-8" />,
      count: 164,
      color: 'bg-indigo-100'
    },
    {
      name: 'Money & Economics',
      subcategories: [],
      icon: <Book className="h-8 w-8" />,
      count: 92,
      color: 'bg-orange-100'
    },
    {
      name: 'Fiction',
      subcategories: [],
      icon: <Bookmark className="h-8 w-8" />,
      count: 475,
      color: 'bg-pink-100'
    }
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{translations.pageTitle[language]}</h1>
      </div>
      
      <Tabs defaultValue="popular" className="mb-12">
        <TabsList>
          <TabsTrigger value="popular">{translations.popular[language]}</TabsTrigger>
          <TabsTrigger value="all">{translations.all[language]}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <Link 
                key={index} 
                to={`/category/ebook/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className={`flex flex-row items-center gap-4 ${category.color} rounded-t-lg`}>
                    <div className="p-2 rounded-full bg-white/80">
                      {category.icon}
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{category.count} eBooks</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {translations.browse[language]}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/category/ebook/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className={`flex flex-row items-center gap-4 ${category.color} rounded-t-lg`}>
                    <div className="p-2 rounded-full bg-white/80">
                      {category.icon}
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{category.count} eBooks</p>
                    {category.subcategories.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Subcategories:</p>
                        <ul className="text-sm space-y-1">
                          {category.subcategories.map((subcat, subIndex) => (
                            <li key={subIndex}>
                              <Link 
                                to={`/category/ebook/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                                className="hover:text-primary hover:underline"
                              >
                                {subcat}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {translations.browse[language]}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookCategories;