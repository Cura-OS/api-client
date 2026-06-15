import { describe, expect, test } from 'bun:test';

import {
  DEFAULT_GRAPHQL_URL,
  DEFAULT_REST_BASE_URL,
  createCuraGraphQLClient,
  createCuraQueryClient,
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
