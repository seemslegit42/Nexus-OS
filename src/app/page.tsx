// src/app/page.tsx
'use client';
import CommandObservatory from '@/components/dashboard/CommandObservatory'; // Ensure this path is correct

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full p-2 md:p-4 gap-4 items-center justify-center">
      {/* The CommandObservatory should ideally handle its own full-page layout if needed,
          or this parent div can provide basic centering.
          Forcing it to be the sole focus as requested. */}
      <CommandObservatory />
    </div>
  );
}
