import { supabaseAdmin as supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!body.driver_id) {
      return NextResponse.json({ error: "Missing driver_id" }, { status: 400 });
    }

    // Attempt to accept the ride (only if it's still 'requested')
    const { data: ride, error } = await supabase
      .from("rides")
      .update({
        status: "accepted",
        driver_id: body.driver_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "requested")
      .select()
      .single();

    if (error || !ride) {
      return NextResponse.json(
        { error: "Ride already accepted or no longer available." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ride });
  } catch (err) {
    console.error("API error accepting ride:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
