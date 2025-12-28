
import { Molecule } from '../types';

export const COMMON_SOLVENTS: Molecule[] = [
  {
    cid: 180,
    name: "Acetone",
    smiles: "CC(=O)C",
    properties: { molecularWeight: 58.08, logP: -0.2, hBondDonors: 0, hBondAcceptors: 1, formula: "C3H6O" }
  },
  {
    cid: 174,
    name: "Ethylene Glycol",
    smiles: "C(CO)O",
    properties: { molecularWeight: 62.07, logP: -1.4, hBondDonors: 2, hBondAcceptors: 2, formula: "C2H6O2" }
  },
  {
    cid: 8028,
    name: "THF (Tetrahydrofuran)",
    smiles: "C1CCOC1",
    properties: { molecularWeight: 72.11, logP: 0.5, hBondDonors: 0, hBondAcceptors: 1, formula: "C4H8O" }
  },
  {
    cid: 702,
    name: "Ethanol",
    smiles: "CCO",
    properties: { molecularWeight: 46.07, logP: -0.3, hBondDonors: 1, hBondAcceptors: 1, formula: "C2H6O" }
  },
  {
    cid: 6344,
    name: "Dichloromethane",
    smiles: "C(Cl)Cl",
    properties: { molecularWeight: 84.93, logP: 1.3, hBondDonors: 0, hBondAcceptors: 0, formula: "CH2Cl2" }
  },
  {
    cid: 1140,
    name: "Toluene",
    smiles: "CC1=CC=CC=C1",
    properties: { molecularWeight: 92.14, logP: 2.7, hBondDonors: 0, hBondAcceptors: 0, formula: "C7H8" }
  },
  {
    cid: 679,
    name: "DMSO",
    smiles: "CS(=O)C",
    properties: { molecularWeight: 78.13, logP: -1.3, hBondDonors: 0, hBondAcceptors: 1, formula: "C2H6OS" }
  },
  {
    cid: 6228,
    name: "DMF",
    smiles: "CN(C)C=O",
    properties: { molecularWeight: 73.09, logP: -1.0, hBondDonors: 0, hBondAcceptors: 1, formula: "C3H7NO" }
  },
  {
    cid: 6341,
    name: "Acetonitrile",
    smiles: "CC#N",
    properties: { molecularWeight: 41.05, logP: -0.3, hBondDonors: 0, hBondAcceptors: 1, formula: "C2H3N" }
  },
  {
    cid: 176,
    name: "Acetic Acid",
    smiles: "CC(=O)O",
    properties: { molecularWeight: 60.05, logP: -0.17, hBondDonors: 1, hBondAcceptors: 2, formula: "C2H4O2" }
  }
];

export const ACIDS_AND_BASES: Molecule[] = [
  {
    cid: 1118,
    name: "Sulfuric Acid",
    smiles: "OS(=O)(=O)O",
    properties: { molecularWeight: 98.08, logP: -2.2, hBondDonors: 2, hBondAcceptors: 4, formula: "H2SO4" }
  },
  {
    cid: 313,
    name: "Hydrochloric Acid",
    smiles: "Cl",
    properties: { molecularWeight: 36.46, logP: 0.0, hBondDonors: 1, hBondAcceptors: 0, formula: "HCl" }
  },
  {
    cid: 14798,
    name: "Sodium Hydroxide",
    smiles: "[OH-].[Na+]",
    properties: { molecularWeight: 39.997, logP: -1.4, hBondDonors: 1, hBondAcceptors: 1, formula: "HNaO" }
  },
  {
    cid: 222,
    name: "Ammonia",
    smiles: "N",
    properties: { molecularWeight: 17.031, logP: -0.6, hBondDonors: 3, hBondAcceptors: 1, formula: "H3N" }
  },
  {
    cid: 8471,
    name: "Triethylamine",
    smiles: "CCN(CC)CC",
    properties: { molecularWeight: 101.19, logP: 1.4, hBondDonors: 0, hBondAcceptors: 1, formula: "C6H15N" }
  },
  {
    cid: 1049,
    name: "Pyridine",
    smiles: "C1=CC=NC=C1",
    properties: { molecularWeight: 79.1, logP: 0.6, hBondDonors: 0, hBondAcceptors: 1, formula: "C5H5N" }
  },
  {
    cid: 24357,
    name: "Potassium Carbonate",
    smiles: "[K+].[K+].[C-](=O)([O-])[O-]",
    properties: { molecularWeight: 138.2, logP: -1.0, hBondDonors: 0, hBondAcceptors: 3, formula: "CK2O3" }
  },
  {
    cid: 23662,
    name: "Sodium Bicarbonate",
    smiles: "C(=O)(O)[O-].[Na+]",
    properties: { molecularWeight: 84.007, logP: -0.3, hBondDonors: 1, hBondAcceptors: 3, formula: "CHNaO3" }
  }
];

export const ORGANIC_BUILDING_BLOCKS: Molecule[] = [
  {
    cid: 241,
    name: "Benzene",
    smiles: "C1=CC=CC=C1",
    properties: { molecularWeight: 78.11, logP: 2.1, hBondDonors: 0, hBondAcceptors: 0, formula: "C6H6" }
  },
  {
    cid: 1049,
    name: "Aniline",
    smiles: "C1=CC=C(C=C1)N",
    properties: { molecularWeight: 93.13, logP: 0.9, hBondDonors: 2, hBondAcceptors: 1, formula: "C6H7N" }
  },
  {
    cid: 996,
    name: "Phenol",
    smiles: "C1=CC=C(C=C1)O",
    properties: { molecularWeight: 94.11, logP: 1.5, hBondDonors: 1, hBondAcceptors: 1, formula: "C6H6O" }
  },
  {
    cid: 240,
    name: "Benzaldehyde",
    smiles: "C1=CC=CC=C1C=O",
    properties: { molecularWeight: 106.12, logP: 1.5, hBondDonors: 0, hBondAcceptors: 1, formula: "C7H6O" }
  },
  {
    cid: 338,
    name: "Salicylic Acid",
    smiles: "C1=CC=C(C(=C1)C(=O)O)O",
    properties: { molecularWeight: 138.12, logP: 2.3, hBondDonors: 2, hBondAcceptors: 3, formula: "C7H6O3" }
  },
  {
    cid: 785,
    name: "Nitrobenzene",
    smiles: "C1=CC=C(C=C1)[N+](=O)[O-]",
    properties: { molecularWeight: 123.11, logP: 1.8, hBondDonors: 0, hBondAcceptors: 2, formula: "C6H5NO2" }
  },
  {
    cid: 7496,
    name: "Guaiacol",
    smiles: "COC1=CC=CC=C1O",
    properties: { molecularWeight: 124.14, logP: 1.3, hBondDonors: 1, hBondAcceptors: 2, formula: "C7H8O2" }
  },
  {
    cid: 4624,
    name: "Succinic Anhydride",
    smiles: "C1CC(=O)OC1=O",
    properties: { molecularWeight: 100.07, logP: -0.4, hBondDonors: 0, hBondAcceptors: 3, formula: "C4H4O3" }
  }
];

export const CATALYSTS_AND_ADDITIVES: Molecule[] = [
  {
    cid: 1119,
    name: "Palladium on Carbon",
    smiles: "[Pd]",
    properties: { molecularWeight: 106.42, logP: 0, hBondDonors: 0, hBondAcceptors: 0, formula: "Pd" }
  },
  {
    cid: 14724,
    name: "Sodium Borohydride",
    smiles: "[BH4-].[Na+]",
    properties: { molecularWeight: 37.83, logP: -1.0, hBondDonors: 0, hBondAcceptors: 0, formula: "H4BNa" }
  },
  {
    cid: 23675,
    name: "Lithium Aluminum Hydride",
    smiles: "[Li+].[AlH4-]",
    properties: { molecularWeight: 37.95, logP: -1.0, hBondDonors: 0, hBondAcceptors: 0, formula: "H4AlLi" }
  },
  {
    cid: 8023,
    name: "Triphenylphosphine",
    smiles: "C1=CC=C(C=C1)P(C2=CC=CC=C2)C3=CC=CC=C3",
    properties: { molecularWeight: 262.29, logP: 5.7, hBondDonors: 0, hBondAcceptors: 0, formula: "C18H15P" }
  }
];
