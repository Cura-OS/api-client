/**
 * React provider for the CuraOS GraphQL data plane.
 *
 * Wraps Apollo's `ApolloProvider` (from `@apollo/client/react` in Apollo 4.x)
 * and builds a default client pointed at the Cosmo Router supergraph endpoint
 * when one is not supplied. Mount once near the app root, typically alongside
 * `CuraQueryProvider` for the REST plane.
 */
import { ApolloProvider } from '@apollo/client/react';
import { useState, type ReactNode } from 'react';

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
 * Provides the Apollo Client for the federated supergraph to its subtree. The
 * client is created once for the provider's lifetime unless one is supplied.
 */
export function CuraGraphQLProvider(props: CuraGraphQLProviderProps): ReactNode {
  const { client, children, restBaseUrl, graphqlUrl, getAuthToken, headers } = props;

  const [fallbackClient] = useState(() =>
    createCuraGraphQLClient({
      ...(restBaseUrl !== undefined ? { restBaseUrl } : {}),
      ...(graphqlUrl !== undefined ? { graphqlUrl } : {}),
      ...(getAuthToken !== undefined ? { getAuthToken } : {}),
      ...(headers !== undefined ? { headers } : {}),
    }),
  );

  return <ApolloProvider client={client ?? fallbackClient}>{children}</ApolloProvider>;
}
