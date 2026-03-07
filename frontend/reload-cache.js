const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function reloadCache() {
  console.log("Attempting to reload Supabase schema cache...");
  // This notifies PostgREST to reload the schema cache
  const { data, error } = await supabase.rpc('notify_pgrst');
  
  if (error) {
    if (error.message.includes('Could not find the function')) {
      console.log("\n❌ Function notify_pgrst not found.\n");
      console.log("Please go to your Supabase Dashboard:");
      console.log("1. Click on SQL Editor on the left sidebar");
      console.log("2. Create a new query and paste exactly this:");
      console.log("\n   NOTIFY pgrst, 'reload schema';\n");
      console.log("3. Click 'Run'. This will instantly solve the 500 issue!");
    } else {
      console.error("Error:", error.message);
    }
  } else {
    console.log("✅ Schema cache reloaded successfully!");
  }
}

reloadCache();
