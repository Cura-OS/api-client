/**
 * @curaos/api-client - unified frontend data-access layer for CuraOS.
 *
 * Two data planes per the foundation ADRs:
 *
 *   REST (primary, ADR-0103 / ADR-0106 section 6): TanStack Query hooks over
 *   the per-service typed SDKs generated from each service's TypeSpec contract.
 *   A shared `QueryClient`, one-call configuration of every SDK client's base
 *   URL + auth-token source, and generic factories that turn any generated SDK
 *   operation into a typed hook.
 *
 *   GraphQL (secondary, ADR-0103 section 5.2 / ADR-0163): an Apollo Client
 *   wired to the WunderGraph Cosmo Router federated supergraph endpoint
 *   (`CURAOS_GRAPHQL_URL`), with `TypedDocumentNode` plumbing and a smoke query.
 *   The federated schema itself is a later phase.
 *
 * See ai/curaos/frontend/packages/api-client for the module CONTEXT + Requirements.
 */

// ---------------------------------------------------------------------------
// Configuration (shared by both data planes)
// ---------------------------------------------------------------------------
export {
  resolveApiClientConfig,
  GRAPHQL_URL_ENV,
  REST_BASE_URL_ENV,
  DEFAULT_REST_BASE_URL,
  DEFAULT_GRAPHQL_URL,
  type ApiClientConfig,
  type ApiClientConfigInput,
} from './config';

// ---------------------------------------------------------------------------
// REST data plane (TanStack Query)
// ---------------------------------------------------------------------------
export {
  createCuraQueryClient,
  defaultQueryClientConfig,
} from './rest/query-client';

export {
  configureRestClients,
  serviceClients,
  type ServiceName,
  type AuthTokenProvider,
  type ConfigureRestClientsOptions,
} from './rest/service-clients';

export {
  createQueryHook,
  createMutationHook,
  type SdkOperation,
  type OperationData,
  type OperationOptions,
  type CuraQueryHookOptions,
  type CuraMutationHookOptions,
} from './rest/hooks';

export {
  calendarHooks,
  clinicalDocHooks,
  encounterHooks,
  notifyHooks,
  ordersHooks,
  reportsHooks,
  schedulingHooks,
  searchHooks,
  settingsHooks,
  storageHooks,
  tasksHooks,
  terminologyHooks,
  // Namespaced full generated REST surface (operations + types) per service.
  calendarSdk,
  clinicalDocSdk,
  encounterSdk,
  notifySdk,
  ordersSdk,
  reportsSdk,
  schedulingSdk,
  searchSdk,
  settingsSdk,
  storageSdk,
  tasksSdk,
  terminologySdk,
} from './rest/services';

export { CuraQueryProvider, type CuraQueryProviderProps } from './rest/provider';

// Re-export the TanStack Query primitives consumers most often need so a basic
// app does not have to add @tanstack/react-query as a direct dependency.
export {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// GraphQL data plane (Apollo Client + Cosmo Router supergraph)
// ---------------------------------------------------------------------------
export {
  createCuraGraphQLClient,
  type CreateGraphQLClientOptions,
} from './graphql/apollo-client';

export {
  CuraGraphQLProvider,
  type CuraGraphQLProviderProps,
} from './graphql/provider';

export {
  SUPERGRAPH_SMOKE_QUERY,
  type SupergraphSmokeQueryData,
  type SupergraphSmokeQueryVariables,
} from './graphql/smoke-query';

// Re-export the Apollo primitives consumers most often need.
export { ApolloClient, InMemoryCache, HttpLink, gql, type TypedDocumentNode } from '@apollo/client';
export {
  ApolloProvider,
  useQuery as useGraphQLQuery,
  useMutation as useGraphQLMutation,
} from '@apollo/client/react';
