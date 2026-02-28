import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import HUDPanel from '../components/HUDPanel';
import GlitchText from '../components/GlitchText';

interface ProjectData {
  project: string;
  manager: string;
  description: string;
}

function decodeData(raw: string | null): ProjectData | null {
  try {
    if (!raw) return null;
    const normalized = raw.replace(/\s/g, '+').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(decodeURIComponent(atob(padded)));
  } catch {
    return null;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { payload } = useParams();
  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState(false);
  const [timestamp] = useState(() => new Date().toISOString().replace('T', ' ').slice(0, 19));

  useEffect(() => {
    const queryPayload = new URLSearchParams(location.search).get('d');
    const decoded = decodeData(payload ?? queryPayload);
    if (decoded) {
      setData(decoded);
      setError(false);
    } else {
      setError(true);
    }
  }, [payload, location.search]);

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-8.5rem)] px-4 sm:px-6 py-8 sm:py-12 flex items-center">
        <HUDPanel accentColor="magenta" className="w-full max-w-3xl mx-auto">
          <div className="p-6 sm:p-8 lg:p-10 text-center space-y-4 sm:space-y-5">
            <GlitchText
              text={t('view.error_title')}
              as="h2"
              className="text-neon-magenta font-mono text-lg sm:text-xl lg:text-2xl tracking-widest"
            />
            <p className="text-gray-400 text-sm sm:text-base font-mono">{t('view.error_msg')}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="cyber-btn mt-4 px-6 sm:px-8 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base"
              style={{
                border: '1px solid #ff00ff66',
                color: '#ff00ff',
                background: 'rgba(255,0,255,0.05)',
              }}
            >
              ← {t('view.error_back')}
            </motion.button>
          </div>
        </HUDPanel>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-[calc(100vh-8.5rem)] flex items-center justify-center px-4">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="data-tag text-base sm:text-lg lg:text-xl tracking-widest"
        >
          DECODING...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-8.5rem)] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 flex flex-col justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl lg:max-w-5xl mx-auto space-y-5 sm:space-y-6 lg:space-y-7"
      >
        <motion.div variants={itemVariants} className="space-y-2 sm:space-y-2.5">
          <GlitchText
            text={t('view.title')}
            as="h2"
            className="text-neon-cyan font-mono text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-normal tracking-[0.12em] sm:tracking-[0.15em]"
          />
          <p className="data-tag text-[0.7em] sm:text-[0.75em]">{t('view.subtitle')}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-sm"
          style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid #00ff8822' }}
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
              style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}
            />
            <span className="text-neon-green font-mono text-xs sm:text-sm tracking-widest">{t('view.status')}</span>
          </div>
          <span className="data-tag text-[0.6em] sm:text-[0.65em]">{t('view.timestamp')}: {timestamp}</span>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HUDPanel accentColor="cyan" label="PROJECT_ID">
            <div className="p-5 sm:p-6 lg:p-7 space-y-2.5 sm:space-y-3">
              <p className="data-tag text-[0.7em] sm:text-[0.75em]">{t('view.project')}</p>
              <p
                className="font-mono text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-neon-cyan break-words"
              >
                {data.project}
              </p>
            </div>
          </HUDPanel>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HUDPanel accentColor="magenta" label="MANAGER_ID">
            <div className="p-5 sm:p-6 lg:p-7 space-y-2.5 sm:space-y-3">
              <p className="data-tag text-[0.7em] sm:text-[0.75em]">{t('view.manager')}</p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-sm flex items-center justify-center font-mono text-base sm:text-lg lg:text-xl font-bold flex-shrink-0"
                  style={{
                    background: 'rgba(255,0,255,0.1)',
                    border: '1px solid #ff00ff44',
                    color: '#ff00ff',
                    boxShadow: '0 0 10px #ff00ff22',
                  }}
                >
                  {data.manager.charAt(0).toUpperCase()}
                </div>
                <p
                  className="font-mono text-lg sm:text-xl lg:text-2xl font-semibold break-words"
                  style={{ color: '#ff00ff', textShadow: '0 0 8px #ff00ff66' }}
                >
                  {data.manager}
                </p>
              </div>
            </div>
          </HUDPanel>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HUDPanel accentColor="green" label="DESCRIPTION">
            <div className="p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-4">
              <p className="data-tag text-[0.7em] sm:text-[0.75em]">{t('view.description')}</p>
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed font-sans break-words whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
          </HUDPanel>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-3 sm:pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="cyber-btn w-full py-3 sm:py-3.5 lg:py-4 rounded-sm text-sm sm:text-base font-medium"
            style={{
              border: '1px solid #00f5ff44',
              color: '#00f5ff',
              background: 'rgba(0,245,255,0.04)',
            }}
          >
            ← {t('view.back_btn')}
          </motion.button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center data-tag text-[0.6em] sm:text-[0.65em] pb-4 sm:pb-6"
        >
          {t('footer.protocol')} // QR INFO SYSTEM
        </motion.p>
      </motion.div>
    </div>
  );
}
