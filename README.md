# @curaos/api-client

Unified frontend data-access layer for CuraOS. Two data planes:

- **REST (primary)** - TanStack Query hooks over the per-service typed SDKs
  (`@curaos/<service>-sdk`) generated from each service's TypeSpec contract
  (ADR-0103). One shared `QueryClient`, one-call base-URL + auth-token wiring
  for every SDK client, and generic factories that turn any generated operation
  into a typed hook.
- **GraphQL (secondary)** - an Apollo Client wired to the WunderGraph Cosmo
  Router federated supergraph endpoint (ADR-0103 section 5.2 / ADR-0163),
  configurable via `CURAOS_GRAPHQL_URL`. Ships the client + `TypedDocumentNode`
  plumbing + a smoke query; the federated schema is a later phase.

React 19. Works on web (Next) and React Native (Expo) per ADR-0106.

Agent docs (CONTEXT + Requirements) live at
`ai/curaos/frontend/packages/api-client/`.

## Quick start

```tsx
import {
  CuraQueryProvider,
  CuraGraphQLProvider,
  calendarHooks,
} from '@curaos/api-client';

function Root({ children }: { children: React.ReactNode }) {
  return (
    <CuraQueryProvider
      restBaseUrl={process.env.CURAOS_API_BASE_URL}
      getAuthToken={() => session.accessToken}
    >
      <CuraGraphQLProvider graphqlUrl={process.env.CURAOS_GRAPHQL_URL}>
        {children}
      </CuraGraphQLProvider>
    </CuraQueryProvider>
  );
}

function CalendarHealth() {
  const { data, isLoading } = calendarHooks.useHealth({});
  return isLoading ? <span>...</span> : <span>{data?.status}</span>;
}
```

## Build

```bash
bun install
bun run build
bun run typecheck
```
