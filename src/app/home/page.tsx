// src/app/home/page.tsx
'use client';

import React from 'react';
import CommandObservatory from '@/components/dashboard/CommandObservatory';

export default function HomePage() {
  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center p-0">
      {' '}
      {/* p-0 to allow observatory to control its own padding */}
      <CommandObservatory />
    </div>
  );
}
