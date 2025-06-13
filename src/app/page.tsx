// src/app/page.tsx
'use client';

import React from 'react';
import CommandObservatory from '@/components/dashboard/CommandObservatory';

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-0 h-full"> {/* p-0 to allow observatory to control its own padding */}
      <CommandObservatory />
    </div>
  );
}
