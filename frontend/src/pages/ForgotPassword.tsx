
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({ email: '' });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast({
        title: 'Email sent',
        description: 'Check your email for a password reset link.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-br from-white to-blue-50 animate-fade-in">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <div className="mb-6">
              <Link to="/login" className="inline-flex items-center text-bookly-primary hover:text-bookly-secondary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
            
            <h1 className="text-3xl font-serif font-bold mb-2">Forgot Password</h1>
            <p className="text-gray-600 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-bookly-primary hover:bg-bookly-secondary text-white py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  If you don't see it, check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-bookly-primary hover:text-bookly-secondary"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link to="/login" className="text-bookly-primary hover:text-bookly-secondary text-sm">
                Remember your password? Return to login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
