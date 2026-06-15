/**
 * Apollo Client for the CuraOS federated GraphQL supergraph.
 *
 * Per ADR-0103 section 5.2 + ADR-0163, GraphQL is the federation-friendly
 * secondary protocol: per-service `@nestjs/graphql` Apollo subgraphs are
 * composed by a self-hosted WunderGraph Cosmo Router (Apache-2.0) into one
 * supergraph. The supergraph schema is a later phase, so this module ships the
 * client wiring against a configurable endpoint (`CURAOS_GRAPHQL_URL`), not the
 * full federated schema.
 *
 * Apollo Client 4.x import paths: `ApolloClient`, `InMemoryCache`, `HttpLink`
 * come from the `@apollo/client` root; React bindings live under
 * `@apollo/client/react`.
 */
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { resolveApiClientConfig, type ApiClientConfigInput } from '../config';

/** Options for {@link createCuraGraphQLClient}. */
export interface CreateGraphQLClientOptions extends ApiClientConfigInput {
  /**
   * Returns a bearer token for the `Authorization` header, or `undefined` when
   * unauthenticated. Resolved per-operation so token rotation is picked up
   * without rebuilding the client. Wire to `@curaos/auth-sdk` when available.
   */
  readonly getAuthToken?: () => string | undefined;
  /**
   * Extra static headers sent with every GraphQL request (for example a tenant
   * header `X-CURA-TENANT` per ADR-0103 section 8).
   */
  readonly headers?: Record<string, string>;
}

/**
 * Creates the Apollo Client pointed at the Cosmo Router supergraph endpoint.
 *
 * Auth + tenant headers are injected via the `HttpLink` `headers` callback,
 * which Apollo evaluates per request, so a refreshed token flows through
 * without re-instantiating the client.
 */
export function createCuraGraphQLClient(
  options: CreateGraphQLClientOptions = {},
): ApolloClient {
  const { graphqlUrl } = resolveApiClientConfig(options);
  const { getAuthToken, headers } = options;

  const requestHeaders: Record<string, string> = { ...headers };
  if (getAuthToken) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const httpLink = new HttpLink({
    uri: graphqlUrl,
    headers: requestHeaders,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    // Apollo 4 client-awareness: name + version travel as
    // `apollographql-client-*` headers, which Cosmo / Apollo Studio use to
    // attribute supergraph traffic to this client (ADR-0103 section 5.2).
    clientAwareness: {
      name: 'curaos-api-client',
      version: '0.1.0',
    },
  });
}
