'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X, Coffee, Brain } from 'lucide-react';

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setTimerMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            // Play notification or switch mode
            if (mode === 'work') {
              setTimerMode('break');
            } else {
              setTimerMode('work');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  return (
    <div className="relative">
      {/* Topbar Timer Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
          isRunning
            ? 'bg-primary/10 text-primary border-primary/30 shadow-sm animate-pulse'
            : 'bg-muted/50 text-muted-foreground hover:text-foreground border-border/50 hover:bg-accent'
        }`}
        title="Pomodoro Focus Timer"
      >
        <Timer className="w-4 h-4 text-primary" />
        <span>{formatTime(timeLeft)}</span>
      </button>

      {/* Floating Attached Popover */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-card border rounded-xl shadow-2xl z-50 p-3.5 space-y-3 animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              {mode === 'work' ? (
                <>
                  <Brain className="w-4 h-4 text-primary" />
                  <span>Deep Focus</span>
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4 text-emerald-500" />
                  <span>Short Break</span>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTimerMode('work')}
              className={`py-1 rounded-md transition-colors ${
                mode === 'work' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => setTimerMode('break')}
              className={`py-1 rounded-md transition-colors ${
                mode === 'break' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              5m Break
            </button>
          </div>

          {/* Time Display */}
          <div className="text-center py-2">
            <span className="text-3xl font-mono font-bold tracking-tight text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isRunning
                  ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Start
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-2 rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
