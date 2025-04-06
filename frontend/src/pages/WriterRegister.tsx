
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WriterRegister = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    website: '',
    genres: [] as string[],
    languages: [] as string[],
    profilePhoto: null as File | null,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const genres = [
    'Novel', 'Poetry', 'Science Fiction', 'Fantasy', 'Mystery', 
    'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Self-Help'
  ];
  
  const languages = ['English', 'French', 'Arabic', 'Spanish', 'German'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (genre: string) => {
    setFormData(prev => {
      const updatedGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: updatedGenres };
    });
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => {
      const updatedLanguages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      return { ...prev, languages: updatedLanguages };
    });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profilePhoto: file }));
  };

  const validateStep1 = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
    };

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    
    if (currentStep === totalSteps) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms and conditions' }));
      return;
    }
    
    setIsLoading(true);
    try {
      await register(formData, 'writer');
      toast({
        title: 'Success',
        description: 'Your account has been created and is pending approval.',
      });
      navigate('/writer-pending');
      // Note: Writers go to writer-pending page, not dashboard directly
      // After admin approval, they will be able to access the dashboard
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gradient-to-br from-white to-blue-50 animate-fade-in">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <div className="mb-6">
              <Link to="/register" className="inline-flex items-center text-bookly-primary hover:text-bookly-secondary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to account types
              </Link>
            </div>
            
            <h1 className="text-3xl font-serif font-bold mb-2">{t('createAccount')}</h1>
            <p className="text-gray-600 mb-8">{t('writerDescription')}</p>
            
            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-gray-200 rounded-full mb-8">
              <div 
                className="absolute h-1 bg-bookly-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            
            <div className="mb-6 flex justify-between text-sm text-gray-500">
              <span className={currentStep === 1 ? 'text-bookly-primary font-medium' : ''}>Basic Information</span>
              <span className={currentStep === 2 ? 'text-bookly-primary font-medium' : ''}>Profile Details</span>
              <span className={currentStep === 3 ? 'text-bookly-primary font-medium' : ''}>Preferences & Terms</span>
            </div>
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      {t('firstName')}
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      {t('lastName')}
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    {t('username')}
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}
            
            {/* Step 2: Profile Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    {t('bio')}
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-input resize-none"
                    placeholder="Tell us about yourself and your writing..."
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    {t('website')}
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('profilePhoto')}
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {formData.profilePhoto ? (
                        <img
                          src={URL.createObjectURL(formData.profilePhoto)}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                    <label htmlFor="profile-photo" className="ml-5">
                      <span className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer">
                        Change
                      </span>
                      <input
                        id="profile-photo"
                        name="profile-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Preferences & Terms */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('genres')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {genres.map(genre => (
                      <div key={genre} className="flex items-center">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={formData.genres.includes(genre)}
                          onCheckedChange={() => handleGenreChange(genre)}
                        />
                        <label htmlFor={`genre-${genre}`} className="ml-2 text-sm text-gray-600">
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('languages')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {languages.map(language => (
                      <div key={language} className="flex items-center">
                        <Checkbox
                          id={`language-${language}`}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={() => handleLanguageChange(language)}
                        />
                        <label htmlFor={`language-${language}`} className="ml-2 text-sm text-gray-600">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-600">
                        {t('termsAgree')}{' '}
                        <Link to="/terms" className="text-bookly-primary hover:text-bookly-secondary">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-bookly-primary hover:text-bookly-secondary">
                          Privacy Policy
                        </Link>
                      </label>
                      {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="border-bookly-primary text-bookly-primary hover:bg-bookly-primary hover:text-white"
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                type="button"
                onClick={goToNextStep}
                className="bg-bookly-primary hover:bg-bookly-secondary text-white"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : currentStep === totalSteps ? t('submit') : 'Continue'}
              </Button>
            </div>
            
            <p className="text-center mt-8 text-sm text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-bookly-primary hover:text-bookly-secondary font-medium">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WriterRegister;
