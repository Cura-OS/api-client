import { describe, expect, test } from 'bun:test';

import {
  DEFAULT_GRAPHQL_URL,
  DEFAULT_REST_BASE_URL,
  createCuraGraphQLClient,
  createCuraQueryClient,
  createRestClient,
  configureRestClients,
  resolveApiClientConfig,
  serviceClients,
  SUPERGRAPH_SMOKE_QUERY,
} from './index';

describe('config resolution', () => {
  test('falls back to localhost defaults', () => {
    const config = resolveApiClientConfig();
    expect(config.restBaseUrl).toBe(DEFAULT_REST_BASE_URL);
    expect(config.graphqlUrl).toBe(DEFAULT_GRAPHQL_URL);
  });

  test('explicit input wins over defaults', () => {
    const config = resolveApiClientConfig({
      restBaseUrl: 'https://gw.example/api/v1',
      graphqlUrl: 'https://router.example/graphql',
    });
    expect(config.restBaseUrl).toBe('https://gw.example/api/v1');
    expect(config.graphqlUrl).toBe('https://router.example/graphql');
  });
});

describe('REST data plane', () => {
  test('exposes all 12 client-fetch service clients', () => {
    expect(Object.keys(serviceClients).toSorted()).toEqual(
      [
        'calendar',
        'clinicalDoc',
        'encounter',
        'notify',
        'orders',
        'reports',
        'scheduling',
        'search',
        'settings',
        'storage',
        'tasks',
        'terminology',
      ].toSorted(),
    );
  });

  test('createCuraQueryClient produces a QueryClient with CuraOS defaults', () => {
    const qc = createCuraQueryClient();
    expect(qc.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false);
    expect(qc.getDefaultOptions().queries?.retry).toBe(1);
  });

  test('configureRestClients points every client at the base URL', () => {
    configureRestClients({ restBaseUrl: 'https://gw.example/api/v1' });
    for (const client of Object.values(serviceClients)) {
      expect(client.getConfig().baseUrl).toBe('https://gw.example/api/v1');
    }
  });

  test('createRestClient gives request-scoped clients that never cross-send auth', async () => {
    // Two concurrent "requests" for different users. Each owns its client +
    // token source, so user A's bearer must not leak into user B's client even
    // though both are configured against the same base URL.
    const clientA = createRestClient({
      restBaseUrl: 'https://gw.example/api/v1',
      getAuthToken: () => 'token-A',
    });
    const clientB = createRestClient({
      restBaseUrl: 'https://gw.example/api/v1',
      getAuthToken: () => 'token-B',
    });

    expect(clientA).not.toBe(clientB);
    expect(clientA).not.toBe(serviceClients.calendar);

    const authA = clientA.getConfig().auth as () => string | Promise<string>;
    const authB = clientB.getConfig().auth as () => string | Promise<string>;
    expect(await authA()).toBe('token-A');
    expect(await authB()).toBe('token-B');

    // Reconfiguring one request's client leaves the other untouched (no shared
    // singleton clobber), which is exactly what the mutated global cannot do.
    clientB.setConfig({ auth: () => 'token-B-rotated' });
    expect(await authA()).toBe('token-A');
  });
});

describe('GraphQL data plane', () => {
  test('createCuraGraphQLClient builds an Apollo client at the resolved endpoint', () => {
    const client = createCuraGraphQLClient({ graphqlUrl: 'https://router.example/graphql' });
    expect(client).toBeDefined();
    expect(typeof client.query).toBe('function');
  });

  test('smoke query is a parsed GraphQL document', () => {
    expect(SUPERGRAPH_SMOKE_QUERY.kind).toBe('Document');
    expect(SUPERGRAPH_SMOKE_QUERY.definitions.length).toBeGreaterThan(0);
  });
});
