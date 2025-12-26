import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phase } from '../types';

interface BreathingOrbProps {
  phase: Phase;
  progress: number;
  isActive: boolean;
  isModeSelected: boolean;
  isOvertime: boolean;
  modeName?: string;
  onClick: () => void;
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({ 
  phase, 
  progress, 
  isActive, 
  isModeSelected, 
  isOvertime,
  modeName,
  onClick 
}) => {
  // --- ГЕОМЕТРИЯ ---
  const size = 400; 
  const center = size / 2;
  const radius = 150; 
  const circumference = 2 * Math.PI * radius;

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ЛИНИИ ---
  const isHoldNow = isActive && phase.text.toLowerCase().includes('задержка');
  
  // showStatic - показывает застывшую полную линию (эхо после задержки)
  const [showStatic, setShowStatic] = useState(false);
  const prevPhaseText = useRef(phase.text);

  useEffect(() => {
    if (!isActive) {
      setShowStatic(false);
      prevPhaseText.current = phase.text; 
      return;
    }

    const currentText = phase.text.toLowerCase();
    const prevText = prevPhaseText.current.toLowerCase();
    
    if (currentText !== prevText) {
      const wasHold = prevText.includes('задержка');
      const isHold = currentText.includes('задержка');

      if (!isHold && wasHold) {
        // Ушли с задержки -> оставляем статичное эхо
        setShowStatic(true);
      } else if (isHold) {
        // Новая задержка -> убираем статику, работает активная линия
        setShowStatic(false);
      } else if (!isHold && !wasHold && showStatic) {
        // Если перешли с выдоха на вдох -> убираем эхо
        setShowStatic(false);
      }
      
      prevPhaseText.current = phase.text;
    }
  }, [phase.text, isActive, showStatic]);

  const currentDashOffset = showStatic 
    ? 0 
    : circumference - (progress * circumference); 

  // Линия видна только на задержке ИЛИ если есть "эхо".
  const isRingVisible = isHoldNow || showStatic;

  // --- МАСШТАБ ШАРА ---
  const currentScale = isActive 
    ? (phase.scale > 1 ? phase.scale * 1.15 : 1) 
    : 1;

  // --- ОБРАБОТКА ТЕКСТА (Перенос слова "ртом") ---
  const formatText = (text: string) => {
    const lower = text.toLowerCase();
    // Принудительно меняем пробел перед "ртом" на перенос строки
    if (lower.includes('ртом')) {
      return lower.replace(' ртом', '\nртом');
    }
    return lower;
  };

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      
      {/* СЛОЙ 0: Клик */}
      <div className="absolute inset-0 z-50 cursor-pointer rounded-full" onClick={onClick} />

      {/* СЛОЙ 1: ДЫШАЩИЙ ШАР */}
      <motion.div
        animate={{
          scale: currentScale,
          opacity: isActive ? 0.9 : 0.6
        }}
        transition={{ 
          duration: isActive ? phase.duration : 0.7, 
          ease: "easeInOut" 
        }}
        className="absolute rounded-full bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.6)]"
        style={{ 
            width: radius * 2, 
            height: radius * 2, 
            mixBlendMode: 'screen' 
        }}
      />

      {/* СЛОЙ 2: ЛИНИЯ ПРОГРЕССА */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="-rotate-90 transform"
        >
          <AnimatePresence>
            {isRingVisible && (
              <motion.circle
                key="smart-ring"
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: 1,
                    strokeDashoffset: currentDashOffset 
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{
                  opacity: { duration: 0.3 },
                  strokeDashoffset: { duration: 0 } 
                }}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#0f172a" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* СЛОЙ 3: ТЕКСТ (С ИСПРАВЛЕННЫМ ПЕРЕНОСОМ) */}
      <div className={`absolute inset-0 z-30 pointer-events-none flex flex-col items-center ${isActive ? 'justify-end pb-24' : 'justify-center'}`}>
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-1"
            >
              {!isModeSelected ? (
                <span className="text-blue-100/70 text-lg font-medium">Выберите режим</span>
              ) : (
                <>
                  <span className="text-white text-xl font-semibold leading-tight mb-2">{modeName}</span>
                  <span className="text-blue-300/60 text-xs animate-pulse lowercase font-medium">нажмите для старта</span>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={phase.text} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col items-center w-full"
            >
              {/* 👇 whitespace-pre-wrap важен для обработки \n */}
              <span className={`text-blue-100/90 text-xl font-medium tracking-wide drop-shadow-md lowercase transition-opacity duration-500 text-center whitespace-pre-wrap leading-tight ${isOvertime ? 'opacity-40' : 'opacity-100'}`}>
                {formatText(phase.text)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* СЛОЙ 4: ОВЕРТАЙМ */}
      <AnimatePresence>
        {isOvertime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
          >
             <span className="text-white text-2xl font-bold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
               Время истекло
             </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BreathingOrb;