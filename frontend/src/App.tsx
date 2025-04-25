
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReaderRegister from "./pages/ReaderRegister";
import WriterRegister from "./pages/WriterRegister";
import ForgotPassword from "./pages/ForgotPassword";
import WriterPending from "./pages/WriterPending";
import NotFound from "./pages/NotFound";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import AudiobookCategories from "./pages/AudiobookCategories";
import AuthorPage from "./pages/AuthorPage";
import BookDetail from "./pages/BookDetail";
import CategoryPage from "./pages/CategoryPage";
import EbookCategories from "./pages/EbookCategories";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import BadgesManagement from "./pages/admin/BadgesManagement";
import BooksManagement from "./pages/admin/BooksManagement";
import ReportsManagement from "./pages/admin/ReportsManagement";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import Dashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
               {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/author/:authorId" element={<AuthorPage />} />
            <Route path="/categories/ebooks" element={<EbookCategories />} />
            <Route path="/categories/audiobooks" element={<AudiobookCategories />} />
            <Route path="/category/:type/:categoryName" element={<CategoryPage />} />


              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/reader" element={<ReaderRegister />} />
              <Route path="/register/writer" element={<WriterRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/writer-pending" element={<WriterPending />} />
              
               {/* Routes admin */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="books" element={<BooksManagement />} />
              <Route path="transactions" element={<TransactionsManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="badges" element={<BadgesManagement />} />
            </Route>
        
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;