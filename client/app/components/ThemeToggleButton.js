'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function ThemeToggleButton({ compact = false, className = '' }) {
  const { mounted, theme, toggleTheme } = useTheme();

  const isLight = mounted && theme === 'light';
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full border border-outline/30 bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface shadow-sm shadow-black/5 backdrop-blur transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
        compact ? 'h-11 w-11 px-0' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="material-symbols-outlined text-[20px]">
        {isLight ? 'dark_mode' : 'light_mode'}
      </span>
      {!compact && (
        <span className="hidden sm:inline">
          {isLight ? 'Dark mode' : 'Light mode'}
        </span>
      )}
    </button>
  );
}
