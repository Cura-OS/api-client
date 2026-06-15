/**
 * Shared TanStack Query client for the CuraOS REST data plane (ADR-0106
 * section 6: "Server state (REST) -> TanStack Query").
 *
 * One `QueryClient` is created per app via `createCuraQueryClient()` so all
 * per-service hooks share a cache, retry policy, and stale-time defaults.
 */
import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

/**
 * Defaults tuned for the CuraOS gateway: a short stale window so dashboards
 * feel live, a single retry (the APISIX gateway already retries idempotent
 * reads), and no refetch-on-focus storm against PHI endpoints. Callers can
 * override any of these by passing their own `QueryClientConfig`.
 */
export const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
};

/**
 * Creates the app-wide `QueryClient`. Pass `config` to override the CuraOS
 * defaults (deep-merged by the caller, not here, to keep this predictable).
 */
export function createCuraQueryClient(config: QueryClientConfig = defaultQueryClientConfig): QueryClient {
  return new QueryClient(config);
}
