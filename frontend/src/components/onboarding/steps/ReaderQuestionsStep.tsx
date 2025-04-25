
import React, { useState } from "react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface ReaderQuestionsStepProps {
  readingHabits: string[];
  onReadingHabitsChange: (habits: string[]) => void;
  preferredFormats: ("ebook" | "audio" | "print")[];
  onPreferredFormatsChange: (formats: ("ebook" | "audio" | "print")[]) => void;
}

export function ReaderQuestionsStep({
  readingHabits,
  onReadingHabitsChange,
  preferredFormats,
  onPreferredFormatsChange,
}: ReaderQuestionsStepProps) {
  
  const handleHabitChange = (habit: string) => {
    if (readingHabits.includes(habit)) {
      onReadingHabitsChange(readingHabits.filter(h => h !== habit));
    } else {
      onReadingHabitsChange([...readingHabits, habit]);
    }
  };

  const handleFormatChange = (format: "ebook" | "audio" | "print") => {
    if (preferredFormats.includes(format)) {
      onPreferredFormatsChange(preferredFormats.filter(f => f !== format));
    } else {
      onPreferredFormatsChange([...preferredFormats, format]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h4 className="font-medium text-lg">À quelle fréquence lisez-vous ?</h4>
        <RadioGroup defaultValue={readingHabits[0] || "weekly"} onValueChange={(value) => onReadingHabitsChange([value])}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="reading-daily" />
            <Label htmlFor="reading-daily">Tous les jours</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="reading-weekly" />
            <Label htmlFor="reading-weekly">Quelques fois par semaine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="reading-monthly" />
            <Label htmlFor="reading-monthly">Quelques fois par mois</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasionally" id="reading-occasionally" />
            <Label htmlFor="reading-occasionally">Occasionnellement</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-lg">Quels formats préférez-vous ?</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-ebook" 
              checked={preferredFormats.includes("ebook")}
              onCheckedChange={() => handleFormatChange("ebook")} 
            />
            <Label htmlFor="format-ebook">Livre numérique (e-book)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-audio" 
              checked={preferredFormats.includes("audio")}
              onCheckedChange={() => handleFormatChange("audio")} 
            />
            <Label htmlFor="format-audio">Livre audio</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-print" 
              checked={preferredFormats.includes("print")}
              onCheckedChange={() => handleFormatChange("print")} 
            />
            <Label htmlFor="format-print">Livre imprimé</Label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
