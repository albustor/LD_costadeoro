'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TierConfig, TierOption } from '@/types/tournament';
import { DEFAULT_ACTIVE_TIER, TIERS_CATALOG } from '@/config/tierConfig';
import { tournamentStorage } from '@/lib/storageAdapter';

interface TierContextType {
  activeTier: TierOption;
  tierConfig: TierConfig;
  setTier: (tier: TierOption) => void;
  isFeatureEnabled: (feature: keyof TierConfig['features']) => boolean;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [activeTier, setActiveTierState] = useState<TierOption>(DEFAULT_ACTIVE_TIER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = tournamentStorage.getTier();
    setActiveTierState(saved);

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<TierOption>;
      if (customEvent.detail) {
        setActiveTierState(customEvent.detail);
      }
    };

    window.addEventListener('tier_changed', handleTierChange);
    return () => window.removeEventListener('tier_changed', handleTierChange);
  }, []);

  const setTier = (tier: TierOption) => {
    setActiveTierState(tier);
    tournamentStorage.setTier(tier);
  };

  const currentConfig = TIERS_CATALOG[activeTier] || TIERS_CATALOG.option3;

  const isFeatureEnabled = (feature: keyof TierConfig['features']): boolean => {
    return !!currentConfig.features[feature];
  };

  return (
    <TierContext.Provider
      value={{
        activeTier,
        tierConfig: currentConfig,
        setTier,
        isFeatureEnabled,
      }}
    >
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}
