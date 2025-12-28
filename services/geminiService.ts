
import { GoogleGenAI, Type } from "@google/genai";
import { ReactionInput, ReactionSimulationResult, GoalInterpretation } from "../types";

export const simulateReaction = async (input: ReactionInput): Promise<ReactionSimulationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as an Ensemble of Senior Computational Chemists and ML Research Scientists. 
    Analyze this chemical reaction using a multi-model approach:
    
    [INPUT PARAMETERS]
    Reactants: ${input.reactants.map(r => `${r.name} (${r.smiles}) - Formula: ${r.properties.formula}`).join(', ')}
    Catalysts: ${input.catalysts || 'None'}
    Conditions: ${input.temperature}°C, ${input.pressure} atm
    Goal: ${input.description}

    [ML VERIFICATION TASKS]
    1. Cross-reference Reactant SMILES for structural integrity.
    2. Perform a Stoichiometric Mass Balance: Ensure the total number of atoms in reactants matches products + byproducts.
    3. Simulate 3 separate predictive models: 
       - A Message Passing Neural Network (MPNN) for molecular properties.
       - A DFT-approximator for thermodynamic Delta G and energy trends.
       - A Kinetic Monte Carlo (KMC) simulator for time and yield.
    4. Flag any "Condition Mismatches" (e.g. Temp > Boiling point of solvent).

    [OUTPUT REQUIREMENTS]
    - Major Products & Byproducts (IUPAC, Exact MW, TPSA, specific applications).
    - Energy Trend, Mechanism, Alternative Routes.
    - ML Accuracy metrics: Confidence score and Model Consensus status.

    Respond strictly in JSON.
  `;

  const chemicalSchema = {
    type: Type.OBJECT,
    properties: {
      smiles: { type: Type.STRING },
      name: { type: Type.STRING },
      iupacName: { type: Type.STRING },
      molecularWeight: { type: Type.NUMBER },
      tpsa: { type: Type.NUMBER, description: "Topological Polar Surface Area in Å²" },
      yieldEstimate: { type: Type.STRING },
      reasoning: { type: Type.STRING },
      applications: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["smiles", "name", "iupacName", "molecularWeight", "yieldEstimate", "reasoning", "applications"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: { type: Type.ARRAY, items: chemicalSchema },
          byproducts: { type: Type.ARRAY, items: chemicalSchema },
          intermediates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                smiles: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          feasibilityScore: { type: Type.NUMBER },
          energyTrend: { type: Type.STRING, enum: ["Exothermic", "Endothermic", "Neutral"] },
          mechanismInsight: { type: Type.STRING },
          approxTimeRequired: { type: Type.STRING },
          alternativeRoute: { type: Type.STRING },
          safetyAssessment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                severity: { type: Type.STRING },
                description: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          conditionWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          mlAccuracy: {
            type: Type.OBJECT,
            properties: {
              confidenceScore: { type: Type.NUMBER },
              massBalanceStatus: { type: Type.STRING },
              modelConsensus: {
                type: Type.OBJECT,
                properties: {
                  structural: { type: Type.BOOLEAN },
                  thermodynamic: { type: Type.BOOLEAN },
                  kinetic: { type: Type.BOOLEAN }
                }
              },
              errorMargin: { type: Type.STRING }
            },
            required: ["confidenceScore", "massBalanceStatus", "modelConsensus", "errorMargin"]
          }
        },
        required: ["products", "byproducts", "feasibilityScore", "energyTrend", "mechanismInsight", "approxTimeRequired", "alternativeRoute", "safetyAssessment", "mlAccuracy"]
      },
      thinkingConfig: { thinkingBudget: 32768 } // Maxed budget for multi-model verification
    }
  });

  return JSON.parse(response.text);
};

export const interpretGoal = async (goal: string): Promise<GoalInterpretation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `As a reaction design specialist, convert this high-level chemistry goal into specific reaction parameters: "${goal}".
  Suggest standard starting materials, temperature (C), and pressure (atm). Ensure the reactants are optimized for yield.
  Return JSON with suggestedReactants, suggestedTemp, suggestedPressure, and rationale.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedReactants: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedTemp: { type: Type.NUMBER },
          suggestedPressure: { type: Type.NUMBER },
          rationale: { type: Type.STRING }
        },
        required: ["suggestedReactants", "suggestedTemp", "suggestedPressure", "rationale"]
      }
    }
  });

  return JSON.parse(response.text);
};
