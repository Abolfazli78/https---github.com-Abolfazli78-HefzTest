export function normalizePhone(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("0")) return `+98${digits.slice(1)}`;
  if (digits.startsWith("9")) return `+98${digits}`;
  return digits;
}

export function formatPhoneForSMS(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  
  console.log("[PHONE DEBUG] Original input:", input);
  console.log("[PHONE DEBUG] Cleaned digits:", digits);
  
  // Convert to local Iranian format (09xxxxxxxx)
  if (digits.startsWith("98") && digits.length === 12) {
    const localFormat = `0${digits.slice(2)}`;
    console.log("[PHONE DEBUG] Converted from +98 to local format:", localFormat);
    return localFormat;
  }
  
  if (digits.startsWith("+98") && digits.length === 13) {
    const localFormat = `0${digits.slice(3)}`;
    console.log("[PHONE DEBUG] Converted from +98 to local format:", localFormat);
    return localFormat;
  }
  
  if (digits.startsWith("0") && digits.length === 11) {
    console.log("[PHONE DEBUG] Already in local format:", digits);
    return digits;
  }
  
  if (digits.startsWith("9") && digits.length === 10) {
    const localFormat = `0${digits}`;
    console.log("[PHONE DEBUG] Added 0 prefix:", localFormat);
    return localFormat;
  }
  
  console.log("[PHONE DEBUG] Using as-is:", digits);
  return digits;
}
