export function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
