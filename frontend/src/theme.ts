export type ThemeId =
  | 'dracula-pro'
  | 'blueprint-cad'
  | 'aurora-glacier'
  | 'warm-espresso'
  | 'retro-amber'
  | 'academic-paper'
  | 'rustic-moss';

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

  // Accents & Brand
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
  // 1. Primary Default: Dracula Pro (Beloved Developer Palette)
  'dracula-pro': {
    id: 'dracula-pro',
    name: 'Dracula Pro',
    icon: '🧛',
    isLight: false,
    bgPage: 'bg-[#1e1f29]',            // Midnight Dracula Slate
    bgNavbar: 'bg-[#21222c]/90',
    bgCard: 'bg-[#282a36]/95',          // Authentic Dracula Charcoal
    bgCardSub: 'bg-[#191a21]/90',
    borderCard: 'border-[#44475a]/50', // Dracula Selection Gray
    borderSub: 'border-[#44475a]/30',
    primaryHex: '#bd93f9',              // Dracula Purple
    primaryHoverHex: '#caa7fc',
    primaryGlow: 'rgba(189, 147, 249, 0.45)',
    primaryTextHex: '#1e1f29',
    secondaryHex: '#50fa7b',            // Dracula Green
    accentHex: '#ff79c6',               // Dracula Pink
    textTitle: 'text-[#f8f8f2]',        // Dracula Alabaster
    textBody: 'text-[#f8f8f2]',
    textMuted: 'text-[#6272a4]',        // Dracula Comment Slate
    textAccent: 'text-[#bd93f9]',
    chartBg: '#191a21',
    chartGrid: '#343746',
    chartLineInactive: '#44475a',
    chartText: '#8be9fd',               // Dracula Cyan
    primaryBgBtn: 'bg-[#bd93f9] hover:bg-[#caa7fc]',
    primaryTextBtn: 'text-[#1e1f29] font-bold',
    activePill: 'bg-[#bd93f9] text-[#1e1f29] shadow-lg shadow-[#bd93f9]/25 font-bold',
    inactivePill: 'bg-[#21222c] text-[#f8f8f2] hover:bg-[#44475a] hover:text-[#50fa7b]',
  },

  // 2. Blueprint & Engineering CAD
  'blueprint-cad': {
    id: 'blueprint-cad',
    name: 'Blueprint CAD',
    icon: '📐',
    isLight: false,
    bgPage: 'bg-[#0a192f]',            // Blueprint Navy
    bgNavbar: 'bg-[#0e223f]/90',
    bgCard: 'bg-[#112240]/95',          // Drafting Surface
    bgCardSub: 'bg-[#0a1628]/90',
    borderCard: 'border-[#233554]/60',
    borderSub: 'border-[#233554]/40',
    primaryHex: '#64ffda',              // Electric Mint Laser
    primaryHoverHex: '#7fffe2',
    primaryGlow: 'rgba(100, 255, 218, 0.45)',
    primaryTextHex: '#0a192f',
    secondaryHex: '#38bdf8',            // Vector Cyan
    accentHex: '#ff7b72',
    textTitle: 'text-[#e6f1ff]',
    textBody: 'text-[#ccd6f6]',
    textMuted: 'text-[#8892b0]',
    textAccent: 'text-[#64ffda]',
    chartBg: '#071224',
    chartGrid: '#1e3a63',
    chartLineInactive: '#233554',
    chartText: '#64ffda',
    primaryBgBtn: 'bg-[#64ffda] hover:bg-[#7fffe2]',
    primaryTextBtn: 'text-[#0a192f] font-bold',
    activePill: 'bg-[#64ffda] text-[#0a192f] shadow-lg shadow-[#64ffda]/25 font-bold',
    inactivePill: 'bg-[#172a45] text-[#ccd6f6] hover:bg-[#203a5e] hover:text-[#64ffda]',
  },

  // 3. Midnight Aurora & Glacier
  'aurora-glacier': {
    id: 'aurora-glacier',
    name: 'Aurora Glacier',
    icon: '🌌',
    isLight: false,
    bgPage: 'bg-[#050d1a]',            // Abyssal Navy
    bgNavbar: 'bg-[#09152a]/90',
    bgCard: 'bg-[#0c1b33]/95',
    bgCardSub: 'bg-[#061021]/90',
    borderCard: 'border-[#1b3a5e]/50',
    borderSub: 'border-[#1b3a5e]/30',
    primaryHex: '#00f5a0',              // Aurora Emerald
    primaryHoverHex: '#33f7b3',
    primaryGlow: 'rgba(0, 245, 160, 0.45)',
    primaryTextHex: '#050d1a',
    secondaryHex: '#00d9f5',            // Glacier Cyan
    accentHex: '#a78bfa',
    textTitle: 'text-[#e8f4fd]',
    textBody: 'text-[#d0e5f7]',
    textMuted: 'text-[#7d9bb8]',
    textAccent: 'text-[#00f5a0]',
    chartBg: '#040913',
    chartGrid: '#142d4a',
    chartLineInactive: '#1e3e66',
    chartText: '#00d9f5',
    primaryBgBtn: 'bg-[#00f5a0] hover:bg-[#33f7b3]',
    primaryTextBtn: 'text-[#050d1a] font-bold',
    activePill: 'bg-[#00f5a0] text-[#050d1a] shadow-lg shadow-[#00f5a0]/25 font-bold',
    inactivePill: 'bg-[#102444] text-[#d0e5f7] hover:bg-[#183460] hover:text-white',
  },

  // 4. Warm Espresso & Caramel
  'warm-espresso': {
    id: 'warm-espresso',
    name: 'Warm Espresso',
    icon: '☕',
    isLight: false,
    bgPage: 'bg-[#14110f]',            // Espresso Night
    bgNavbar: 'bg-[#1a1614]/90',
    bgCard: 'bg-[#1f1a17]/95',          // Roasted Bark
    bgCardSub: 'bg-[#110e0c]/90',
    borderCard: 'border-[#3d322c]/50',
    borderSub: 'border-[#3d322c]/30',
    primaryHex: '#d4a373',              // Warm Caramel Gold
    primaryHoverHex: '#dfb58a',
    primaryGlow: 'rgba(212, 163, 115, 0.45)',
    primaryTextHex: '#14110f',
    secondaryHex: '#8c6239',            // Chestnut Bronze
    accentHex: '#e76f51',
    textTitle: 'text-[#fefae0]',
    textBody: 'text-[#f4edd2]',
    textMuted: 'text-[#9c8b7c]',
    textAccent: 'text-[#d4a373]',
    chartBg: '#0e0b0a',
    chartGrid: '#2d231e',
    chartLineInactive: '#4a3b32',
    chartText: '#d4a373',
    primaryBgBtn: 'bg-[#d4a373] hover:bg-[#dfb58a]',
    primaryTextBtn: 'text-[#14110f] font-bold',
    activePill: 'bg-[#d4a373] text-[#14110f] shadow-lg shadow-[#d4a373]/25 font-bold',
    inactivePill: 'bg-[#2a231f] text-[#f4edd2] hover:bg-[#382f2a] hover:text-white',
  },

  // 5. Vintage VT220 Amber Terminal
  'retro-amber': {
    id: 'retro-amber',
    name: 'VT220 Amber CRT',
    icon: '📺',
    isLight: false,
    bgPage: 'bg-[#0c0a06]',            // CRT Charcoal
    bgNavbar: 'bg-[#141008]/90',
    bgCard: 'bg-[#1a1409]/95',
    bgCardSub: 'bg-[#080603]/90',
    borderCard: 'border-[#ffb000]/30',
    borderSub: 'border-[#ffb000]/15',
    primaryHex: '#ffb000',              // Warm Phosphor Amber
    primaryHoverHex: '#ffc12e',
    primaryGlow: 'rgba(255, 176, 0, 0.5)',
    primaryTextHex: '#0c0a06',
    secondaryHex: '#ff8c00',            // Safety Orange
    accentHex: '#ffd54f',
    textTitle: 'text-[#fff3db]',
    textBody: 'text-[#f5ddad]',
    textMuted: 'text-[#a68037]',
    textAccent: 'text-[#ffb000]',
    chartBg: '#070503',
    chartGrid: '#291d08',
    chartLineInactive: '#523a10',
    chartText: '#ffb000',
    primaryBgBtn: 'bg-[#ffb000] hover:bg-[#ffc12e]',
    primaryTextBtn: 'text-[#0c0a06] font-bold',
    activePill: 'bg-[#ffb000] text-[#0c0a06] shadow-lg shadow-[#ffb000]/30 font-bold',
    inactivePill: 'bg-[#261d0b] text-[#f5ddad] hover:bg-[#382b12] hover:text-[#ffb000]',
  },

  // 6. Minimalist Academic LaTeX Paper
  'academic-paper': {
    id: 'academic-paper',
    name: 'Academic LaTeX Paper',
    icon: '📄',
    isLight: true,
    bgPage: 'bg-[#f8f9fa]',            // Off-White Paper
    bgNavbar: 'bg-[#ffffff]/90',
    bgCard: 'bg-[#ffffff]',
    bgCardSub: 'bg-[#f1f5f9]',
    borderCard: 'border-[#cbd5e1] shadow-sm',
    borderSub: 'border-[#e2e8f0]',
    primaryHex: '#2563eb',              // Royal Academic Blue
    primaryHoverHex: '#1d4ed8',
    primaryGlow: 'rgba(37, 99, 235, 0.35)',
    primaryTextHex: '#ffffff',
    secondaryHex: '#059669',            // Academic Emerald
    accentHex: '#dc2626',
    textTitle: 'text-[#0f172a]',        // Rich Black Ink
    textBody: 'text-[#334155]',
    textMuted: 'text-[#64748b]',
    textAccent: 'text-[#2563eb]',
    chartBg: '#f8fafc',
    chartGrid: '#e2e8f0',
    chartLineInactive: '#94a3b8',
    chartText: '#475569',
    primaryBgBtn: 'bg-[#2563eb] hover:bg-[#1d4ed8]',
    primaryTextBtn: 'text-white font-bold',
    activePill: 'bg-[#2563eb] text-white shadow-md font-bold',
    inactivePill: 'bg-[#e2e8f0] text-[#0f172a] hover:bg-[#cbd5e1]',
  },

  // 7. Rustic Moss & Stone (Natural Earth)
  'rustic-moss': {
    id: 'rustic-moss',
    name: 'Rustic Moss & Stone',
    icon: '🌿',
    isLight: false,
    bgPage: 'bg-[#181d19]',            // Deep dark weathered pine-slate
    bgNavbar: 'bg-[#1e2520]/90',
    bgCard: 'bg-[#222a24]/95',
    bgCardSub: 'bg-[#19201a]/90',
    borderCard: 'border-[#7a7c64]/35',
    borderSub: 'border-[#7a7c64]/20',
    primaryHex: '#cec88a',              // Moss Gold / Olive Ochre
    primaryHoverHex: '#ded79d',
    primaryGlow: 'rgba(206, 200, 138, 0.45)',
    primaryTextHex: '#221e17',
    secondaryHex: '#7a7c64',            // Sage Green
    accentHex: '#bcb096',               // Taupe Stone
    textTitle: 'text-[#ece6da]',        // Warm Linen Cream
    textBody: 'text-[#ded7c8]',
    textMuted: 'text-[#bcb096]',
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
};
