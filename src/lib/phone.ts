export function normalizePhone(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("0")) return `+98${digits.slice(1)}`;
  if (digits.startsWith("9")) return `+98${digits}`;
  return digits;
}
