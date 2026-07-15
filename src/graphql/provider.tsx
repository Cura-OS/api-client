'use client';
/**
 * React provider for the CuraOS GraphQL data plane.
 *
 * Wraps Apollo's `ApolloProvider` (from `@apollo/client/react` in Apollo 4.x)
 * and builds a default client pointed at the Cosmo Router supergraph endpoint
 * when one is not supplied. Mount once near the app root, typically alongside
 * `CuraQueryProvider` for the REST plane.
 * "use client": uses useState, so Next must treat it as a client component
 * even when reached via the package barrel from a server graph.
 */
import { ApolloProvider } from '@apollo/client/react';
import { useMemo, type ReactNode } from 'react';

import { createCuraGraphQLClient, type CreateGraphQLClientOptions } from './apollo-client';
import type { ApolloClient } from '@apollo/client';

/** Props for {@link CuraGraphQLProvider}. */
export interface CuraGraphQLProviderProps extends CreateGraphQLClientOptions {
  /**
   * Optional pre-built Apollo Client. Omit to let the provider create one from
   * the resolved endpoint config + auth token source.
   */
  readonly client?: ApolloClient;
  readonly children: ReactNode;
}

/**
 * Provides the Apollo Client for the federated supergraph to its subtree.
 *
 * Auth + tenant are resolved per operation by the client's `SetContextLink`, so
 * a token refresh needs no rebuild. The fallback client is rebuilt only when
 * the endpoint, token source, or tenant headers change identity, so a swapped
 * `getAuthToken` closure or tenant object never leaves a stale client wired up.
 */
export function CuraGraphQLProvider(props: CuraGraphQLProviderProps): ReactNode {
  const { client, children, restBaseUrl, graphqlUrl, getAuthToken, headers } = props;

  const fallbackClient = useMemo(
    () =>
      createCuraGraphQLClient({
        ...(restBaseUrl !== undefined ? { restBaseUrl } : {}),
        ...(graphqlUrl !== undefined ? { graphqlUrl } : {}),
        ...(getAuthToken !== undefined ? { getAuthToken } : {}),
        ...(headers !== undefined ? { headers } : {}),
      }),
    [restBaseUrl, graphqlUrl, getAuthToken, headers],
  );

  return <ApolloProvider client={client ?? fallbackClient}>{children}</ApolloProvider>;
}
