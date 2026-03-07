import { supabaseAdmin as supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const { data: ride, error } = await supabase
      .from("rides")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json({ ride });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const { data: ride, error } = await supabase
      .from("rides")
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
        ...(body.driver_id && { driver_id: body.driver_id }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update ride" }, { status: 500 });
    }

    return NextResponse.json({ ride });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
