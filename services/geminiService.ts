
import { GoogleGenAI } from "@google/genai";
import { ClinicalCase } from "../types";

const apiKey = process.env.API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const askGeminiTutor = async (question: string, context: string = ''): Promise<string> => {
  if (!aiClient) {
    return "Clé API non configurée. Impossible de contacter le tuteur IA.";
  }

  const systemInstruction = `Tu es un expert professeur en anesthésie-réanimation. 
  Ton but est d'expliquer des concepts de pharmacologie adrénergique à un interne/résident.
  Sois précis, scientifique, mais pédagogique. 
  Utilise des listes à puces si nécessaire.
  Si la question porte sur une dose critique, rappelle de vérifier les protocoles locaux.
  Contexte actuel de l'étudiant: ${context}`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erreur lors de la communication avec l'IA. Veuillez réessayer.";
  }
};

export const generateClinicalCase = async (): Promise<ClinicalCase | null> => {
  if (!aiClient) {
    console.error("No API Key for Case Generation");
    return null;
  }

  const prompt = `Génère un cas clinique complet et unique pour un résident en anesthésie.
  Sujet aléatoire parmi: Choc Septique, Anaphylaxie, Pré-éclampsie, Phéochromocytome, Arrêt Cardiaque, Hypotension per-op.
  
  Le format doit être STRICTEMENT du JSON valide respectant cette structure TS :
  {
    "id": "gen_id",
    "title": "Titre du cas",
    "initialContext": "Description courte du patient et contexte",
    "steps": [
       {
         "id": 1,
         "timeOffset": "H+0",
         "contextUpdate": "Ce qui se passe maintenant (évolution)",
         "vitals": { "bp": "120/80 mmHg", "hr": "80 bpm", "sats": "99%" },
         "question": "Question clinique (choix drogue/action)",
         "options": [
            { "id": "a", "text": "Option A", "correct": boolean, "explanation": "Pourquoi c'est bon/mauvais", "outcome": "Conséquence physio immédiate" },
            { "id": "b", "text": "Option B", "correct": boolean, "explanation": "...", "outcome": "..." },
            { "id": "c", "text": "Option C", "correct": boolean, "explanation": "...", "outcome": "..." }
         ]
       },
       ... (Total 3 étapes évolutives logiques)
    ]
  }
  IMPORTANT : Ne mets PAS de markdown (pas de \`\`\`json). Renvoie juste le JSON brut.`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ClinicalCase;
  } catch (error) {
    console.error("Failed to generate case:", error);
    return null;
  }
};
