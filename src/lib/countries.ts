export interface Country {
  code: string;
  name: string;
  nameFa: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  // Middle Eastern & Islamic Countries
  { code: "IR", name: "Iran", nameFa: "ایران", dialCode: "+98", flag: "🇮🇷" },
  { code: "AF", name: "Afghanistan", nameFa: "افغانستان", dialCode: "+93", flag: "🇦🇫" },
  { code: "TR", name: "Turkey", nameFa: "ترکیه", dialCode: "+90", flag: "🇹🇷" },
  { code: "IQ", name: "Iraq", nameFa: "عراق", dialCode: "+964", flag: "🇮🇶" },
  { code: "SA", name: "Saudi Arabia", nameFa: "عربستان", dialCode: "+966", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", nameFa: "امارات", dialCode: "+971", flag: "🇦🇪" },
  { code: "LB", name: "Lebanon", nameFa: "لبنان", dialCode: "+961", flag: "🇱🇧" },
  { code: "JO", name: "Jordan", nameFa: "اردن", dialCode: "+962", flag: "🇯🇴" },
  { code: "SY", name: "Syria", nameFa: "سوریه", dialCode: "+963", flag: "🇸🇾" },
  { code: "YE", name: "Yemen", nameFa: "یمن", dialCode: "+967", flag: "🇾🇪" },
  { code: "KW", name: "Kuwait", nameFa: "کویت", dialCode: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", nameFa: "بحرین", dialCode: "+973", flag: "🇧🇭" },
  { code: "QA", name: "Qatar", nameFa: "قطر", dialCode: "+974", flag: "🇶🇦" },
  { code: "OM", name: "Oman", nameFa: "عمان", dialCode: "+968", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", nameFa: "پاکستان", dialCode: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", nameFa: "بنگلادش", dialCode: "+880", flag: "🇧🇩" },
  { code: "ID", name: "Indonesia", nameFa: "اندونزی", dialCode: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", nameFa: "مالزی", dialCode: "+60", flag: "�🇾" },
  { code: "EG", name: "Egypt", nameFa: "مصر", dialCode: "+20", flag: "�🇪🇬" },
  { code: "LY", name: "Libya", nameFa: "لیبی", dialCode: "+218", flag: "🇱🇾" },
  { code: "TN", name: "Tunisia", nameFa: "تونس", dialCode: "+216", flag: "🇹🇳" },
  { code: "MA", name: "Morocco", nameFa: "مراکش", dialCode: "+212", flag: "🇲🇦" },
  { code: "DZ", name: "Algeria", nameFa: "الجزایر", dialCode: "+213", flag: "🇩🇿" },
  { code: "SD", name: "Sudan", nameFa: "سودان", dialCode: "+249", flag: "🇸🇩" },
  
  // Other Major Countries
  { code: "US", name: "United States", nameFa: "آمریکا", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", nameFa: "بریتانیا", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", nameFa: "آلمان", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", nameFa: "فرانسه", dialCode: "+33", flag: "🇫🇷" },
  { code: "CA", name: "Canada", nameFa: "کانادا", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", nameFa: "استرالیا", dialCode: "+61", flag: "🇦🇺" },
  { code: "JP", name: "Japan", nameFa: "ژاپن", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", nameFa: "چین", dialCode: "+86", flag: "🇨🇳" },
  { code: "IN", name: "India", nameFa: "هند", dialCode: "+91", flag: "🇮🇳" },
  { code: "RU", name: "Russia", nameFa: "روسیه", dialCode: "+7", flag: "🇷🇺" },
  { code: "BR", name: "Brazil", nameFa: "برزیل", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", nameFa: "مکزیک", dialCode: "+52", flag: "🇲🇽" },
  { code: "IT", name: "Italy", nameFa: "ایتالیا", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", nameFa: "اسپانیا", dialCode: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", nameFa: "هلند", dialCode: "+31", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", nameFa: "سوئد", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", nameFa: "نروژ", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", nameFa: "دانمارک", dialCode: "+45", flag: "�🇰" },
  { code: "FI", name: "Finland", nameFa: "فنلاند", dialCode: "+358", flag: "🇫🇮" },
  { code: "CH", name: "Switzerland", nameFa: "سوئیس", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", nameFa: "اتریش", dialCode: "+43", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", nameFa: "بلژیک", dialCode: "+32", flag: "🇧🇪" },
  { code: "PL", name: "Poland", nameFa: "لهستان", dialCode: "+48", flag: "🇵🇱" },
  { code: "GR", name: "Greece", nameFa: "یونان", dialCode: "+30", flag: "��" },
  { code: "PT", name: "Portugal", nameFa: "پرتغال", dialCode: "+351", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", nameFa: "ایرلند", dialCode: "+353", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", nameFa: "نیوزیلند", dialCode: "+64", flag: "��" },
  { code: "SG", name: "Singapore", nameFa: "سنگاپور", dialCode: "+65", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", nameFa: "تایلند", dialCode: "+66", flag: "🇹🇭" },
  { code: "PH", name: "Philippines", nameFa: "فیلیپین", dialCode: "+63", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", nameFa: "ویتنام", dialCode: "+84", flag: "🇻🇳" },
  { code: "KR", name: "South Korea", nameFa: "کره جنوبی", dialCode: "+82", flag: "🇰🇷" },
  { code: "ZA", name: "South Africa", nameFa: "آفریقای جنوبی", dialCode: "+27", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", nameFa: "نیجریه", dialCode: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", nameFa: "کنیا", dialCode: "+254", flag: "🇰🇪" },
  { code: "AR", name: "Argentina", nameFa: "آرژانتین", dialCode: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", nameFa: "شیلی", dialCode: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", nameFa: "کلمبیا", dialCode: "+57", flag: "🇨🇴" },
  { code: "PE", name: "Peru", nameFa: "پرو", dialCode: "+51", flag: "🇵🇪" },
  { code: "VE", name: "Venezuela", nameFa: "ونزوئلا", dialCode: "+58", flag: "🇻🇪" },
  { code: "IL", name: "Israel", nameFa: "اسرائیل", dialCode: "+972", flag: "�🇱" },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

export function getDefaultCountry(): Country {
  return countries.find(country => country.code === "IR") || countries[0];
}
