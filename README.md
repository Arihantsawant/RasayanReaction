# RasaayanReaction 🧪

**RasaayanReaction** is a high-fidelity, web-based scientific software platform designed for chemical research, pharmaceutical development, and industrial molecular simulation. 

By combining the **PubChem API** for real-time chemical data with **Google Gemini 3 Pro** for predictive *in silico* modeling, it allows researchers to simulate reactions, analyze thermodynamic trends, and verify structural integrity with high precision.

## 🚀 Key Features

- **Molecular Search & Resolution**: Instantly resolve chemicals by Name, SMILES, or PubChem CID.
- **In Silico Reaction Simulator**: Predict major products, byproducts, and intermediates using advanced LLM reasoning.
- **3D Atomic Projection**: Visualize molecular structures in a high-contrast 3D environment using 3DMol.js.
- **Reaction Topology Maps**: Interactive visual pathways of reaction kinetics and thermodynamic drifts.
- **Safety Intelligence**: Automated hazard assessment (Toxicity, Flammability, Regulatory) for every simulated run.
- **Inventory Management**: Save synthesized compounds to a local master inventory for future multi-step reactions.
- **Protocol Assistant**: Describe high-level research goals to receive AI-suggested reagents and conditions.

## 🛠 Tech Stack

- **Frontend**: React 19 (TypeScript), Tailwind CSS.
- **Graphing**: React Flow.
- **Chemistry Rendering**: 3DMol.js.
- **Data Engine**: PubChem PUG REST API.
- **AI Core**: Google Gemini API (@google/genai).

## 📖 Setup & Installation

### 1. Prerequisites
You will need a Google Gemini API Key. You can obtain one from the [Google AI Studio](https://aistudio.google.com/).

### 2. Environment Configuration
The application expects an environment variable named `API_KEY`. 
```bash
export API_KEY='your_gemini_api_key_here'
```

### 3. Local Development
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🔬 Usage Instructions

1.  **Add Reactants**: Use the "Compound Input" panel or "Reagent Console" to add molecules.
2.  **Define Objective**: State your research goal in the "Goal Specification" field.
3.  **Execute**: Click **"Initiate In Silico Run"** to generate the predictive report.
4.  **Save Results**: Products can be saved to your local "Synthesized" inventory for use in further simulations.

## ⚖️ License

This project is licensed under the **Apache License 2.0**. This license provides a grant of patent rights from contributors to users and includes robust liability protections essential for scientific software. See [LICENSE](LICENSE) for the full text.

---
*Disclaimer: RasaayanReaction is a predictive tool for research support and should not replace experimental laboratory verification. Always follow local safety protocols when handling real chemicals.*