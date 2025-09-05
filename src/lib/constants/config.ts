// Centralized configuration constants
// Keep TTLs and other cross-cutting config here to avoid divergence between client and server.

// AI analysis cache TTL (milliseconds)
// Currently aligned to 4 days for both client- and server-side caches
export const AI_ANALYSIS_CACHE_TTL_MS = 4 * 24 * 60 * 60 * 1000;
