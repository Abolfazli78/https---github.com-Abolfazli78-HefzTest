import { isArabic } from "@/lib/isArabic";

interface RenderTextProps {
  text: string;
  className?: string;
}

export function RenderText({ text, className }: RenderTextProps) {
  if (isArabic(text)) {
    return <span className={`quran-text ${className || ''}`}>{text}</span>;
  }

  return <span className={className}>{text}</span>;
}
