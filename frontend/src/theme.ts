export type ThemeId =
  | 'rustic-moss'
  | 'vintage-linen'
  | 'deep-bark'
  | 'olive-stone'
  | 'cyber-violet'
  | 'emerald-matrix'
  | 'sunset-amber'
  | 'electric-cyan';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  icon: string;
  isLight: boolean;

  // Backgrounds
  bgPage: string;
  bgNavbar: string;
  bgCard: string;
  bgCardSub: string;
  borderCard: string;
  borderSub: string;

  // Accents & Brand (Extracted from swatch image)
  primaryHex: string;
  primaryHoverHex: string;
  primaryGlow: string;
  primaryTextHex: string;
  secondaryHex: string;
  accentHex: string;

  // Text
  textTitle: string;
  textBody: string;
  textMuted: string;
  textAccent: string;

  // SVG Chart Colors
  chartBg: string;
  chartGrid: string;
  chartLineInactive: string;
  chartText: string;

  // Tailwinds classes
  primaryBgBtn: string;
  primaryTextBtn: string;
  activePill: string;
  inactivePill: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  // 1. Primary Default: Rustic Moss & Forest Stone (From User's Image Swatches)
  'rustic-moss': {
    id: 'rustic-moss',
    name: 'Rustic Moss & Stone',
    icon: '🌿',
    isLight: false,
    bgPage: 'bg-[#181d19]',          // Deep dark weathered pine-slate
    bgNavbar: 'bg-[#1e2520]/90',
    bgCard: 'bg-[#222a24]/90',        // Deep forest spruce slate (#465248 base)
    bgCardSub: 'bg-[#19201a]/85',
    borderCard: 'border-[#7a7c64]/35', // Sage green border (#7a7c64)
    borderSub: 'border-[#7a7c64]/20',
    primaryHex: '#cec88a',            // Swatch 2: Moss Gold / Olive Ochre
    primaryHoverHex: '#ded79d',
    primaryGlow: 'rgba(206, 200, 138, 0.45)',
    primaryTextHex: '#221e17',        // Swatch 5 dark umber for contrast
    secondaryHex: '#7a7c64',          // Swatch 3: Sage Green / Dried Herb
    accentHex: '#bcb096',             // Swatch 6: Taupe Stone
    textTitle: 'text-[#ece6da]',      // Swatch 1: Warm Linen Cream
    textBody: 'text-[#ded7c8]',
    textMuted: 'text-[#bcb096]',      // Swatch 6: Taupe Driftwood
    textAccent: 'text-[#cec88a]',
    chartBg: '#121714',
    chartGrid: '#29352b',
    chartLineInactive: '#465248',
    chartText: '#bcb096',
    primaryBgBtn: 'bg-[#cec88a] hover:bg-[#ded79d]',
    primaryTextBtn: 'text-[#221e17] font-bold',
    activePill: 'bg-[#cec88a] text-[#221e17] shadow-lg shadow-[#cec88a]/25 font-bold',
    inactivePill: 'bg-[#2b352f] text-[#ded7c8] hover:bg-[#36423b] hover:text-[#ece6da]',
  },

  // 2. Light Theme: Vintage Linen & Sage (From User's Image Swatches)
  'vintage-linen': {
    id: 'vintage-linen',
    name: 'Vintage Linen & Sage',
    icon: '🏛️',
    isLight: true,
    bgPage: 'bg-[#ece6da]',           // Swatch 1: Antique Linen / Cream
    bgNavbar: 'bg-[#f4efe5]/90',
    bgCard: 'bg-[#faf7f0]/95',
    bgCardSub: 'bg-[#f0e9dc]',
    borderCard: 'border-[#d1c8b4] shadow-sm',
    borderSub: 'border-[#ded5c2]',
    primaryHex: '#465248',            // Swatch 4: Deep Forest Spruce
    primaryHoverHex: '#364138',
    primaryGlow: 'rgba(70, 82, 72, 0.35)',
    primaryTextHex: '#ece6da',
    secondaryHex: '#7a7c64',          // Swatch 3: Sage Green
    accentHex: '#cec88a',             // Swatch 2: Moss Gold
    textTitle: 'text-[#40392f]',      // Swatch 5: Charcoal Bark Umber
    textBody: 'text-[#3e443b]',
    textMuted: 'text-[#7a7c64]',
    textAccent: 'text-[#465248]',
    chartBg: '#f5efe4',
    chartGrid: '#d9cfbe',
    chartLineInactive: '#bcb096',
    chartText: '#596053',
    primaryBgBtn: 'bg-[#465248] hover:bg-[#364138]',
    primaryTextBtn: 'text-[#ece6da] font-bold',
    activePill: 'bg-[#465248] text-[#ece6da] shadow-md font-bold',
    inactivePill: 'bg-[#e5ddd0] text-[#40392f] hover:bg-[#dbd1c1]',
  },

  // 3. Deep Bark Umber (From Swatch 5 & 6)
  'deep-bark': {
    id: 'deep-bark',
    name: 'Deep Bark & Taupe',
    icon: '🪵',
    isLight: false,
    bgPage: 'bg-[#1b1713]',           // Deep warm charcoal bark
    bgNavbar: 'bg-[#241e19]/90',
    bgCard: 'bg-[#2b241e]/90',
    bgCardSub: 'bg-[#1f1a15]/85',
    borderCard: 'border-[#bcb096]/25',
    borderSub: 'border-[#bcb096]/15',
    primaryHex: '#bcb096',            // Swatch 6: Taupe Driftwood
    primaryHoverHex: '#d1c5aa',
    primaryGlow: 'rgba(188, 176, 150, 0.4)',
    primaryTextHex: '#221e17',
    secondaryHex: '#cec88a',          // Swatch 2: Moss Gold
    accentHex: '#7a7c64',
    textTitle: 'text-[#ece6da]',      // Swatch 1: Linen Cream
    textBody: 'text-[#e5decb]',
    textMuted: 'text-[#a39780]',
    textAccent: 'text-[#bcb096]',
    chartBg: '#15110d',
    chartGrid: '#382e26',
    chartLineInactive: '#635345',
    chartText: '#bcb096',
    primaryBgBtn: 'bg-[#bcb096] hover:bg-[#d1c5aa]',
    primaryTextBtn: 'text-[#221e17] font-bold',
    activePill: 'bg-[#bcb096] text-[#221e17] shadow-lg shadow-[#bcb096]/20 font-bold',
    inactivePill: 'bg-[#382f27] text-[#ded7c8] hover:bg-[#453b31] hover:text-white',
  },

  // 4. Olive Stone (Weathered Wall & Green Door)
  'olive-stone': {
    id: 'olive-stone',
    name: 'Weathered Olive Arch',
    icon: '🚪',
    isLight: false,
    bgPage: 'bg-[#171b17]',
    bgNavbar: 'bg-[#1f2520]/90',
    bgCard: 'bg-[#252d26]/90',
    bgCardSub: 'bg-[#1c221d]',
    borderCard: 'border-[#465248]/50',
    borderSub: 'border-[#465248]/30',
    primaryHex: '#7a7c64',            // Sage Green
    primaryHoverHex: '#8b8e72',
    primaryGlow: 'rgba(122, 124, 100, 0.4)',
    primaryTextHex: '#ece6da',
    secondaryHex: '#cec88a',
    accentHex: '#bcb096',
    textTitle: 'text-[#ece6da]',
    textBody: 'text-[#d6d0c2]',
    textMuted: 'text-[#9fa08b]',
    textAccent: 'text-[#cec88a]',
    chartBg: '#101411',
    chartGrid: '#273329',
    chartLineInactive: '#4a574d',
    chartText: '#9fa08b',
    primaryBgBtn: 'bg-[#7a7c64] hover:bg-[#8b8e72]',
    primaryTextBtn: 'text-[#ece6da] font-bold',
    activePill: 'bg-[#7a7c64] text-[#ece6da] shadow-lg shadow-[#7a7c64]/30 font-bold',
    inactivePill: 'bg-[#263028] text-[#d6d0c2] hover:bg-[#313e34] hover:text-white',
  },

  // 5. Cyber Violet
  'cyber-violet': {
    id: 'cyber-violet',
    name: 'Cyber Violet',
    icon: '🟣',
    isLight: false,
    bgPage: 'bg-[#0a0518]',
    bgNavbar: 'bg-[#0f0724]/80',
    bgCard: 'bg-[#140b30]/90',
    bgCardSub: 'bg-[#0d0720]/80',
    borderCard: 'border-purple-500/25',
    borderSub: 'border-purple-500/15',
    primaryHex: '#a855f7',
    primaryHoverHex: '#c084fc',
    primaryGlow: 'rgba(168, 85, 247, 0.4)',
    primaryTextHex: '#ffffff',
    secondaryHex: '#f43f5e',
    accentHex: '#38bdf8',
    textTitle: 'text-white',
    textBody: 'text-purple-100',
    textMuted: 'text-purple-300/60',
    textAccent: 'text-purple-400',
    chartBg: '#080314',
    chartGrid: '#25164d',
    chartLineInactive: '#4c2889',
    chartText: '#c084fc',
    primaryBgBtn: 'bg-purple-600 hover:bg-purple-500',
    primaryTextBtn: 'text-white font-bold',
    activePill: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold',
    inactivePill: 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 hover:text-white',
  },

  // 6. Emerald Matrix
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    icon: '🟢',
    isLight: false,
    bgPage: 'bg-[#040f0a]',
    bgNavbar: 'bg-[#071911]/80',
    bgCard: 'bg-[#0a2318]/90',
    bgCardSub: 'bg-[#06170f]/80',
    borderCard: 'border-emerald-500/25',
    borderSub: 'border-emerald-500/15',
    primaryHex: '#10b981',
    primaryHoverHex: '#34d399',
    primaryGlow: 'rgba(16, 185, 129, 0.4)',
    primaryTextHex: '#021209',
    secondaryHex: '#06b6d4',
    accentHex: '#a7f3d0',
    textTitle: 'text-white',
    textBody: 'text-emerald-100',
    textMuted: 'text-emerald-300/60',
    textAccent: 'text-emerald-400',
    chartBg: '#030c07',
    chartGrid: '#0d3323',
    chartLineInactive: '#155e3f',
    chartText: '#34d399',
    primaryBgBtn: 'bg-emerald-500 hover:bg-emerald-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-bold',
    inactivePill: 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 hover:text-white',
  },

  // 7. Sunset Amber
  'sunset-amber': {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    icon: '🟠',
    isLight: false,
    bgPage: 'bg-[#0f0a06]',
    bgNavbar: 'bg-[#18100a]/80',
    bgCard: 'bg-[#22160e]/90',
    bgCardSub: 'bg-[#150d07]/80',
    borderCard: 'border-amber-500/25',
    borderSub: 'border-amber-500/15',
    primaryHex: '#f59e0b',
    primaryHoverHex: '#fbbf24',
    primaryGlow: 'rgba(245, 158, 11, 0.4)',
    primaryTextHex: '#1f1304',
    secondaryHex: '#f97316',
    accentHex: '#fde68a',
    textTitle: 'text-white',
    textBody: 'text-amber-100',
    textMuted: 'text-amber-300/60',
    textAccent: 'text-amber-400',
    chartBg: '#0b0603',
    chartGrid: '#331f10',
    chartLineInactive: '#63381a',
    chartText: '#fbbf24',
    primaryBgBtn: 'bg-amber-500 hover:bg-amber-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-bold',
    inactivePill: 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 hover:text-white',
  },

  // 8. Electric Cyan
  'electric-cyan': {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    icon: '🔵',
    isLight: false,
    bgPage: 'bg-slate-950',
    bgNavbar: 'bg-slate-900/80',
    bgCard: 'bg-slate-900/90',
    bgCardSub: 'bg-slate-950/70',
    borderCard: 'border-slate-800',
    borderSub: 'border-slate-800/80',
    primaryHex: '#06b6d4',
    primaryHoverHex: '#22d3ee',
    primaryGlow: 'rgba(6, 182, 212, 0.4)',
    primaryTextHex: '#021526',
    secondaryHex: '#3b82f6',
    accentHex: '#a5f3fc',
    textTitle: 'text-white',
    textBody: 'text-slate-100',
    textMuted: 'text-slate-400',
    textAccent: 'text-cyan-400',
    chartBg: '#080d16',
    chartGrid: '#182438',
    chartLineInactive: '#2c3f5e',
    chartText: '#22d3ee',
    primaryBgBtn: 'bg-cyan-500 hover:bg-cyan-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-bold',
    inactivePill: 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white',
  },
};
