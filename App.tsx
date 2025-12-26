import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStatus, BreathingMode } from './types';
import { MODES } from './constants';
import { telegramService } from './services/telegramService';
import { audioService } from './services/audioService';
import BreathingOrb from './components/BreathingOrb';
import { GlassCard } from './components/GlassCard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentMode, setCurrentMode] = useState<BreathingMode | null>(null);
  const [sessionTime, setSessionTime] = useState<number>(300); 
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedSound, setSelectedSound] = useState<'rain' | 'breath'>('breath');
  
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const timerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    telegramService.ready();
    telegramService.expand();
    telegramService.setHeaderColor('#0f172a');
  }, []);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock request failed', err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  const handleToggleSession = () => {
    if (status === AppStatus.IDLE) {
      if (!currentMode) {
        telegramService.hapticFeedback('error');
        document.getElementById('modes-list')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      
      // СТАРТ
      audioService.unlock();
      if (selectedSound === 'rain') {
        audioService.playRain(); 
      }
      
      setStatus(AppStatus.RUNNING);
      setTimeLeft(sessionTime);
      setPhaseIndex(0);
      setPhaseProgress(0);
      requestWakeLock();
      telegramService.hapticFeedback('medium');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
      // СТОП
      setStatus(AppStatus.IDLE);
      audioService.stopRain(); 
      releaseWakeLock();
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseTimerRef.current) cancelAnimationFrame(phaseTimerRef.current);
      telegramService.hapticFeedback('light');
    }
  };

  const handleModeClick = (mode: BreathingMode) => {
    if (status !== AppStatus.IDLE) return;
    if (currentMode?.id === mode.id) {
      setCurrentMode(null);
    } else {
      setCurrentMode(mode);
    }
    telegramService.hapticFeedback('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Таймер обратного отсчета
  useEffect(() => {
    if (status === AppStatus.RUNNING || status === AppStatus.OVERTIME) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1 && status === AppStatus.RUNNING) {
            setStatus(AppStatus.OVERTIME);
            audioService.playGong(); 
            telegramService.hapticFeedback('warning');
            return 0;
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Логика фаз
  useEffect(() => {
    if ((status !== AppStatus.RUNNING && status !== AppStatus.OVERTIME) || !currentMode) return;

    let phaseStartTime = Date.now();
    const currentPhase = currentMode.pattern[phaseIndex];

    if (phaseProgress === 0) {
       if (selectedSound === 'breath') {
          const text = currentPhase.text.toLowerCase();
          if (text.includes('вдох')) audioService.playInhale();
          if (text.includes('выдох')) audioService.playExhale();
       } 
       else if (selectedSound === 'rain') {
          audioService.playGong();
       }
    }

    const step = () => {
      const elapsed = (Date.now() - phaseStartTime) / 1000;
      const progress = Math.min(elapsed / currentPhase.duration, 1);
      
      setPhaseProgress(progress);

      if (progress >= 1) {
        const nextIdx = (phaseIndex + 1) % currentMode.pattern.length;
        setPhaseIndex(nextIdx);
        
        if (selectedSound === 'breath') { 
            const nextPhase = currentMode.pattern[nextIdx];
            const text = nextPhase.text.toLowerCase();
            if (text.includes('вдох')) audioService.playInhale();
            if (text.includes('выдох')) audioService.playExhale();
        } 
        else if (selectedSound === 'rain') {
            audioService.playGong();
        }

        telegramService.hapticFeedback('light');
        phaseStartTime = Date.now(); 
      } else {
        phaseTimerRef.current = requestAnimationFrame(step);
      }
    };

    phaseTimerRef.current = requestAnimationFrame(step);

    return () => {
      if (phaseTimerRef.current) cancelAnimationFrame(phaseTimerRef.current);
    };
  }, [status, phaseIndex, currentMode, selectedSound]); 

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    if (val > 60) val = 60;
    if (val < 0) val = 1;
    setSessionTime(val * 60);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans pb-20 relative overflow-y-auto">
      
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_#0f172a_100%)] opacity-30 pointer-events-none z-0" />

      {/* Таймер */}
      <AnimatePresence>
        {status !== AppStatus.IDLE && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-0 w-full flex justify-center z-[50] pointer-events-none"
          >
            <div className="text-3xl font-mono text-blue-400/90 tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              {formatTime(timeLeft)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Меню */}
      <AnimatePresence>
        {status === AppStatus.IDLE && (
          <motion.div 
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            className="z-10 pt-6 px-6 relative"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white tracking-tight">Тренажер дыхания</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Упражнения для гармонизации</p>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 p-1 flex items-center min-w-[120px]">
                <input
                  type="number"
                  value={sessionTime / 60}
                  onChange={handleTimeChange}
                  className="bg-transparent text-white font-bold w-14 outline-none text-center text-lg pl-2"
                />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide pr-3">мин</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Выберите звук</p>
              <div className="bg-slate-800/40 rounded-xl p-1 flex w-full max-w-[300px] border border-white/5">
                <button 
                  onClick={() => setSelectedSound('rain')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedSound === 'rain' ? 'bg-blue-600/40 text-white border border-blue-400/30' : 'text-slate-400'}`}
                >
                  Дождь
                </button>
                <button 
                  onClick={() => setSelectedSound('breath')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedSound === 'breath' ? 'bg-blue-600/40 text-white border border-blue-400/30' : 'text-slate-400'}`}
                >
                  Дыхание
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Шар с передачей isOvertime */}
      <div className="w-full flex flex-col items-center justify-center py-6 z-10 relative">
        <BreathingOrb 
          phase={currentMode?.pattern[phaseIndex] || { duration: 4, text: '', scale: 1 }} 
          progress={phaseProgress}
          isActive={status !== AppStatus.IDLE}
          isModeSelected={!!currentMode}
          // 👇 Передаем флаг овертайма
          isOvertime={status === AppStatus.OVERTIME}
          modeName={currentMode?.name}
          onClick={handleToggleSession}
        />
      </div>

      {/* Список режимов */}
      <AnimatePresence>
        {status === AppStatus.IDLE && (
          <motion.div 
            id="modes-list"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full px-6 space-y-4 z-10"
          >
            {MODES.map(mode => (
              <GlassCard 
                key={mode.id} 
                active={currentMode?.id === mode.id}
                onClick={() => handleModeClick(mode)}
                className="relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
              >
                <h3 className="text-lg font-bold text-white/90">{mode.name}</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4 leading-snug">{mode.description}</p>
                <div className="text-blue-500 font-mono font-bold tracking-[0.2em] text-sm">
                  {mode.id === 'box' ? '4-4-4-4' : mode.id === '478' ? '4-7-8' : mode.id === 'deep' ? '5-5' : '3-6'}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;