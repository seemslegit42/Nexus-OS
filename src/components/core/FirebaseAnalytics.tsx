// src/components/core/FirebaseAnalytics.tsx
'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase/client'; // This will initialize analytics if not already done
import { usePathname } from 'next/navigation';
import { logEvent } from 'firebase/analytics';

export function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null; // This component does not render anything
}
