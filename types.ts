
export type ReceptorType = 'alpha1' | 'alpha2' | 'beta1' | 'beta2' | 'beta3';

export interface ReceptorData {
  id: ReceptorType;
  name: string;
  protein: 'Gq' | 'Gi' | 'Gs';
  location: string[];
  effects: string[];
  anesthesiaRole: string;
  pathology: string;
}

export interface DrugData {
  id: string;
  name: string;
  class: 'Agoniste' | 'Antagoniste';
  receptors: ReceptorType[];
  selectivity: string;
  clinicalUse: string[];
  dose: string;
  precautions: string;
  // Affinity on a scale of 0-10 for: [a1, a2, b1, b2]
  affinityProfile: {
    alpha1: number;
    alpha2: number;
    beta1: number;
    beta2: number;
  };
  selectiveAffinity: string;
  mechanism: string;
  contraindications: string[];
  pharmacokinetics: {
    onset: string;
    peak: string;
    duration: string;
    halfLife: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Physio' | 'Pharma' | 'Clinique';
}

// --- NEW SCENARIO TYPES FOR MULTI-STEP CASES ---

export interface CaseStep {
  id: number;
  timeOffset: string; // e.g., "H+0", "H+5min"
  contextUpdate: string; // Evolution of the situation
  vitals: {
    bp: string;
    hr: string;
    sats: string;
  };
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
    outcome: string; // Physiological result of this specific choice
  }[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  initialContext: string;
  steps: CaseStep[]; // Array of 3 steps
}
