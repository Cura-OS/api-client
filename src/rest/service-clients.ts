/**
 * Registry of the per-service typed REST clients.
 *
 * Each `@curaos/<service>-sdk` package is generated from that service's
 * TypeSpec REST contract (ADR-0103) via `@hey-api/openapi-ts` +
 * `@hey-api/client-fetch`, and exports its own configured `client` instance
 * plus typed operation functions. This module collects those client instances
 * so the whole REST surface can be pointed at one gateway base URL and share a
 * single auth-token source in one call, instead of every app configuring 12
 * clients by hand.
 *
 * audit-sdk is intentionally absent: it is a NestJS *server* SDK (interceptor +
 * producer), not a browser HTTP client, so it has no place in the frontend
 * data-access layer. auth-sdk is still a stub (no client yet); auth tokens are
 * injected via the `getAuthToken` hook below and will read from
 * `@curaos/auth-sdk` once that package ships its client.
 */
import type { Client } from '@hey-api/client-fetch';

import { client as calendarClient } from '@curaos/calendar-sdk';
import { client as clinicalDocClient } from '@curaos/clinical-doc-sdk';
import { client as encounterClient } from '@curaos/encounter-sdk';
import { client as notifyClient } from '@curaos/notify-sdk';
import { client as ordersClient } from '@curaos/orders-sdk';
import { client as reportsClient } from '@curaos/reports-sdk';
import { client as schedulingClient } from '@curaos/scheduling-sdk';
import { client as searchClient } from '@curaos/search-sdk';
import { client as settingsClient } from '@curaos/settings-sdk';
import { client as storageClient } from '@curaos/storage-sdk';
import { client as tasksClient } from '@curaos/tasks-sdk';
import { client as terminologyClient } from '@curaos/terminology-sdk';

import { resolveApiClientConfig, type ApiClientConfigInput } from '../config';

/** Stable key for each service in the REST registry. */
export type ServiceName =
  | 'calendar'
  | 'clinicalDoc'
  | 'encounter'
  | 'notify'
  | 'orders'
  | 'reports'
  | 'scheduling'
  | 'search'
  | 'settings'
  | 'storage'
  | 'tasks'
  | 'terminology';

/**
 * The hey-api `client` instance exported by each service SDK. The SDKs are
 * generated against `@hey-api/client-fetch` 0.13.x, so they share the exact
 * `Client` runtime type imported here.
 */
export const serviceClients: Readonly<Record<ServiceName, Client>> = {
  calendar: calendarClient as Client,
  clinicalDoc: clinicalDocClient as Client,
  encounter: encounterClient as Client,
  notify: notifyClient as Client,
  orders: ordersClient as Client,
  reports: reportsClient as Client,
  scheduling: schedulingClient as Client,
  search: searchClient as Client,
  settings: settingsClient as Client,
  storage: storageClient as Client,
  tasks: tasksClient as Client,
  terminology: terminologyClient as Client,
};

/**
 * Returns a bearer token for outbound REST calls, or `undefined` when the user
 * is unauthenticated. Resolved per-request by the hey-api `auth` callback, so a
 * single token source covers refresh without re-wiring clients. Wire this to
 * `@curaos/auth-sdk` once that package ships its session reader.
 */
export type AuthTokenProvider = () => string | undefined | Promise<string | undefined>;

/** Options for `configureRestClients`. */
export interface ConfigureRestClientsOptions extends ApiClientConfigInput {
  /**
   * Source of the bearer token injected into every request's `Authorization`
   * header. The hey-api `auth` callback resolves it lazily per request, so a
   * token refresh is picked up without reconfiguring the clients.
   */
  readonly getAuthToken?: AuthTokenProvider;
  /**
   * Extra static headers applied to every service client (for example a
   * tenant header `X-CURA-TENANT` per ADR-0103 section 8). Merged ahead of the
   * per-request auth header.
   */
  readonly headers?: Record<string, string>;
}

/**
 * Points every per-service REST client at the resolved gateway base URL and
 * installs a shared auth-token source plus optional common headers. Call once
 * during app bootstrap (or whenever the token source / tenant changes).
 *
 * Auth uses the hey-api `auth` callback (bearer in the `Authorization` header),
 * which is evaluated on every request, so token rotation needs no re-config.
 */
export function configureRestClients(options: ConfigureRestClientsOptions = {}): void {
  const { restBaseUrl } = resolveApiClientConfig(options);
  const { getAuthToken, headers } = options;

  for (const client of Object.values(serviceClients)) {
    client.setConfig({
      baseUrl: restBaseUrl,
      ...(headers ? { headers } : {}),
      ...(getAuthToken
        ? {
            // hey-api resolves `auth` per request; returning a token makes it a
            // `Bearer` Authorization header per the SDK operation `security`.
            auth: () => getAuthToken(),
          }
        : {}),
    });
  }
}
