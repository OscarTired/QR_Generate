import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HUDPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  label?: string;
  accentColor?: 'cyan' | 'magenta' | 'green';
}

const accentStyles = {
  cyan: {
    border: '#00f5ff33',
    corner: '#00f5ff',
    label: 'text-neon-cyan',
    shadow: '0 0 20px #00f5ff11',
  },
  magenta: {
    border: '#ff00ff33',
    corner: '#ff00ff',
    label: 'text-neon-magenta',
    shadow: '0 0 20px #ff00ff11',
  },
  green: {
    border: '#00ff8833',
    corner: '#00ff88',
    label: 'text-neon-green',
    shadow: '0 0 20px #00ff8811',
  },
};

export default function HUDPanel({
  children,
  className = '',
  delay = 0,
  label,
  accentColor = 'cyan',
}: HUDPanelProps) {
  const accent = accentStyles[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`relative rounded-sm overflow-visible flex flex-col ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0d0d1a 0%, #0f1020 50%, #0a0a18 100%)',
        border: `1px solid ${accent.border}`,
        boxShadow: `inset 0 0 30px #00f5ff08, ${accent.shadow}`,
      }}
    >
      {/* Corner brackets */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
        style={{
          borderTop: `2px solid ${accent.corner}`,
          borderLeft: `2px solid ${accent.corner}`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 w-3 h-3 pointer-events-none"
        style={{
          borderTop: `2px solid ${accent.corner}`,
          borderRight: `2px solid ${accent.corner}`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none"
        style={{
          borderBottom: `2px solid ${accent.corner}`,
          borderLeft: `2px solid ${accent.corner}`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
        style={{
          borderBottom: `2px solid ${accent.corner}`,
          borderRight: `2px solid ${accent.corner}`,
        }}
      />

      {/* Optional label tag — sits exactly on top of the border like a fieldset legend */}
      {label && (
        <div
          className={`absolute left-4 top-0 -translate-y-1/2 z-20 px-2 text-[0.7rem] font-mono tracking-widest ${accent.label}`}
          style={{
            background: '#0a0a0f', // Coincide con el fondo principal de la página para "cortar" el borde limpiamente
            letterSpacing: '0.16em',
          }}
        >
          {label}
        </div>
      )}

      {/* Holographic shimmer overlay */}
      <div className="holo-shimmer absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
