
import { Molecule } from '../types';

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

/**
 * Detects the most likely type of identifier provided.
 */
const detectType = (id: string): 'cid' | 'smiles' | 'name' => {
  if (/^\d+$/.test(id)) return 'cid';
  // SMILES usually contain specific chars or are long strings of C, N, O, etc.
  if (/[=#\(\)\[\]]/.test(id) || id.length > 20) return 'smiles';
  return 'name';
};

export const fetchMoleculeByIdentifier = async (id: string): Promise<Molecule | null> => {
  const trimmedId = id.trim();
  if (!trimmedId) return null;

  try {
    const type = detectType(trimmedId);
    let cid: number | null = null;

    console.debug(`[PubChem] Resolving: "${trimmedId}" as ${type}`);

    // 1. Resolve to CID
    if (type === 'cid') {
      cid = parseInt(trimmedId, 10);
    } else {
      const cidRes = await fetch(`${PUBCHEM_BASE}/compound/${type}/${encodeURIComponent(trimmedId)}/cids/JSON`);
      if (cidRes.ok) {
        const cidData = await cidRes.json();
        cid = cidData.IdentifierList?.CID?.[0] || null;
      }
      
      // Fallback: If "name" resolution failed, try "smiles"
      if (!cid && type === 'name') {
        const altRes = await fetch(`${PUBCHEM_BASE}/compound/smiles/${encodeURIComponent(trimmedId)}/cids/JSON`);
        if (altRes.ok) {
          const altData = await altRes.json();
          cid = altData.IdentifierList?.CID?.[0] || null;
        }
      }
    }

    if (!cid || isNaN(cid)) {
      console.warn(`[PubChem] No CID found for: ${trimmedId}`);
      return null;
    }

    // 2. Fetch Properties (Using XLogP which is more reliable than LogP)
    // We try the full list first.
    const propertiesList = 'MolecularWeight,XLogP,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,MolecularFormula,CanonicalSMILES,InChI,TPSA';
    
    let propRes = await fetch(`${PUBCHEM_BASE}/compound/cid/${cid}/property/${propertiesList}/JSON`);
    
    // If the full property request fails (400/404), try a minimal one to at least get the molecule
    if (!propRes.ok) {
      console.warn(`[PubChem] Full property fetch failed for CID ${cid}, trying minimal set.`);
      propRes = await fetch(`${PUBCHEM_BASE}/compound/cid/${cid}/property/MolecularWeight,MolecularFormula,CanonicalSMILES/JSON`);
    }

    if (!propRes.ok) {
      console.error(`[PubChem] Failed to fetch properties for CID ${cid}`);
      return null;
    }

    const propData = await propRes.json();
    const p = propData.PropertyTable?.Properties?.[0];

    if (!p) return null;

    // 3. Fetch Synonyms (Non-blocking)
    let name = `CID ${cid}`;
    try {
      const nameRes = await fetch(`${PUBCHEM_BASE}/compound/cid/${cid}/synonyms/JSON`);
      if (nameRes.ok) {
        const nameData = await nameRes.json();
        name = nameData.InformationList?.Information?.[0]?.Synonym?.[0] || name;
      }
    } catch (e) {
      console.warn("[PubChem] Synonym fetch failed");
    }

    // Map properties safely, handling both LogP and XLogP field names
    const logPVal = p.XLogP ?? p.LogP;

    return {
      cid: p.CID,
      name: name,
      smiles: p.CanonicalSMILES || '',
      inchi: p.InChI,
      properties: {
        molecularWeight: p.MolecularWeight ? parseFloat(p.MolecularWeight) : undefined,
        logP: logPVal !== undefined ? parseFloat(logPVal) : undefined,
        hBondDonors: p.HBondDonorCount || 0,
        hBondAcceptors: p.HBondAcceptorCount || 0,
        rotatableBonds: p.RotatableBondCount || 0,
        formula: p.MolecularFormula,
        tpsa: p.TPSA ? parseFloat(p.TPSA) : undefined
      }
    };
  } catch (error) {
    console.error(`[PubChem] Critical Error resolving "${id}":`, error);
    return null;
  }
};

export const getMoleculeImage = (cid: number) => {
  return `${PUBCHEM_BASE}/compound/cid/${cid}/PNG`;
};
