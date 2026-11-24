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
            ? 'bg-[#faf7f0] hover:bg-[#ede6d9] text-[#40392f] border-[#d1c8b4]'
            : 'bg-[#222a24] hover:bg-[#2b352f] text-[#ece6da] border-[#465248]'
        }`}
        title="Change Color Theme"
      >
        <Palette className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
        <span>{theme.name}</span>
        <span className="text-xs">{theme.icon}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl z-50 flex flex-col gap-1 transition-all ${
            theme.isLight
              ? 'bg-[#faf7f0] border-[#d1c8b4] text-[#40392f] shadow-xl'
              : 'bg-[#1e2520] border-[#465248] text-[#ece6da] shadow-2xl'
          }`}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 ${theme.textMuted}`}>
            Select Color Palette
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
                      ? 'bg-[#ede6d9] text-[#40392f] font-bold border border-[#d1c8b4]'
                      : 'bg-[#28322a] text-[#ece6da] font-bold border border-[#7a7c64]/50'
                    : theme.isLight
                    ? 'hover:bg-[#f0e9dc] text-[#40392f]'
                    : 'hover:bg-[#28322a]/70 text-[#ded7c8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.icon}</span>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{t.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                        style={{ backgroundColor: t.secondaryHex }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                        style={{ backgroundColor: t.accentHex }}
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
