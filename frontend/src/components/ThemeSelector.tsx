import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import type { ThemeId } from '../theme';
import { THEMES } from '../theme';
import { Palette, Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { themeId, theme, setThemeId } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
          theme.isLight
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            : `${theme.bgCard} hover:border-slate-600 text-slate-200 ${theme.borderCard}`
        }`}
        title="Change Color Theme"
      >
        <Palette className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
        <span>{theme.name}</span>
        <span className="text-xs">{theme.icon}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-52 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl z-50 flex flex-col gap-1 ${
            theme.isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
              : 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-black/80'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 text-slate-400">
            Select Color Theme
          </div>

          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const t = THEMES[id];
            const isSelected = themeId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setThemeId(id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? theme.isLight
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'bg-slate-800 text-white font-bold'
                    : theme.isLight
                    ? 'hover:bg-slate-100 text-slate-600'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.icon}</span>
                  <div className="flex flex-col text-left">
                    <span>{t.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: t.secondaryHex }}
                      />
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4" style={{ color: t.primaryHex }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
