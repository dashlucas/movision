'use client';

import { useEffect } from 'react';

export default function JogoPage() {
  useEffect(() => {
    document.body.classList.add('bg-black');
    document.documentElement.classList.add('bg-black');

    return () => {
      document.body.classList.remove('bg-black');
      document.documentElement.classList.remove('bg-black');
    };
  }, []);

  return <main className="min-h-screen w-screen bg-black"></main>;
}
