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
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

import { resolveApiClientConfig, type ApiClientConfigInput } from '../config';

/** Options for {@link createCuraGraphQLClient}. */
export interface CreateGraphQLClientOptions extends ApiClientConfigInput {
  /**
   * Returns a bearer token for the `Authorization` header, or `undefined` when
   * unauthenticated. May be sync or async. Resolved per-operation so token
   * rotation, login, and logout are picked up without rebuilding the client.
   * Wire to `@curaos/auth-sdk` when available.
   */
  readonly getAuthToken?: () => string | undefined | Promise<string | undefined>;
  /**
   * Extra headers sent with every GraphQL request (for example a tenant header
   * `X-CURA-TENANT` per ADR-0103 section 8). Read per-operation, so passing a
   * fresh object rebinds the tenant without rebuilding the client.
   */
  readonly headers?: Record<string, string>;
}

/**
 * Creates the Apollo Client pointed at the Cosmo Router supergraph endpoint.
 *
 * Auth + tenant headers are resolved PER OPERATION by a `SetContextLink`
 * chained before the terminating `HttpLink`: the setter calls `getAuthToken()`
 * (sync or async) and reads `headers` at request time, so a refreshed token, a
 * login, or a logout on the same client instance is reflected on the next
 * request. No user's bearer or tenant is ever baked into the client.
 */
export function createCuraGraphQLClient(options: CreateGraphQLClientOptions = {}): ApolloClient {
  const { graphqlUrl } = resolveApiClientConfig(options);
  const { getAuthToken, headers } = options;

  const authLink = new SetContextLink(async (prevContext) => {
    const token = getAuthToken ? await getAuthToken() : undefined;
    return {
      headers: {
        ...headers,
        ...(prevContext.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const httpLink = new HttpLink({ uri: graphqlUrl });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
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
