import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const body = await req.text();
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(body, { "svix-id": svix_id, "svix-timestamp": svix_timestamp, "svix-signature": svix_signature });
  } catch (err) {
    return new Response('Webhook verification failed', { status: 400 });
  }

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = event.data;
    
    await supabase.from('users').insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      role: 'customer',   // Default role
    });
  }

  return new Response('OK', { status: 200 });
}
