import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase keys are fully configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Saves audit result and lead info.
 * Fallback: saves to localStorage and returns a Base64 URL parameter hash.
 */
export async function saveAuditToDb({ email, companyName, role, inputTools, auditResults, teamSize, useCase, currency }) {
  const payload = {
    email,
    company_name: companyName,
    role,
    input_tools: inputTools,
    audit_results: auditResults,
    team_size: teamSize,
    use_case: useCase,
    currency,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert([payload])
        .select('id')
        .single();
      
      if (error) throw error;
      return { success: true, id: data.id, isLocal: false };
    } catch (err) {
      console.warn("Supabase insert failed. Falling back to local storage.", err);
      // Fallback to local storage if network or table issue
    }
  }

  // Fallback storage: Local Storage + Hash generation
  const localId = `local_${Math.random().toString(36).substring(2, 11)}`;
  
  // Store full record in localStorage for local retrieval
  const localAudits = JSON.parse(localStorage.getItem('spendwise_audits') || '{}');
  localAudits[localId] = payload;
  localStorage.setItem('spendwise_audits', JSON.stringify(localAudits));

  // Generate a compressed sharing payload hash to put in URL
  const sharingData = {
    input_tools: inputTools,
    audit_results: auditResults,
    team_size: teamSize,
    use_case: useCase,
    currency,
    company_name: companyName
  };

  // Convert to Base64 (safely handling Unicode characters)
  const jsonStr = JSON.stringify(sharingData);
  const hash = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));

  return { success: true, id: localId, hash, isLocal: true };
}

/**
 * Fetches audit by ID or hash.
 */
export async function fetchAuditFromDb(id, hash = null) {
  // Scenario A: Hash is provided in query params (Fallback sharing)
  if (hash) {
    try {
      const decodedStr = decodeURIComponent(atob(hash).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const parsedData = JSON.parse(decodedStr);
      return { 
        success: true, 
        data: {
          input_tools: parsedData.input_tools,
          audit_results: parsedData.audit_results,
          team_size: parsedData.team_size,
          use_case: parsedData.use_case,
          currency: parsedData.currency,
          company_name: parsedData.company_name,
          created_at: new Date().toISOString()
        },
        isLocal: true
      };
    } catch (err) {
      console.error("Failed to decode share hash:", err);
    }
  }

  // Scenario B: Real Supabase fetch
  if (isSupabaseConfigured && id && !id.startsWith('local_')) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data, isLocal: false };
    } catch (err) {
      console.warn("Supabase fetch failed. Checking local storage.", err);
    }
  }

  // Scenario C: Local Storage lookup
  if (id) {
    const localAudits = JSON.parse(localStorage.getItem('spendwise_audits') || '{}');
    const localData = localAudits[id];
    if (localData) {
      return { success: true, data: localData, isLocal: true };
    }
  }

  return { success: false, error: 'Audit record not found' };
}
