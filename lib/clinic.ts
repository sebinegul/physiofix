/** Canonical clinic NAP — keep UI, schema, and maps in sync. */
export const CLINIC_ADDRESS =
  "30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bengaluru – 560076";

export const CLINIC_MAPS_QUERY =
  "30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bengaluru 560076";

export const CLINIC_MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_MAPS_QUERY)}&z=16&output=embed`;

export const CLINIC_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_MAPS_QUERY)}`;

export const CLINIC_PHONE = "+91-8151912525";
export const CLINIC_EMAIL = "physiofix2525@gmail.com";
