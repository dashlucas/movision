import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Movision Logo"
      className={cn('h-16 w-16', className)}
      {...props}
    >
      <path
        d="M10 90 L30 40 L50 70 L70 20 L90 90"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
