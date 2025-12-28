
export interface Molecule {
  cid?: number;
  name?: string;
  smiles: string;
  inchi?: string;
  properties: {
    molecularWeight?: number;
    logP?: number;
    hBondDonors?: number;
    hBondAcceptors?: number;
    rotatableBonds?: number;
    formula?: string;
    tpsa?: number; // Added TPSA
  };
  safety?: SafetyWarning[];
}

export interface SafetyWarning {
  category: 'Toxicity' | 'Flammability' | 'Explosiveness' | 'Environmental' | 'Regulatory' | 'EnvironmentMismatch';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  explanation: string;
}

export interface ReactionInput {
  reactants: Molecule[];
  catalysts: string;
  temperature: number; // Celsius
  pressure: number;    // atm
  description: string;
}

export interface PredictedChemical {
  smiles: string;
  name: string;
  iupacName: string;
  molecularWeight: number;
  yieldEstimate: string;
  reasoning: string;
  applications: string[];
  tpsa?: number; // Added TPSA
}

export interface MLAccuracyMetrics {
  confidenceScore: number; // 0-100
  massBalanceStatus: 'Verified' | 'Imbalance Detected' | 'Unknown';
  modelConsensus: {
    structural: boolean;
    thermodynamic: boolean;
    kinetic: boolean;
  };
  errorMargin: string;
}

export interface ReactionSimulationResult {
  products: PredictedChemical[];
  byproducts: PredictedChemical[];
  intermediates?: {
    smiles: string;
    name: string;
    description: string;
  }[];
  feasibilityScore: number;
  energyTrend: 'Exothermic' | 'Endothermic' | 'Neutral';
  mechanismInsight: string;
  approxTimeRequired: string;
  alternativeRoute: string;
  safetyAssessment: SafetyWarning[];
  conditionWarnings?: string[];
  mlAccuracy?: MLAccuracyMetrics; // Added accuracy metrics
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  input: ReactionInput;
  result: ReactionSimulationResult;
}

export interface GoalInterpretation {
  suggestedReactants: string[];
  suggestedTemp: number;
  suggestedPressure: number;
  rationale: string;
}
