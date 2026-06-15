'use client';
/**
 * React provider that wires the shared TanStack Query client and configures the
 * per-service REST clients (base URL + auth token) on mount.
 *
 * Mount once near the app root. Works in React 19 on web (Next) and React
 * Native (Expo) since it only depends on `@tanstack/react-query` + `react`.
 * "use client": uses useState/useMemo, so Next must treat it as a client
 * component even when reached via the package barrel from a server graph.
 */
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';

import { configureRestClients, type ConfigureRestClientsOptions } from './service-clients';
import { createCuraQueryClient } from './query-client';

/** Props for {@link CuraQueryProvider}. */
export interface CuraQueryProviderProps extends ConfigureRestClientsOptions {
  /**
   * Optional pre-built `QueryClient`. Omit to let the provider create one with
   * the CuraOS defaults. Supply your own (e.g. one created in a server
   * component / SSR request scope) to control its lifecycle.
   */
  readonly client?: QueryClient;
  readonly children: ReactNode;
}

/**
 * Provides the CuraOS REST data plane to its subtree: a single `QueryClient`
 * for caching and the per-service SDK clients pointed at the gateway with a
 * shared auth-token source. REST-client configuration is recomputed when the
 * base URL, headers, or token source change.
 */
export function CuraQueryProvider(props: CuraQueryProviderProps): ReactNode {
  const { client, children, restBaseUrl, graphqlUrl, getAuthToken, headers } = props;

  // One QueryClient for the lifetime of the provider unless one is supplied.
  const [fallbackClient] = useState(() => createCuraQueryClient());
  const queryClient = client ?? fallbackClient;

  // Point the SDK clients at the gateway + token source. `useMemo` keeps this
  // a synchronous side-effect-free config call on the relevant deps.
  useMemo(() => {
    configureRestClients({
      ...(restBaseUrl !== undefined ? { restBaseUrl } : {}),
      ...(graphqlUrl !== undefined ? { graphqlUrl } : {}),
      ...(getAuthToken !== undefined ? { getAuthToken } : {}),
      ...(headers !== undefined ? { headers } : {}),
    });
  }, [restBaseUrl, graphqlUrl, getAuthToken, headers]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
