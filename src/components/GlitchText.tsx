import { createElement } from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
}

export default function GlitchText({ text, as = 'p', className = '' }: GlitchTextProps) {
  return createElement(as, { className }, text);
}
