import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Book, User, Calendar, Award, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AuthorBooksType {
  id: number;
  title: string;
  cover: string;
  year: string;
}

const AuthorPage = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { language } = useLanguage();

  // Translations
  const translations = {
    backToBook: {
      en: 'Back to book',
      fr: 'Retour au livre',
      ar: 'العودة إلى الكتاب'
    },
    biography: {
      en: 'Biography',
      fr: 'Biographie',
      ar: 'السيرة الذاتية'
    },
    books: {
      en: 'Books',
      fr: 'Livres',
      ar: 'كتب'
    },
    awards: {
      en: 'Awards & Recognition',
      fr: 'Prix et Reconnaissance',
      ar: 'الجوائز والتقدير'
    },
    viewAll: {
      en: 'View all books',
      fr: 'Voir tous les livres',
      ar: 'عرض جميع الكتب'
    }
  };

  // Mock data for the author (in a real app, you would fetch this from an API)
  const authorData = {
    id: authorId,
    name: "Charles Baudelaire",
    image: "/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png",
    birthYear: "1821",
    deathYear: "1867",
    biography: language === 'en' 
      ? "Charles Baudelaire was a French poet best known for his collection 'Les Fleurs du Mal' (The Flowers of Evil). His work, which influenced a whole generation of poets, largely concerns themes relating to decadence and eroticism, particularly focusing on the fleeting nature of beauty."
      : language === 'fr'
      ? "Charles Baudelaire était un poète français surtout connu pour son recueil 'Les Fleurs du Mal'. Son œuvre, qui a influencé toute une génération de poètes, traite principalement de thèmes liés à la décadence et à l'érotisme, en se concentrant particulièrement sur la nature éphémère de la beauté."
      : "شارل بودلير كان شاعراً فرنسياً اشتهر بمجموعته الشعرية 'زهور الشر'. أعماله، التي أثرت في جيل كامل من الشعراء، تتناول في الغالب مواضيع تتعلق بالانحطاط والإيروتيكية، مع التركيز بشكل خاص على الطبيعة الزائلة للجمال.",
    awards: [
      {
        year: "1857",
        name: language === 'en' ? "Publication of Les Fleurs du Mal" : language === 'fr' ? "Publication des Fleurs du Mal" : "نشر زهور الشر"
      },
      {
        year: "1861",
        name: language === 'en' ? "Second edition of Les Fleurs du Mal" : language === 'fr' ? "Deuxième édition des Fleurs du Mal" : "الطبعة الثانية من زهور الشر"
      }
    ],
    books: [
      {
        id: 1,
        title: "Les Fleurs du Mal",
        cover: "/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png",
        year: "1857"
      },
      {
        id: 4,
        title: "Le Spleen de Paris",
        cover: "/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png",
        year: "1869"
      },
      {
        id: 5,
        title: "Les Paradis artificiels",
        cover: "/lovable-uploads/6ca72849-5774-4154-9d7c-f22991fb1fcb.png",
        year: "1860"
      }
    ],
    website: "https://en.wikipedia.org/wiki/Charles_Baudelaire"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/book/1" className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
          <ChevronLeft size={18} />
          <span>{translations.backToBook[language]}</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Profile */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary mb-4">
                <img 
                  src={authorData.image} 
                  alt={authorData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-center">{authorData.name}</h1>
              <p className="text-gray-500 text-center">({authorData.birthYear} - {authorData.deathYear})</p>

              {authorData.website && (
                <a 
                  href={authorData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-primary hover:underline"
                >
                  <LinkIcon size={16} className="mr-1" />
                  Wikipedia
                </a>
              )}
            </div>
          </div>

          {/* Author Details */}
          <div className="md:col-span-2">
            {/* Biography */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="mr-2 text-primary" />
                {translations.biography[language]}
              </h2>
              <p className="text-gray-700 leading-relaxed">{authorData.biography}</p>
            </section>

            {/* Books */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Book className="mr-2 text-primary" />
                  {translations.books[language]}
                </h2>
                <Button variant="outline" size="sm">
                  {translations.viewAll[language]}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {authorData.books.map((book: AuthorBooksType) => (
                  <Link key={book.id} to={`/book/${book.id}`}>
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-[2/3] overflow-hidden">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-500">{book.year}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Awards */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-2 text-primary" />
                {translations.awards[language]}
              </h2>
              <ul className="space-y-3">
                {authorData.awards.map((award, index) => (
                  <li key={index} className="flex items-start gap-3 border-l-2 border-primary pl-4 py-1">
                    <span className="font-semibold min-w-[40px]">{award.year}</span>
                    <span>{award.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthorPage;