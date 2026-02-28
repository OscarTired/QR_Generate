import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import i18n from '../i18n/index';

export default function Header() {
  const { t } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('qr-info-lang', next);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 w-full border-b"
      style={{ borderColor: '#00f5ff22', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(10px)' }}
    >
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-center">
        <div className="w-full max-w-[115rem] flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="relative w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex-shrink-0"
            >
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="2" y="2" width="28" height="28" rx="2" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="4 2" />
                <rect x="8" y="8" width="16" height="16" rx="1" stroke="#ff00ff" strokeWidth="1" />
                <circle cx="16" cy="16" r="3" fill="#00f5ff" />
                <line x1="16" y1="2" x2="16" y2="8" stroke="#00f5ff" strokeWidth="1.5" />
                <line x1="16" y1="24" x2="16" y2="30" stroke="#00f5ff" strokeWidth="1.5" />
                <line x1="2" y1="16" x2="8" y2="16" stroke="#00f5ff" strokeWidth="1.5" />
                <line x1="24" y1="16" x2="30" y2="16" stroke="#00f5ff" strokeWidth="1.5" />
              </svg>
            </motion.div>

            <div className="min-w-0 flex-1">
              <GlitchText
                text={t('header.title')}
                as="h1"
                className="holo-strong text-sm sm:text-base lg:text-lg tracking-[0.15em] sm:tracking-[0.2em] truncate"
              />
              <p className="data-tag text-[0.6em] sm:text-[0.65em] mt-1 truncate">{t('header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2.5">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 6px #00ff88' }}
              />
              <span className="data-tag signal-chip holo-strong text-[0.66em]">{t('footer.signal')}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLang}
              className="cyber-btn px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-sm whitespace-nowrap flex-shrink-0 font-medium"
              style={{
                border: '1px solid #00f5ff55',
                color: '#00f5ff',
                background: 'rgba(0,245,255,0.05)',
              }}
            >
              {i18n.language === 'es' ? '🌐 EN' : '🌐 ES'}
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-px"
        animate={{ width: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'linear-gradient(to right, transparent, #00f5ff, transparent)' }}
      />
    </motion.header>
  );
}
