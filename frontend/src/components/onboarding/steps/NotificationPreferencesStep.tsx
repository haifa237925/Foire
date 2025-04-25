import React from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

interface NotificationPreferencesStepProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  onEmailNotificationsChange: (enabled: boolean) => void;
  onPushNotificationsChange: (enabled: boolean) => void;
}

export function NotificationPreferencesStep({
  emailNotifications,
  pushNotifications,
  onEmailNotificationsChange,
  onPushNotificationsChange,
}: NotificationPreferencesStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Configurez comment vous souhaitez être informé(e) des nouveautés et mises à jour
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Notifications par email</h4>
            <p className="text-sm text-muted-foreground">
              Recevez des recommandations personnalisées et des alertes
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={onEmailNotificationsChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Notifications push</h4>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications instantanées sur votre appareil
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={onPushNotificationsChange}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-muted/50 p-4 rounded-md"
      >
        <p className="text-sm text-muted-foreground">
          Vous pourrez ajuster vos préférences de notification à tout moment dans les paramètres de votre compte.
        </p>
      </motion.div>
    </motion.div>
  );
}
