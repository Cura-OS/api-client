/**
 * A typed-document GraphQL smoke query for the federated supergraph.
 *
 * The Cosmo Router supergraph schema is a later phase (ADR-0103 section 5.2),
 * so this package cannot yet ship domain queries. What it ships instead is the
 * `TypedDocumentNode` plumbing - the exact pattern every generated operation
 * will use once `@graphql-codegen` runs against the composed supergraph - plus
 * one query that any spec-compliant endpoint answers, so the wired client can
 * be smoke-tested end to end.
 *
 * The query reads `__typename` on the root query type. It needs no domain
 * schema, so it works against a bare Cosmo Router (or any GraphQL server)
 * before any subgraph is federated. Replace with generated typed documents as
 * the supergraph lands.
 */
import { gql, type TypedDocumentNode } from '@apollo/client';

/** Shape returned by {@link SUPERGRAPH_SMOKE_QUERY}. */
export interface SupergraphSmokeQueryData {
  readonly __typename: string;
}

/** This smoke query takes no variables. */
export type SupergraphSmokeQueryVariables = Record<string, never>;

/**
 * Typed smoke query: `{ __typename }`. Pair with Apollo's `useQuery` (from
 * `@apollo/client/react`) or `client.query()` to verify connectivity to the
 * supergraph endpoint.
 */
export const SUPERGRAPH_SMOKE_QUERY: TypedDocumentNode<
  SupergraphSmokeQueryData,
  SupergraphSmokeQueryVariables
> = gql`
  query SupergraphSmoke {
    __typename
  }
`;
