// src/hooks/useToasts.ts
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export const useToasts = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useToasts must be used within a NotificationProvider');
  }
  return context;
};