
// import { GoogleGenAI, Type } from "@google/genai";
import { TrainingPlan } from '../types';

/*
  Cała funkcjonalność AI została tymczasowo wyłączona.
  Poniższy kod powodował błąd w przeglądarce, ponieważ próbuje uzyskać dostęp
  do 'process.env.API_KEY', które nie jest dostępne w środowisku front-endowym.
  Wymaga to architektury z backendem do bezpiecznego zarządzania kluczem API.
*/

export const generatePlanFromPrompt = async (prompt: string): Promise<Pick<TrainingPlan, 'name' | 'exercises'>> => {
    console.error("Funkcja AI jest niedostępna w tej konfiguracji.");
    throw new Error("Funkcja generowania planu przez AI jest tymczasowo niedostępna.");
};
