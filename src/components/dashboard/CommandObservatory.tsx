// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';

export default function CommandObservatory() {
  return (
    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-primary/30 rounded-2xl bg-card/50 backdrop-blur-sm text-center p-8">
      <div>
        <h2 className="text-2xl font-headline text-primary mb-2">Command Observatory</h2>
        <p className="text-muted-foreground">
          This area will be transformed into a live, intelligent observatory.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          (Placeholder Component: `src/components/dashboard/CommandObservatory.tsx`)
        </p>
      </div>
    </div>
  );
}
