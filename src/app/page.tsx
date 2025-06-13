// src/app/page.tsx (Dashboard)
'use client';

import React from 'react';
import CommandObservatory from '@/components/dashboard/CommandObservatory'; // Assuming this is the correct path

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-3 md:p-4 h-full">
      {/* The CommandObservatory component is expected to handle its own sizing and presentation.
          The max-w-4xl and mx-auto within CommandObservatory will center it.
          The h-full on this div helps ensure CommandObservatory can expand if it wants to take full height.
      */}
      <CommandObservatory />
    </div>
  );
}
