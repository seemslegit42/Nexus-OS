// src/app/page.tsx
'use client';

import CommandObservatory from '@/components/dashboard/CommandObservatory';

export default function HomePage() {
  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      <CommandObservatory />
    </div>
  );
}
