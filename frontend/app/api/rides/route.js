import { supabaseAdmin as supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { clerkId, pickup, dropoff, vehicleType, distanceKm, fare } = body;

    if (!clerkId || !pickup || !dropoff) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user ID from clerk_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (userError || !userData) {
      // Auto-create user if not found
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_id: clerkId,
          email: "user@cabbooking.com",
          name: "User",
          role: "customer",
        })
        .select("id")
        .single();

      if (createError) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      var userId = newUser.id;
    } else {
      var userId = userData.id;
    }

    // Create ride
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        customer_id: userId,
        pickup_location: pickup,
        dropoff_location: dropoff,
        vehicle_type: vehicleType || "Sedan",
        distance_km: distanceKm || 0,
        fare: fare || 0,
        status: "requested",
      })
      .select()
      .single();

    if (rideError) {
      console.error("Ride creation error:", rideError);
      return NextResponse.json({ error: "Failed to create ride" }, { status: 500 });
    }

    return NextResponse.json({ ride });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "clerkId is required" }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (!userData) {
      return NextResponse.json({ rides: [] });
    }

    const { data: rides } = await supabase
      .from("rides")
      .select("*")
      .eq("customer_id", userData.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ rides: rides || [] });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
