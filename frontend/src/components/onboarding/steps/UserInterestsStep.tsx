
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface UserInterestsStepProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export function UserInterestsStep({
  selectedInterests,
  onInterestsChange,
}: UserInterestsStepProps) {
  const allInterests = [
    "Science-Fiction", "Développement personnel", 
    "Voyage", "Technologie", "Art", 
    "Cuisine", "Histoire", "Philosophie", 
    "Entrepreneuriat", "Bien-être", "Écologie", 
    "Psychologie", "Innovation", "Culture"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-4"
      >
        Sélectionnez vos centres d'intérêt pour personnaliser votre expérience
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        {allInterests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <motion.div key={interest} variants={itemVariants}>
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onInterestsChange(
                  isSelected 
                    ? selectedInterests.filter(i => i !== interest)
                    : [...selectedInterests, interest]
                )}
                className={`h-auto py-3 px-4 w-full justify-between ${
                  isSelected ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <span>{interest}</span>
                {isSelected && <Check className="h-4 w-4 ml-1" />}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-4 flex flex-wrap gap-2"
      >
        <p className="text-sm mr-2">Sélectionnés:</p>
        {selectedInterests.length === 0 ? (
          <span className="text-sm text-muted-foreground">Aucun centre d'intérêt sélectionné</span>
        ) : (
          selectedInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))
        )}
      </motion.div>
    </div>
  );
}
