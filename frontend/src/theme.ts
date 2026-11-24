export type ThemeId = 'cyber-violet' | 'emerald-matrix' | 'sunset-amber' | 'electric-cyan' | 'academic-light';

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
  secondaryHex: string;

  // Text
  textTitle: string;
  textBody: string;
  textMuted: string;
  textAccent: string;

  // Tailwinds classes
  primaryBgBtn: string;
  primaryTextBtn: string;
  activePill: string;
  inactivePill: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
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
    secondaryHex: '#f43f5e',
    textTitle: 'text-white',
    textBody: 'text-purple-100',
    textMuted: 'text-purple-300/60',
    textAccent: 'text-purple-400',
    primaryBgBtn: 'bg-purple-600 hover:bg-purple-500',
    primaryTextBtn: 'text-white',
    activePill: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold',
    inactivePill: 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 hover:text-white',
  },
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
    secondaryHex: '#06b6d4',
    textTitle: 'text-white',
    textBody: 'text-emerald-100',
    textMuted: 'text-emerald-300/60',
    textAccent: 'text-emerald-400',
    primaryBgBtn: 'bg-emerald-500 hover:bg-emerald-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-bold',
    inactivePill: 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 hover:text-white',
  },
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
    secondaryHex: '#f97316',
    textTitle: 'text-white',
    textBody: 'text-amber-100',
    textMuted: 'text-amber-300/60',
    textAccent: 'text-amber-400',
    primaryBgBtn: 'bg-amber-500 hover:bg-amber-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-bold',
    inactivePill: 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 hover:text-white',
  },
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
    secondaryHex: '#3b82f6',
    textTitle: 'text-white',
    textBody: 'text-slate-100',
    textMuted: 'text-slate-400',
    textAccent: 'text-cyan-400',
    primaryBgBtn: 'bg-cyan-500 hover:bg-cyan-400',
    primaryTextBtn: 'text-slate-950 font-bold',
    activePill: 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-bold',
    inactivePill: 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white',
  },
  'academic-light': {
    id: 'academic-light',
    name: 'Academic Light',
    icon: '⚪',
    isLight: true,
    bgPage: 'bg-[#f8fafc]',
    bgNavbar: 'bg-white/80',
    bgCard: 'bg-white/95',
    bgCardSub: 'bg-slate-50',
    borderCard: 'border-slate-200 shadow-sm',
    borderSub: 'border-slate-200',
    primaryHex: '#4f46e5',
    primaryHoverHex: '#6366f1',
    primaryGlow: 'rgba(79, 70, 229, 0.3)',
    secondaryHex: '#0284c7',
    textTitle: 'text-slate-900',
    textBody: 'text-slate-800',
    textMuted: 'text-slate-500',
    textAccent: 'text-indigo-600',
    primaryBgBtn: 'bg-indigo-600 hover:bg-indigo-500',
    primaryTextBtn: 'text-white font-bold',
    activePill: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold',
    inactivePill: 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900',
  },
};
