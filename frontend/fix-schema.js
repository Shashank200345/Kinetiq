const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixSchema() {
  console.log("Checking schema...");

  const testInsert = await supabase.from('rides').insert({
    customer_id: '123e4567-e89b-12d3-a456-426614174000',
    pickup_location: {address: 'A'},
    dropoff_location: {address: 'B'},
    vehicle_type: 'Sedan',
    distance_km: 10,
    fare: 100,
    status: 'requested'
  });

  if (testInsert.error) {
    console.error("Test insert failed:", testInsert.error.message);
    if (testInsert.error.code === 'PGRST204') {
        console.log("We still have the schema cache issue. I will print the exact SQL needed.");
    }
  } else {
    console.log("Schema looks good! Inserted test row.");
    // clean it up
    await supabase.from('rides').delete().eq('status', 'requested').eq('distance_km', 10).eq('fare', 100);
  }
}

fixSchema();
