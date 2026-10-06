'use client';

import React from 'react';
import { QuickMatchScorer } from '@/components/admin/QuickMatchScorer';

export default function MesaControlPage() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      <QuickMatchScorer />
    </div>
  );
}
