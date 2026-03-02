import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeStyling from 'qr-code-styling';
import HUDPanel from '../components/HUDPanel';
import GlitchText from '../components/GlitchText';

interface FormData {
  project: string;
  manager: string;
  description: string;
}

type StatusType = 'ready' | 'encoding' | 'complete';

export default function FormPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({ project: '', manager: '', description: '' });
  const [qrValue, setQrValue] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<StatusType>('ready');
  const [copied, setCopied] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.project.trim()) errs.project = t('form.required');
    if (!form.manager.trim()) errs.manager = t('form.required');
    if (!form.description.trim()) errs.description = t('form.required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayloadText = useCallback((data: FormData): string => {
    const now = new Date().toISOString();

    return [
      'QR INFO',
      `PROJECT: ${data.project.trim()}`,
      `MANAGER: ${data.manager.trim()}`,
      `DESCRIPTION: ${data.description.trim()}`,
      `GENERATED AT: ${now}`,
    ].join('\n');
  }, []);

  const handleGenerate = async () => {
    if (!validate()) return;
    setQrValue('');
    setCopied(false);
    setStatus('encoding');
    await new Promise(r => setTimeout(r, 1400));
    const payloadText = buildPayloadText(form);
    setQrValue(payloadText);
    setStatus('complete');
  };

  const handleReset = () => {
    setForm({ project: '', manager: '', description: '' });
    setQrValue('');
    setErrors({});
    setStatus('ready');
    setCopied(false);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const size = 512;
    const padding = 40;
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    const b = 12;
    ctx.beginPath();
    ctx.moveTo(b + 20, b); ctx.lineTo(b, b); ctx.lineTo(b, b + 20);
    ctx.moveTo(size - b - 20, b); ctx.lineTo(size - b, b); ctx.lineTo(size - b, b + 20);
    ctx.moveTo(b, size - b - 20); ctx.lineTo(b, size - b); ctx.lineTo(b + 20, size - b);
    ctx.moveTo(size - b, size - b - 20); ctx.lineTo(size - b, size - b); ctx.lineTo(size - b - 20, size - b);
    ctx.stroke();

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const inner = size - padding * 2;
      ctx.drawImage(img, padding, padding, inner, inner);
      URL.revokeObjectURL(svgUrl);
      
      const link = document.createElement('a');
      link.download = `qr-${form.project.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = offscreen.toDataURL('image/png');
      link.click();
    };
    img.src = svgUrl;
  };

  const handleCopyLink = async () => {
    if (!qrValue) return;
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusLabel = {
    ready: t('form.status_ready'),
    encoding: t('form.status_encoding'),
    complete: t('form.status_complete'),
  }[status];

  const statusColor = {
    ready: '#00f5ff',
    encoding: '#ffff00',
    complete: '#00ff88',
  }[status];

  useEffect(() => {
    if (status !== 'encoding') {
      setLoadingDots(1);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingDots(prev => (prev % 3) + 1);
    }, 280);

    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'svg',
      data: ' ',
      margin: 8,
      qrOptions: {
        errorCorrectionLevel: 'Q',
      },
      dotsOptions: {
        type: 'classy-rounded',
        gradient: {
          type: 'linear',
          rotation: Math.PI / 5,
          colorStops: [
            { offset: 0, color: '#00f5ff' },
            { offset: 0.55, color: '#00ff88' },
            { offset: 1, color: '#7a9dff' },
          ],
        },
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: '#00f5ff',
      },
      cornersDotOptions: {
        type: 'dot',
        color: '#ff5cf4',
      },
      backgroundOptions: {
        color: '#071015',
      },
    });
  }, []);

  const qrCanvasCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || !qrCodeRef.current) return;
    node.innerHTML = '';
    qrCodeRef.current.append(node);
    if (qrValue) {
      qrCodeRef.current.update({ data: qrValue });
    }
  }, [qrValue]);

  const statusWithDots = status === 'encoding'
    ? `${statusLabel}${'.'.repeat(loadingDots)}`
    : statusLabel;

  return (
    <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex flex-col items-center justify-start min-h-[calc(100vh-8.5rem)]">
      <div className="w-full max-w-[85rem] mb-6 sm:mb-8 lg:mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 border-b pb-5 sm:pb-6 lg:pb-7 w-full"
          style={{ borderColor: '#00f5ff22' }}
        >
          <div className="w-full sm:w-auto">
            <GlitchText
              text={t('form.title')}
              as="h2"
              className="holo-strong text-xl sm:text-2xl lg:text-3xl tracking-[0.12em]"
            />
            <p className="data-tag mt-2 text-[0.7em] sm:text-[0.75em]">{t('form.subtitle')}</p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-widest shrink-0"
            style={{ color: statusColor }}>
            <motion.span
              animate={{ opacity: status === 'encoding' ? [1, 0.2, 1] : 1 }}
              transition={{ duration: 0.4, repeat: status === 'encoding' ? Infinity : 0 }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
              style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            />
            <motion.span
              key={status}
              initial={{ opacity: 0.6, scale: 0.96 }}
              animate={{ opacity: 1, scale: status === 'complete' ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.45 }}
            >
              {statusWithDots}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 w-full pt-4">
          <HUDPanel delay={0.1} label="INPUT_FIELDS" accentColor="cyan" className="min-h-[500px] sm:min-h-[520px] lg:h-[560px] w-full">
            <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8 flex flex-col h-full w-full">
              <div className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6 flex-1 w-full">

            <div className="space-y-2">
              <label className="data-tag block text-[0.7em] sm:text-[0.75em]">{t('form.project_label')}</label>
              <input
                type="text"
                value={form.project}
                onChange={e => { setForm(p => ({ ...p, project: e.target.value })); setErrors(p => ({ ...p, project: '' })); }}
                placeholder={t('form.project_placeholder')}
                maxLength={80}
                className={`cyber-input w-full px-4 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base ${errors.project ? 'border-red-500' : ''}`}
              />
              <AnimatePresence>
                {errors.project && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs sm:text-sm font-mono"
                  >
                    ⚠ {errors.project}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="data-tag block text-[0.7em] sm:text-[0.75em]">{t('form.manager_label')}</label>
              <input
                type="text"
                value={form.manager}
                onChange={e => { setForm(p => ({ ...p, manager: e.target.value })); setErrors(p => ({ ...p, manager: '' })); }}
                placeholder={t('form.manager_placeholder')}
                maxLength={60}
                className={`cyber-input w-full px-4 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base ${errors.manager ? 'border-red-500' : ''}`}
              />
              <AnimatePresence>
                {errors.manager && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs sm:text-sm font-mono"
                  >
                    ⚠ {errors.manager}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <label className="data-tag block text-[0.7em] sm:text-[0.75em]">{t('form.description_label')}</label>
                <span className="data-tag text-[0.6em] sm:text-[0.65em]">{form.description.length}/300 {t('form.chars')}</span>
              </div>
              <textarea
                value={form.description}
                onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setErrors(p => ({ ...p, description: '' })); }}
                placeholder={t('form.description_placeholder')}
                maxLength={300}
                rows={5}
                className={`cyber-input w-full px-4 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              <AnimatePresence>
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs sm:text-sm font-mono"
                  >
                    ⚠ {errors.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 mt-auto w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                disabled={status === 'encoding'}
                className="cyber-btn w-full sm:flex-1 px-5 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base font-semibold"
                style={{
                  background: status === 'encoding'
                    ? 'rgba(0,245,255,0.05)'
                    : 'linear-gradient(135deg, rgba(0,245,255,0.15) 0%, rgba(0,245,255,0.05) 100%)',
                  border: '1px solid #00f5ff66',
                  color: '#00f5ff',
                  boxShadow: '0 0 12px #00f5ff22',
                }}
              >
                <AnimatePresence mode="wait">
                  {status === 'encoding' ? (
                    <motion.span
                      key="encoding"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [1, 0.55, 1] }}
                      transition={{ duration: 0.55, repeat: Infinity }}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{t('form.status_encoding')}{'.'.repeat(loadingDots)}</span>
                    </motion.span>
                  ) : status === 'complete' ? (
                    <motion.span
                      key="complete"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center gap-2 text-green-300"
                    >
                      ✓ {t('form.status_complete')}
                    </motion.span>
                  ) : (
                    <motion.span key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      ▶ {t('form.generate_btn')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="cyber-btn w-full sm:flex-1 px-5 py-3 sm:py-3.5 rounded-sm text-sm sm:text-base"
                style={{
                  border: '1px solid #ff00ff44',
                  color: '#ff00ff99',
                  background: 'rgba(255,0,255,0.03)',
                }}
              >
                ✕ {t('form.reset_btn')}
              </motion.button>
            </div>
            </div>
            </div>
          </HUDPanel>

          <HUDPanel delay={0.2} label="QR_OUTPUT" accentColor={qrValue ? 'green' : 'cyan'} className="min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] w-full overflow-visible">
            <div className="px-5 sm:px-8 lg:px-10 py-5 sm:py-7 lg:py-8 flex flex-col h-full w-full">
              <AnimatePresence mode="wait">
                {!qrValue ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-6 text-center w-full"
                  >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 opacity-20"
                    style={{ border: '2px dashed #00f5ff44' }}>
                    <span className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }} />
                    <span className="absolute top-0 right-0 w-5 h-5" style={{ borderTop: '2px solid #00f5ff', borderRight: '2px solid #00f5ff' }} />
                    <span className="absolute bottom-0 left-0 w-5 h-5" style={{ borderBottom: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }} />
                    <span className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: '2px solid #00f5ff', borderRight: '2px solid #00f5ff' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 60 60" className="w-14 h-14 sm:w-16 sm:h-16" fill="none">
                        <rect x="4" y="4" width="22" height="22" rx="2" stroke="#00f5ff" strokeWidth="2" />
                        <rect x="10" y="10" width="10" height="10" fill="#00f5ff" />
                        <rect x="34" y="4" width="22" height="22" rx="2" stroke="#00f5ff" strokeWidth="2" />
                        <rect x="40" y="10" width="10" height="10" fill="#00f5ff" />
                        <rect x="4" y="34" width="22" height="22" rx="2" stroke="#00f5ff" strokeWidth="2" />
                        <rect x="10" y="40" width="10" height="10" fill="#00f5ff" />
                        <rect x="34" y="34" width="6" height="6" fill="#00f5ff" />
                        <rect x="44" y="34" width="6" height="6" fill="#00f5ff" />
                        <rect x="34" y="44" width="6" height="6" fill="#00f5ff" />
                        <rect x="44" y="44" width="6" height="6" fill="#00f5ff" />
                        <rect x="54" y="34" width="2" height="2" fill="#00f5ff" />
                      </svg>
                    </div>
                  </div>
                  <p className="data-tag text-center max-w-[220px] text-[0.7em] sm:text-[0.75em]">
                    {t('form.qr_section')}
                  </p>
                </motion.div>
                ) : (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                    className="flex flex-col items-center justify-between h-full w-full gap-4"
                  >
                    <div className="flex flex-col items-center w-full pt-2">
                  <div className="relative overflow-visible" ref={qrRef}>
                    <motion.div
                      className="absolute -inset-3 rounded-[1.2rem]"
                      animate={{ opacity: [0.3, 0.65, 0.3] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      style={{
                        background: 'radial-gradient(circle, rgba(0,245,255,0.18) 0%, rgba(0,245,255,0) 65%)',
                        filter: 'blur(4px)',
                      }}
                    />

                    <div
                      className="relative p-[10px] rounded-[1rem]"
                      style={{
                        background: 'linear-gradient(140deg, rgba(0,245,255,0.5), rgba(0,255,136,0.35), rgba(255,0,255,0.45))',
                        boxShadow: '0 0 30px #00f5ff33, 0 0 60px #00ff8822',
                      }}
                    >
                      <div
                        className="relative p-2 sm:p-2.5 rounded-[0.85rem]"
                        style={{
                          background: '#071015',
                          border: '1px solid #00f5ff55',
                          aspectRatio: '1 / 1',
                        }}
                      >
                        <div ref={qrCanvasCallbackRef} className="styled-qr w-[160px] sm:w-[180px] h-full max-w-full mx-auto flex items-center justify-center" />
                        <div
                          className="absolute inset-0 pointer-events-none rounded-[0.85rem]"
                          style={{ boxShadow: 'inset 0 0 30px #00f5ff14' }}
                        />
                      </div>
                    </div>

                    <motion.div
                      className="absolute left-0 right-0 h-0.5 pointer-events-none"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ background: 'rgba(0,255,136,0.5)', boxShadow: '0 0 8px #00ff88' }}
                    />
                  </div>

                  <p className="data-tag text-[0.65em] sm:text-[0.7em] mt-3 sm:mt-5 mb-2">{t('form.qr_hint')}</p>

                  <div className="w-full max-w-xl mt-1 sm:mt-2">
                    <p className="data-tag text-[0.62em] sm:text-[0.68em] mb-2">{t('form.payload_label')}</p>
                    <pre
                      className="w-full max-h-16 sm:max-h-20 overflow-auto px-3 py-2 rounded-sm text-[0.6rem] sm:text-[0.68rem] leading-relaxed font-mono"
                      style={{
                        border: '1px solid #00f5ff44',
                        background: 'rgba(0,245,255,0.04)',
                        color: '#9af9ff',
                      }}
                    >
                      {qrValue}
                    </pre>
                  </div>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full mt-2 border-t pt-2"
                      style={{ borderColor: '#00f5ff18' }}
                    >
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      className="cyber-btn flex-1 px-4 py-2.5 sm:py-3 rounded-sm text-xs sm:text-sm"
                      style={{
                        border: '1px solid #00ff8866',
                        color: '#00ff88',
                        background: 'rgba(0,255,136,0.05)',
                      }}
                    >
                      ↓ {t('form.download_btn')}
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopyLink}
                      className="cyber-btn flex-1 px-4 py-2.5 sm:py-3 rounded-sm text-xs sm:text-sm"
                      style={{
                        border: `1px solid ${copied ? '#00ff8866' : '#00f5ff44'}`,
                        color: copied ? '#00ff88' : '#00f5ff',
                        background: copied ? 'rgba(0,255,136,0.05)' : 'rgba(0,245,255,0.03)',
                      }}
                    >
                      {copied ? `✓ ${t('form.copied')}` : `⧉ ${t('form.copy_link_btn')}`}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </HUDPanel>
        </div>

        <AnimatePresence>
          {(form.project || form.manager) && (
            <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="pt-6 sm:pt-8 w-full max-w-6xl"
          >
            <HUDPanel delay={0} accentColor="magenta" label="LIVE_PREVIEW">
              <div className="px-5 sm:px-7 lg:px-8 py-4 sm:py-5 lg:py-6 flex flex-wrap gap-x-6 sm:gap-x-10 lg:gap-x-12 gap-y-3 sm:gap-y-4">
                {form.project && (
                  <div className="break-words">
                    <span className="data-tag text-[0.7em] sm:text-[0.75em]">{t('form.project_label')}: </span>
                    <span className="font-mono text-sm sm:text-base font-semibold text-neon-cyan">{form.project}</span>
                  </div>
                )}
                {form.manager && (
                  <div className="break-words">
                    <span className="data-tag text-[0.7em] sm:text-[0.75em]">{t('form.manager_label')}: </span>
                    <span className="font-mono text-sm sm:text-base font-semibold" style={{ color: '#ff00ff' }}>{form.manager}</span>
                  </div>
                )}
                {form.description && (
                  <div className="w-full break-words">
                    <span className="data-tag text-[0.7em] sm:text-[0.75em]">{t('form.description_label')}: </span>
                    <span className="font-mono text-sm sm:text-base text-gray-300">{form.description}</span>
                  </div>
                )}
              </div>
            </HUDPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
