import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase keys are fully configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Saves audit result.
 * Table: audits
 * - id (uuid, primary key)
 * - data (jsonb)
 * - created_at (timestamp)
 */
export async function saveAudit(auditData) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert([{ data: auditData }])
        .select('id')
        .single();
      
      if (error) throw error;
      return { success: true, id: data.id, isLocal: false };
    } catch (err) {
      console.warn("Supabase saveAudit failed, falling back to local storage.", err);
    }
  }

  // Fallback storage: Local Storage + Hash generation
  const localId = `local_${Math.random().toString(36).substring(2, 11)}`;
  
  const localAudits = JSON.parse(localStorage.getItem('spendwise_audits') || '{}');
  localAudits[localId] = { data: auditData, created_at: new Date().toISOString() };
  localStorage.setItem('spendwise_audits', JSON.stringify(localAudits));

  // Generate a compressed sharing payload hash to put in URL
  const hash = btoa(encodeURIComponent(JSON.stringify(auditData)).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));

  return { success: true, id: localId, hash, isLocal: true };
}

/**
 * Saves lead info.
 * Table: leads
 * - id (uuid, primary key)
 * - email (text)
 * - company (text)
 * - role (text)
 * - audit_id (uuid)
 * - created_at (timestamp)
 */
export async function saveLead(email, company, role, auditId) {
  if (isSupabaseConfigured && auditId && !auditId.startsWith('local_')) {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ email, company, role, audit_id: auditId }]);
      
      if (error) throw error;
      return { success: true, isLocal: false };
    } catch (err) {
      console.warn("Supabase saveLead failed. Falling back to local storage.", err);
    }
  }

  // Fallback: local storage
  const localLeads = JSON.parse(localStorage.getItem('spendwise_leads') || '{}');
  localLeads[auditId] = { email, company, role, created_at: new Date().toISOString() };
  localStorage.setItem('spendwise_leads', JSON.stringify(localLeads));
  return { success: true, isLocal: true };
}

/**
 * Fetches audit by ID or hash.
 */
export async function getAuditById(id, hash = null) {
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
          input_tools: parsedData.inputTools || parsedData.input_tools,
          audit_results: parsedData.auditResults || parsedData.audit_results,
          team_size: parsedData.teamSize || parsedData.team_size,
          use_case: parsedData.useUseCase || parsedData.use_case,
          currency: parsedData.currency,
          company_name: parsedData.companyName || parsedData.company_name
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
      
      const auditPayload = data.data;

      // Try fetching company name from lead info
      let companyName = '';
      try {
        const { data: leadData } = await supabase
          .from('leads')
          .select('company')
          .eq('audit_id', id)
          .maybeSingle();
        if (leadData) companyName = leadData.company;
      } catch (leadErr) {
        console.warn("Could not fetch lead details for audit dashboard:", leadErr);
      }

      return { 
        success: true, 
        data: {
          input_tools: auditPayload.inputTools || auditPayload.input_tools,
          audit_results: auditPayload.auditResults || auditPayload.audit_results,
          team_size: auditPayload.teamSize || auditPayload.team_size,
          use_case: auditPayload.useCase || auditPayload.use_case,
          currency: auditPayload.currency,
          company_name: companyName || auditPayload.companyName || auditPayload.company_name
        },
        isLocal: false 
      };
    } catch (err) {
      console.warn("Supabase fetch failed. Checking local storage.", err);
    }
  }

  // Scenario C: Local Storage lookup
  if (id) {
    const localAudits = JSON.parse(localStorage.getItem('spendwise_audits') || '{}');
    const localRecord = localAudits[id];
    if (localRecord) {
      const auditPayload = localRecord.data;
      const localLeads = JSON.parse(localStorage.getItem('spendwise_leads') || '{}');
      const leadData = localLeads[id];

      return { 
        success: true, 
        data: {
          input_tools: auditPayload.inputTools || auditPayload.input_tools,
          audit_results: auditPayload.auditResults || auditPayload.audit_results,
          team_size: auditPayload.teamSize || auditPayload.team_size,
          use_case: auditPayload.useCase || auditPayload.use_case,
          currency: auditPayload.currency,
          company_name: leadData?.company || auditPayload.companyName || auditPayload.company_name
        },
        isLocal: true 
      };
    }
  }

  return { success: false, error: 'Audit record not found' };
}
