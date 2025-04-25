
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface GenreSelectionStepProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

export function GenreSelectionStep({
  selectedGenres,
  onGenreToggle,
}: GenreSelectionStepProps) {
  const allGenres = [
    "Roman", "Science-Fiction", "Fantasy", 
    "Policier", "Thriller", "Romance", 
    "Historique", "Biographie", "Poésie",
    "Développement personnel", "Business", "Jeunesse",
    "Bande dessinée", "Nouvelles", "Essai", 
    "Philosophie", "Art", "Voyage"
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
        Sélectionnez vos genres littéraires préférés
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        {allGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <motion.div key={genre} variants={itemVariants}>
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onGenreToggle(genre)}
                className={`h-auto py-3 px-4 w-full justify-between ${
                  isSelected ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <span>{genre}</span>
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
        {selectedGenres.length === 0 ? (
          <span className="text-sm text-muted-foreground">Aucun genre sélectionné</span>
        ) : (
          selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))
        )}
      </motion.div>
    </div>
  );
}
