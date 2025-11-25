'use client';

import { useRef, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OTPPinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  showToggle?: boolean;
  autoFocus?: boolean;
}

export default function OTPPinInput({
  value,
  onChange,
  length = 6,
  error,
  showToggle = true,
  autoFocus = true,
}: OTPPinInputProps) {
  const [showPin, setShowPin] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) {
      return;
    }

    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('').slice(0, length);
    onChange(updatedValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        if (digits.length > 0) {
          onChange(digits);
          // Focus the last filled input or the last input
          const focusIndex = Math.min(digits.length, length - 1);
          inputRefs.current[focusIndex]?.focus();
        }
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData.length > 0) {
      onChange(pastedData);
      // Focus the last filled input or the last input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 mb-3 px-2">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || '';
          const isFocused = focusedIndex === index;
          
          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold
                bg-white/5 border-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:ring-offset-1 focus:ring-offset-[#1a1a1a]
                transition-all duration-200
                text-white
                flex-shrink-0
                ${error 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : isFocused
                    ? 'border-[#DC2626] bg-white/10 scale-105 shadow-lg shadow-[#DC2626]/20'
                    : 'border-white/20 hover:border-white/30'
                }
              `}
              autoComplete="off"
            />
          );
        })}
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="ml-1 sm:ml-2 p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0 rounded-lg hover:bg-white/5"
            aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
          >
            {showPin ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400 px-2">{error}</p>
      )}
    </div>
  );
}

