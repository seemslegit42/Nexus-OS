// src/app/page.tsx
'use client';

import CommandObservatory from '@/components/dashboard/CommandObservatory';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      {/* 
        The CommandObservatory component is designed to be a central, 
        intelligent interface for interacting with NexOS.
        It will eventually provide insights, allow command execution, 
        and display relevant system/agent telemetry.
      */}
      <CommandObservatory />
    </div>
  );
}
