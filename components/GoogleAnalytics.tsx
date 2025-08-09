'use client';

import { useEffect } from 'react';
import { initGA } from '@/lib/analytics';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Initialize GA4 when component mounts
    initGA();
  }, []);

  return null; // This component doesn't render anything
}
