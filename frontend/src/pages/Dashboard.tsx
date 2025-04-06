import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  BarChart2, 
  History, 
  ShoppingCart, 
  Bookmark, 
  Settings, 
  Sun, 
  Search,
  LogOut
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 
  const booksInProgress = [
    { 
      id: 1, 
      title: 'Romeo ve Juliet', 
      author: 'William Shakespeare', 
      cover: '/placeholder.svg',
      progress: 35
    },
    { 
      id: 2, 
      title: 'Olağanüstü Bir Gece', 
      author: 'Stefan Zweig', 
      cover: '/placeholder.svg',
      progress: 45
    },
    { 
      id: 3, 
      title: 'Zaman Makinesi', 
      author: 'H. G. Wells', 
      cover: '/placeholder.svg',
      progress: 75
    },
    { 
      id: 4, 
      title: 'Melody', 
      author: 'Unknown Author', 
      cover: '/placeholder.svg',
      progress: 10
    },
  ];

  const recommendedBooks = [
    { 
      id: 1, 
      title: 'The Alchemist', 
      author: 'Paulo Coelho', 
      cover: '/placeholder.svg' 
    },
    { 
      id: 2, 
      title: 'Manuscript Found in Accra', 
      author: 'Paulo Coelho', 
      cover: '/placeholder.svg' 
    },
    { 
      id: 3, 
      title: 'Like the Flowing River', 
      author: 'Paulo Coelho', 
      cover: '/placeholder.svg' 
    },
    { 
      id: 4, 
      title: 'The Pilgrimage', 
      author: 'Paulo Coelho', 
      cover: '/placeholder.svg' 
    },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2">
              <h1 className="text-2xl font-bold text-bookly-primary">Bookly</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" isActive>
                  <LayoutDashboard className="mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                  <User className="mr-2" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Forms">
                  <FileText className="mr-2" />
                  <span>Forms</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Analytics">
                  <BarChart2 className="mr-2" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Historique">
                  <History className="mr-2" />
                  <span>Historique</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="My Cart">
                  <ShoppingCart className="mr-2" />
                  <span>My Cart</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Saved">
                  <Bookmark className="mr-2" />
                  <span>Saved</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Setting">
                  <Settings className="mr-2" />
                  <span>Setting</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Light Mode">
                  <Sun className="mr-2" />
                  <span>Light Mode</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Language">
                  <div className="w-full px-2">
                    <LanguageSwitcher />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <div className="px-4 py-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bookly-primary flex items-center justify-center text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
                  <span className="text-xs text-sidebar-foreground/70">{user?.role || 'Reader'}</span>
                </div>
              </div>
            </SidebarMenu>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-8" />
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <div className="relative rounded-lg overflow-hidden h-64 mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10 flex flex-col justify-center p-8">
                  <Badge className="w-fit mb-4 bg-bookly-accent text-white">Special Offer</Badge>
                  <h2 className="text-3xl font-bold text-white mb-2">25% discount</h2>
                  <p className="text-3xl font-bold text-white">all books!</p>
                </div>
                <img 
                  src="\public\placeholder.svg" 
                  alt="img" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-bookly-primary"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
            </div>
            
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pick up where you left off</h2>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {booksInProgress.map((book) => (
                    <CarouselItem key={book.id} className="md:basis-1/3 lg:basis-1/4">
                      <Card className="border-none">
                        <CardContent className="p-1">
                          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-[3/4] bg-gray-100">
                              <img 
                                src={book.cover} 
                                alt={book.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <h3 className="font-medium truncate">{book.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-bookly-primary rounded-full" 
                                  style={{ width: `${book.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
            
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Selected just for you</h2>
                <Button variant="ghost" className="text-bookly-accent">View All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedBooks.map((book) => (
                  <Card key={book.id} className="border-none">
                    <CardContent className="p-1">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[3/4] bg-gray-100">
                          <img 
                            src={book.cover} 
                            alt={book.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium truncate">{book.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
