/**
 * Runtime configuration for @curaos/api-client.
 *
 * Both data planes (REST per ADR-0103 + GraphQL supergraph per ADR-0163) read
 * their endpoints from configuration so the same package works across the
 * deployment models in workspace AGENTS.md section 4 (cloud SaaS, on-prem,
 * hybrid, air-gap) without a rebuild. Values are resolved in priority order:
 *
 *   1. an explicit value passed to `configureApiClient()`
 *   2. an environment variable (build-time inlined by Next/Metro/Vite, or
 *      `process.env` at runtime on the server)
 *   3. a safe localhost default for local dev
 *
 * REST traffic targets the APISIX gateway base URL; GraphQL targets the Cosmo
 * Router supergraph endpoint. The supergraph schema itself is a later phase
 * (ADR-0103 section 5.2), so `CURAOS_GRAPHQL_URL` stays configurable and the
 * shipped GraphQL surface is the client wiring plus a smoke query, not the
 * full federated schema.
 */

/** Environment variable that overrides the federated GraphQL endpoint. */
export const GRAPHQL_URL_ENV = 'CURAOS_GRAPHQL_URL';

/** Environment variable that overrides the REST gateway base URL. */
export const REST_BASE_URL_ENV = 'CURAOS_API_BASE_URL';

/** Local-dev default for the REST gateway (APISIX) base URL. */
export const DEFAULT_REST_BASE_URL = 'http://localhost:8080/api/v1';

/** Local-dev default for the Cosmo Router supergraph endpoint. */
export const DEFAULT_GRAPHQL_URL = 'http://localhost:4000/graphql';

/**
 * Reads an environment variable in a way that is safe in every JS runtime the
 * frontend stack targets (Next server + browser, React Native/Metro, Astro,
 * Vite). `process` may be undefined in a pure browser bundle, so the access is
 * guarded rather than assumed.
 */
function readEnv(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

/** Resolved, immutable endpoint configuration for both data planes. */
export interface ApiClientConfig {
  /** REST gateway (APISIX) base URL consumed by every per-service SDK client. */
  readonly restBaseUrl: string;
  /** Cosmo Router federated supergraph GraphQL endpoint. */
  readonly graphqlUrl: string;
}

/** Caller-supplied overrides for `configureApiClient()`. All fields optional. */
export interface ApiClientConfigInput {
  readonly restBaseUrl?: string;
  readonly graphqlUrl?: string;
}

/**
 * Resolves the effective configuration from explicit input, then environment,
 * then localhost defaults. Pure: callers decide when to apply it (see
 * `configureRestClients` and `createCuraGraphQLClient`).
 */
export function resolveApiClientConfig(input: ApiClientConfigInput = {}): ApiClientConfig {
  return {
    restBaseUrl: input.restBaseUrl ?? readEnv(REST_BASE_URL_ENV) ?? DEFAULT_REST_BASE_URL,
    graphqlUrl: input.graphqlUrl ?? readEnv(GRAPHQL_URL_ENV) ?? DEFAULT_GRAPHQL_URL,
  };
}
