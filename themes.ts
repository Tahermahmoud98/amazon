
import { ThemeKey } from './types';

export const THEMES: Record<string, { name: string, header: string, rowEven: string, rowOdd: string, border: string }> = {
  [ThemeKey.DEFAULT_BLUE]: {
    name: "أزرق افتراضي",
    header: "bg-blue-600 text-white",
    rowEven: "bg-blue-50",
    rowOdd: "bg-white",
    border: "border-blue-200"
  },
  [ThemeKey.DARK]: {
    name: "الوضع المظلم",
    header: "bg-gray-800 text-white",
    rowEven: "bg-gray-700 text-white",
    rowOdd: "bg-gray-600 text-white",
    border: "border-gray-500"
  },
  [ThemeKey.PROFESSIONAL_GRAY]: {
    name: "رمادي احترافي",
    header: "bg-gray-600 text-white",
    rowEven: "bg-gray-100",
    rowOdd: "bg-white",
    border: "border-gray-300"
  },
  [ThemeKey.STRIPED_GREEN]: {
    name: "أخضر مخطط",
    header: "bg-green-600 text-white",
    rowEven: "bg-green-50",
    rowOdd: "bg-white",
    border: "border-green-200"
  },
  [ThemeKey.SUNSET]: {
    name: "غروب الشمس",
    header: "bg-gradient-to-r from-orange-400 to-pink-500 text-white",
    rowEven: "bg-orange-50",
    rowOdd: "bg-white",
    border: "border-orange-200"
  },
  [ThemeKey.OCEAN]: {
    name: "نسيم المحيط",
    header: "bg-teal-500 text-white",
    rowEven: "bg-teal-100",
    rowOdd: "bg-teal-50",
    border: "border-teal-200"
  },
  [ThemeKey.FOREST]: {
    name: "أخضر غابي",
    header: "bg-emerald-700 text-white",
    rowEven: "bg-emerald-50",
    rowOdd: "bg-white",
    border: "border-emerald-200"
  },
  [ThemeKey.CLASSIC_BOOK]: {
    name: "كتاب كلاسيكي",
    header: "bg-[#D2B48C] text-[#5a3821] border-b-2 border-[#8B4513]",
    rowEven: "bg-[#f5f5dc]",
    rowOdd: "bg-[#f5f5dc]",
    border: "border-[#8B4513]"
  },
  [ThemeKey.MIDNIGHT]: {
    name: "بنفسجي ليلي",
    header: "bg-purple-800 text-white",
    rowEven: "bg-purple-50",
    rowOdd: "bg-white",
    border: "border-purple-200"
  },
  [ThemeKey.SUNNY]: {
    name: "أصفر مشمس",
    header: "bg-yellow-400 text-gray-900",
    rowEven: "bg-yellow-50",
    rowOdd: "bg-white",
    border: "border-yellow-200"
  },
  [ThemeKey.BOLD_RED]: {
    name: "أحمر جريء",
    header: "bg-red-600 text-white",
    rowEven: "bg-red-50",
    rowOdd: "bg-white",
    border: "border-red-200"
  },
  [ThemeKey.CLEAN_WHITE]: {
    name: "أبيض نظيف",
    header: "bg-white text-gray-800 border-b-2 border-gray-400",
    rowEven: "bg-white",
    rowOdd: "bg-white",
    border: "border-gray-200"
  },
  [ThemeKey.TECH_GRID]: {
    name: "شبكة تقنية",
    header: "bg-slate-800 text-cyan-400 font-mono",
    rowEven: "bg-slate-50",
    rowOdd: "bg-white",
    border: "border-slate-300"
  },
  [ThemeKey.VINTAGE_PAPER]: {
    name: "ورق عتيق",
    header: "bg-[#e3d9c6] text-[#5a4e3a] border-b",
    rowEven: "bg-[#fdfaf3]",
    rowOdd: "bg-[#fdfaf3]",
    border: "border-[#c9b79c]"
  },
  [ThemeKey.SOFT_PINK]: {
    name: "وردي ناعم",
    header: "bg-pink-400 text-white",
    rowEven: "bg-pink-50",
    rowOdd: "bg-white",
    border: "border-pink-200"
  },
  [ThemeKey.ORANGE_VIBE]: {
    name: "برتقالي حيوي",
    header: "bg-orange-500 text-white",
    rowEven: "bg-orange-50",
    rowOdd: "bg-white",
    border: "border-orange-200"
  },
  [ThemeKey.HIGH_CONTRAST]: {
    name: "عالي التباين",
    header: "bg-black text-white",
    rowEven: "bg-white text-black",
    rowOdd: "bg-white text-black",
    border: "border-black border-2"
  },
  [ThemeKey.BORDERED_BLUE]: {
    name: "حدود زرقاء",
    header: "bg-white text-blue-700 border-2 border-blue-700",
    rowEven: "bg-white",
    rowOdd: "bg-white",
    border: "border-blue-700 border-2"
  },
  [ThemeKey.MINIMALIST]: {
    name: "خطوط بسيطة",
    header: "bg-transparent text-black border-b-2 border-black",
    rowEven: "bg-transparent border-b border-gray-200",
    rowOdd: "bg-transparent border-b border-gray-200",
    border: "border-none"
  },
  [ThemeKey.BORDERLESS]: {
    name: "بلا حدود",
    header: "bg-gray-800 text-white rounded-t-lg",
    rowEven: "bg-gray-100",
    rowOdd: "bg-white",
    border: "border-none"
  }
};
