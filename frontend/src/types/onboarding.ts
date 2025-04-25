
export type UserPreferences = {
    favoriteGenres: string[];
    notificationPreferences: {
      email: boolean;
      push: boolean;
    };
    readingInterests?: string[];
    preferredFormats?: ("ebook" | "audio" | "print")[];
    goals?: string[];
    bio?: string;
  };
  
  export type OnboardingProgress = {
    completedSteps: string[];
    currentStep: string;
    percentComplete: number;
  };
  