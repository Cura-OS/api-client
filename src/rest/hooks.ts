/**
 * Generic, fully-typed bridge from a `@hey-api/client-fetch` operation function
 * to a TanStack Query hook.
 *
 * The per-service SDKs expose dozens of operation functions whose names and
 * shapes differ per TypeSpec contract (e.g. `calendarsRead`, `ordersWhoami`,
 * `fhirTerminologyExpand`). Rather than hand-write and hand-maintain one hook
 * per operation - which would drift from the generated SDKs and violate the
 * generator-evolution rule - these factories accept any SDK operation function
 * and infer its request options + response type. A service barrel then binds
 * its own operations into ready-to-use hooks with two lines each.
 *
 * Every operation is invoked with `throwOnError: true`, so TanStack Query
 * receives a thrown error (driving `isError`) and the resolved value is the
 * unwrapped response body (the `.data` field), not the hey-api
 * `{ data, error, request, response }` envelope.
 */
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

/**
 * The shape of a generated hey-api operation function. `TOptions` is the
 * operation's request options object (path/query/body/headers); `TData` is the
 * response body. Invoked here with `{ throwOnError: true }`, so it resolves to
 * an envelope whose `data` is `TData`.
 */
export type SdkOperation<TOptions, TData> = (
  options: TOptions & { throwOnError: true },
) => Promise<{ data: TData }>;

/** Extracts the response body type from an `SdkOperation`. */
export type OperationData<TOperation> =
  TOperation extends SdkOperation<infer _TOptions, infer TData> ? TData : never;

/** Extracts the request options type from an `SdkOperation`. */
export type OperationOptions<TOperation> =
  TOperation extends SdkOperation<infer TOptions, infer _TData> ? TOptions : never;

/**
 * TanStack Query options accepted by a generated query hook, minus the parts
 * the factory owns (`queryKey` and `queryFn`).
 */
export type CuraQueryHookOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError, TData, ReadonlyArray<unknown>>,
  'queryKey' | 'queryFn'
>;

/**
 * Builds a typed `useQuery` hook for one read operation.
 *
 * @param service stable service key, used as the first query-key segment so
 *   caches namespace per service and `invalidateQueries({ queryKey: [service] })`
 *   clears one service at a time.
 * @param operationName operation function name, the second query-key segment.
 * @param operation the generated SDK operation function.
 */
export function createQueryHook<TOptions extends object, TData>(
  service: string,
  operationName: string,
  operation: SdkOperation<TOptions, TData>,
) {
  return function useGeneratedQuery(
    requestOptions: TOptions,
    queryOptions?: CuraQueryHookOptions<TData, Error>,
  ): UseQueryResult<TData, Error> {
    return useQuery<TData, Error, TData, ReadonlyArray<unknown>>({
      queryKey: [service, operationName, requestOptions],
      queryFn: async () => {
        const result = await operation({
          ...requestOptions,
          throwOnError: true,
        });
        return result.data;
      },
      ...queryOptions,
    });
  };
}

/**
 * TanStack Query options accepted by a generated mutation hook, minus the
 * `mutationFn` the factory owns.
 */
export type CuraMutationHookOptions<TData, TVariables, TError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

/**
 * Builds a typed `useMutation` hook for one write operation. The mutation
 * variables are the operation's own request options object, so callers pass
 * `{ body, path, ... }` to `mutate()` with full type inference.
 */
export function createMutationHook<TOptions extends object, TData>(
  operation: SdkOperation<TOptions, TData>,
) {
  return function useGeneratedMutation(
    mutationOptions?: CuraMutationHookOptions<TData, TOptions, Error>,
  ): UseMutationResult<TData, Error, TOptions> {
    return useMutation<TData, Error, TOptions>({
      mutationFn: async (variables: TOptions) => {
        const result = await operation({
          ...variables,
          throwOnError: true,
        });
        return result.data;
      },
      ...mutationOptions,
    });
  };
}
