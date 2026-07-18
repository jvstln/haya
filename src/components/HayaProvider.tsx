'use client';

import { useEffect } from 'react';
import haya from '@tryhaya/analytics';

export function HayaProvider() {
  useEffect(() => {
    haya.init('2f6b1ace-2777-45da-bb8c-c9214994d3b4', {
      sessionReplay: true,
      heatmaps: true,
      autoTrack: { clicks: true, scrolls: true, pageviews: true },
      maskInputs: true,
    });
  }, []);

  return null;
}