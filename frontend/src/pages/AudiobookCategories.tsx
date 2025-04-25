import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Headphones, Music, BookOpen, Bookmark, MessageCircle, Star, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AudiobookCategories = () => {
  const { language } = useLanguage();
  
  // Traductions
  const translations = {
    pageTitle: {
      en: 'Audiobook Categories',
      fr: 'Catégories de Livres Audio',
      ar: 'فئات الكتب الصوتية'
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
      name: 'Bestselling Audiobooks',
      subcategories: [],
      icon: <Star className="h-8 w-8" />,
      count: 124,
      color: 'bg-yellow-100'
    },
    {
      name: 'Self-Development',
      subcategories: ['Mindfulness', 'Productivity'],
      icon: <BookOpen className="h-8 w-8" />,
      count: 186,
      color: 'bg-blue-100'
    },
    {
      name: 'Fiction & Literature',
      subcategories: ['Novels', 'Short Stories', 'Poetry'],
      icon: <Book className="h-8 w-8" />,
      count: 372,
      color: 'bg-purple-100'
    },
    {
      name: 'Business & Career',
      subcategories: ['Leadership', 'Management'],
      icon: <MessageCircle className="h-8 w-8" />,
      count: 145,
      color: 'bg-green-100'
    },
    {
      name: 'Science & Technology',
      subcategories: ['Popular Science', 'Technology'],
      icon: <Bookmark className="h-8 w-8" />,
      count: 98,
      color: 'bg-indigo-100'
    },
    {
      name: 'Language Learning',
      subcategories: [],
      icon: <Headphones className="h-8 w-8" />,
      count: 64,
      color: 'bg-red-100'
    },
    {
      name: 'Children & Young Adult',
      subcategories: [],
      icon: <Music className="h-8 w-8" />,
      count: 127,
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
                to={`/category/audiobook/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <p className="text-muted-foreground">{category.count} audiobooks</p>
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
                to={`/category/audiobook/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <p className="text-muted-foreground">{category.count} audiobooks</p>
                    {category.subcategories.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Subcategories:</p>
                        <ul className="text-sm space-y-1">
                          {category.subcategories.map((subcat, subIndex) => (
                            <li key={subIndex}>
                              <Link 
                                to={`/category/audiobook/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
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

export default AudiobookCategories;