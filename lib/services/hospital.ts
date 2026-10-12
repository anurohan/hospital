import "server-only";

import { cache } from "react";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { HOSPITAL_CONFIG } from "@/config/hospital";
import type { Hospital } from "@/types";

/**
 * Resolve the active hospital (tenant). For V1 this is the single configured
 * tenant whose slug matches HOSPITAL_CONFIG.id. In a multi-tenant deployment
 * this would resolve from the request subdomain. Falls back to a config-derived
 * record so the public site renders even before the DB is populated.
 */
export const getActiveHospital = cache(async (): Promise<Hospital | null> => {
  if (isSupabaseConfigured()) {
    const supabase = await getServerClient();
    const { data } = await supabase
      .from("hospitals")
      .select("*")
      .eq("slug", HOSPITAL_CONFIG.id)
      .eq("is_active", true)
      .maybeSingle();
    if (data) return data as Hospital;
  }
  return fallbackHospital();
});

/** The hospital id for the active tenant, or null when unresolved. */
export const getActiveHospitalId = cache(async (): Promise<string | null> => {
  const h = await getActiveHospital();
  return h?.id ?? null;
});

function fallbackHospital(): Hospital {
  const c = HOSPITAL_CONFIG;
  return {
    id: c.id,
    slug: c.id,
    name: c.name,
    short_name: c.shortName,
    tagline: c.tagline,
    address_line1: c.address.line1,
    address_city: c.address.city,
    address_state: c.address.state,
    address_pin: c.address.pincode,
    address_country: c.address.country,
    phone: c.contact.phone,
    emergency_phone: c.contact.emergencyPhone,
    email: c.contact.email,
    map_url: c.mapUrl,
    map_embed_url: c.mapEmbedUrl,
    timezone: "Asia/Kolkata",
    is_active: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}
