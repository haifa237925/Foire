
import React from "react";
import { motion } from "framer-motion";

export function WelcomeStep() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="mb-8">
        <motion.div
          className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          <svg
            className="w-12 h-12 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </motion.div>
      </div>
      
      <h3 className="text-2xl font-bold">Bienvenue sur TEPTAC SERVICES</h3>
      
      <p className="text-muted-foreground max-w-md mx-auto">
        Nous sommes ravis de vous accueillir dans notre communauté dédiée 
        à la littérature. Personnalisons votre expérience en quelques étapes simples.
      </p>
      
      <motion.div 
        className="pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-muted-foreground">
          Cliquez sur "Suivant" pour commencer la personnalisation de votre expérience
        </p>
      </motion.div>
    </motion.div>
  );
}
