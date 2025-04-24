// Feature flags for controlling application behavior
export const FEATURES = {
  // Set to true to enable proxy support for region-specific access
  ENABLE_PROXY: false,

  // Set to true to enable detailed proxy statistics and monitoring
  ENABLE_PROXY_STATS: false,
};

// Type for feature flags
export type FeatureFlags = typeof FEATURES;

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURES[feature];
}

// Environment-specific overrides
if (import.meta.env.VITE_ENABLE_PROXY === 'true') {
  FEATURES.ENABLE_PROXY = true;
}

if (import.meta.env.VITE_ENABLE_PROXY_STATS === 'true') {
  FEATURES.ENABLE_PROXY_STATS = true;
}
