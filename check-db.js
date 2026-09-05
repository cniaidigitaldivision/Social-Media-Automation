const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('connected_accounts').select('*').limit(1);
  console.log('connected_accounts:', error ? error.message : 'exists');
  const { data: vData, error: vError } = await supabase.from('token_vault').select('*').limit(1);
  console.log('token_vault:', vError ? vError.message : 'exists');
}
run();
