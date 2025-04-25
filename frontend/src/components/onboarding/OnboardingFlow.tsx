import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingCard } from "./OnboardingCard";
import { WelcomeStep } from "./steps/WelcomeStep";
import { GenreSelectionStep } from "./steps/GenreSelectionStep";
import { NotificationPreferencesStep } from "./steps/NotificationPreferencesStep";
import { ReaderQuestionsStep } from "./steps/ReaderQuestionsStep";
import { UserInterestsStep } from "./steps/UserInterestsStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // Importer useAuth
import type { UserPreferences } from "@/types/onboarding";

const steps = [
  {
    id: "welcome",
    title: "Bienvenue sur TEPTAC SERVICES",
    description: "Découvrez une expérience personnalisée de lecture."
  },
  {
    id: "interests",
    title: "Vos centres d'intérêt",
    description: "Dites-nous ce qui vous passionne"
  },
  {
    id: "reader-questions",
    title: "Vos habitudes de lecture",
    description: "Aidez-nous à mieux vous connaître"
  },
  {
    id: "genres",
    title: "Vos genres préférés",
    description: "Sélectionnez les genres littéraires qui vous intéressent"
  },
  {
    id: "notifications",
    title: "Préférences de communication",
    description: "Configurez comment vous souhaitez être informé"
  },
  {
    id: "completion",
    title: "Configuration terminée",
    description: "Votre profil est prêt !"
  }
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    notificationPreferences: {
      email: true,
      push: false
    },
    readingInterests: [],
    preferredFormats: [],
    goals: []
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useAuth(); // Utiliser le contexte d'authentification

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 1 && preferences.readingInterests?.length === 0) {
      toast({
        title: "Veuillez sélectionner au moins un centre d'intérêt",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3 && preferences.favoriteGenres.length === 0) {
      toast({
        title: "Veuillez sélectionner au moins un genre",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === steps.length - 1) {
      // Lorsque l'onboarding est terminé, mettre à jour l'état dans le contexte
      completeOnboarding();
      
      toast({
        title: "Configuration terminée !",
        description: "Vos préférences ont été enregistrées avec succès.",
      });
      
      // Dans un vrai projet, vous enverriez ces préférences au backend
      console.log("Préférences utilisateur:", preferences);
      
      // Rediriger vers la page d'accueil ou le tableau de bord
      navigate("/dashboard");
      return;
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleInterestsChange = (interests: string[]) => {
    setPreferences((prev) => ({
      ...prev,
      readingInterests: interests
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setPreferences((prev) => {
      const genres = prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre];
      return { ...prev, favoriteGenres: genres };
    });
  };

  const handleNotificationToggle = (type: "email" | "push", value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: value
      }
    }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "welcome":
        return <WelcomeStep />;
      
      case "interests":
        return (
          <UserInterestsStep
            selectedInterests={preferences.readingInterests || []}
            onInterestsChange={handleInterestsChange}
          />
        );
      
      case "reader-questions":
        return (
          <ReaderQuestionsStep
            readingHabits={preferences.goals || []}
            onReadingHabitsChange={(habits) => setPreferences(prev => ({ ...prev, goals: habits }))}
            preferredFormats={preferences.preferredFormats || []}
            onPreferredFormatsChange={(formats) => setPreferences(prev => ({ ...prev, preferredFormats: formats }))}
          />
        );
      
      case "genres":
        return (
          <GenreSelectionStep
            selectedGenres={preferences.favoriteGenres}
            onGenreToggle={handleGenreToggle}
          />
        );
      
      case "notifications":
        return (
          <NotificationPreferencesStep
            emailNotifications={preferences.notificationPreferences.email}
            pushNotifications={preferences.notificationPreferences.push}
            onEmailNotificationsChange={(value) => handleNotificationToggle("email", value)}
            onPushNotificationsChange={(value) => handleNotificationToggle("push", value)}
          />
        );
      
      case "completion":
        return (
          <CompletionStep
            onStartJourney={() => handleNext()}
          />
        );
      
      default:
        return null;
    }
  };

  const currentStepInfo = steps[currentStep];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingCard
              title={currentStepInfo.title}
              description={currentStepInfo.description}
              progress={progress}
              onNext={handleNext}
              onBack={handleBack}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              nextButtonText={currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
            >
              {renderStepContent()}
            </OnboardingCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "bg-primary scale-125"
                : index < currentStep
                ? "bg-primary/50"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}