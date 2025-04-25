
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingCardProps {
  title: string;
  description: string;
  progress: number;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextButtonText?: string;
  children: React.ReactNode;
}

export function OnboardingCard({
  title,
  description,
  progress,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  nextButtonText = "Suivant",
  children,
}: OnboardingCardProps) {
  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <Progress value={progress} className="h-2" />
        <h2 className="text-2xl font-semibold mt-4">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isFirstStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button onClick={onNext}>
          {isLastStep ? "Terminer" : nextButtonText}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
