'use client';

import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export function OrientationLock() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Using screen.orientation.type is more direct than matchMedia for some cases
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.startsWith('portrait'));
      } else {
        // Fallback for older browsers
        const isPortraitQuery = window.matchMedia('(orientation: portrait)');
        setIsPortrait(isPortraitQuery.matches);
      }
    };

    // Initial check
    checkOrientation();

    // Listen for changes
    window.addEventListener('orientationchange', checkOrientation);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }


    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
       if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  if (!isPortrait) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-white text-black md:hidden">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="animate-pulse">
          <Smartphone className="h-24 w-24 -rotate-90" />
        </div>
        <h2 className="text-2xl font-bold">Vire o seu dispositivo</h2>
        <p className="max-w-xs text-zinc-600">
          Esta aplicação foi projetada para ser usada no modo paisagem
          (horizontal).
        </p>
      </div>
    </div>
  );
}
