/**
 * Per-service typed TanStack Query hooks built from the generated SDK operation
 * functions via the `createQueryHook` / `createMutationHook` factories.
 *
 * Every service exposes the shared probe surface its TypeSpec contract defines
 * (`*Health`, `*ProtectedProbe`, `*ProtectedWrite`) plus its service-specific
 * read operation. Hooks are grouped under a per-service namespace object
 * (`calendarHooks`, `ordersHooks`, ...) so consumers get
 * `calendarHooks.useHealth()` with full type inference and a service-namespaced
 * query cache. The complete generated operation + type surface of each SDK is
 * also re-exported (namespaced) from the package barrel for callers that need
 * an operation no convenience hook covers yet.
 */
import * as calendarSdk from '@curaos/calendar-sdk';
import * as clinicalDocSdk from '@curaos/clinical-doc-sdk';
import * as encounterSdk from '@curaos/encounter-sdk';
import * as notifySdk from '@curaos/notify-sdk';
import * as ordersSdk from '@curaos/orders-sdk';
import * as reportsSdk from '@curaos/reports-sdk';
import * as schedulingSdk from '@curaos/scheduling-sdk';
import * as searchSdk from '@curaos/search-sdk';
import * as settingsSdk from '@curaos/settings-sdk';
import * as storageSdk from '@curaos/storage-sdk';
import * as tasksSdk from '@curaos/tasks-sdk';
import * as terminologySdk from '@curaos/terminology-sdk';

import { createMutationHook, createQueryHook, type SdkOperation } from './hooks';

/**
 * A generated hey-api operation function as authored: a single required
 * options argument plus a promise return whose `data` field is the response
 * body. The generated functions are additionally generic over
 * `throwOnError extends boolean`; we always call them with `throwOnError: true`,
 * so the `data` field is present and unwrapped.
 */
type HeyApiOperation = (options: never) => Promise<unknown>;

/** Request options accepted by a generated operation (its first parameter). */
type RequestOptionsOf<TFn extends HeyApiOperation> = Parameters<TFn>[0];

/**
 * Response body of a generated operation: the `data` field of its resolved
 * `{ data, request, response }` envelope (the `throwOnError: true` branch).
 */
type ResponseDataOf<TFn extends HeyApiOperation> =
  Awaited<ReturnType<TFn>> extends { data: infer TData } ? TData : never;

/**
 * Narrows a generated operation to the `SdkOperation` shape the hook factories
 * consume, preserving its request-options and response-body inference. The cast
 * is sound: every per-service SDK is generated against the same
 * `@hey-api/client-fetch` runtime, and we always invoke with `throwOnError: true`.
 */
function op<TFn extends HeyApiOperation>(
  fn: TFn,
): SdkOperation<RequestOptionsOf<TFn> & object, ResponseDataOf<TFn>> {
  return fn as unknown as SdkOperation<RequestOptionsOf<TFn> & object, ResponseDataOf<TFn>>;
}

export const calendarHooks = {
  useHealth: createQueryHook('calendar', 'calendarsHealth', op(calendarSdk.calendarsHealth)),
  useProtectedProbe: createQueryHook(
    'calendar',
    'calendarsProtectedProbe',
    op(calendarSdk.calendarsProtectedProbe),
  ),
  useRead: createQueryHook('calendar', 'calendarsRead', op(calendarSdk.calendarsRead)),
  useProtectedWrite: createMutationHook(op(calendarSdk.calendarsProtectedWrite)),
} as const;

export const clinicalDocHooks = {
  useHealth: createQueryHook(
    'clinicalDoc',
    'clinicalDocsHealth',
    op(clinicalDocSdk.clinicalDocsHealth),
  ),
  useProtectedProbe: createQueryHook(
    'clinicalDoc',
    'clinicalDocsProtectedProbe',
    op(clinicalDocSdk.clinicalDocsProtectedProbe),
  ),
  useWhoami: createQueryHook(
    'clinicalDoc',
    'clinicalDocsWhoami',
    op(clinicalDocSdk.clinicalDocsWhoami),
  ),
  useProtectedWrite: createMutationHook(op(clinicalDocSdk.clinicalDocsProtectedWrite)),
} as const;

export const encounterHooks = {
  useHealth: createQueryHook('encounter', 'encountersHealth', op(encounterSdk.encountersHealth)),
  useProtectedProbe: createQueryHook(
    'encounter',
    'encountersProtectedProbe',
    op(encounterSdk.encountersProtectedProbe),
  ),
  useWhoami: createQueryHook('encounter', 'encountersWhoami', op(encounterSdk.encountersWhoami)),
  useProtectedWrite: createMutationHook(op(encounterSdk.encountersProtectedWrite)),
} as const;

export const notifyHooks = {
  useHealth: createQueryHook('notify', 'notifysHealth', op(notifySdk.notifysHealth)),
  useProtectedProbe: createQueryHook(
    'notify',
    'notifysProtectedProbe',
    op(notifySdk.notifysProtectedProbe),
  ),
  useRead: createQueryHook('notify', 'notifysRead', op(notifySdk.notifysRead)),
  useProtectedWrite: createMutationHook(op(notifySdk.notifysProtectedWrite)),
} as const;

export const ordersHooks = {
  useHealth: createQueryHook('orders', 'ordersHealth', op(ordersSdk.ordersHealth)),
  useProtectedProbe: createQueryHook(
    'orders',
    'ordersProtectedProbe',
    op(ordersSdk.ordersProtectedProbe),
  ),
  useWhoami: createQueryHook('orders', 'ordersWhoami', op(ordersSdk.ordersWhoami)),
  useProtectedWrite: createMutationHook(op(ordersSdk.ordersProtectedWrite)),
} as const;

export const reportsHooks = {
  useHealth: createQueryHook('reports', 'reportsHealth', op(reportsSdk.reportsHealth)),
  useProtectedProbe: createQueryHook(
    'reports',
    'reportsProtectedProbe',
    op(reportsSdk.reportsProtectedProbe),
  ),
  useRead: createQueryHook('reports', 'reportsRead', op(reportsSdk.reportsRead)),
  useProtectedWrite: createMutationHook(op(reportsSdk.reportsProtectedWrite)),
} as const;

export const schedulingHooks = {
  useHealth: createQueryHook(
    'scheduling',
    'schedulingsHealth',
    op(schedulingSdk.schedulingsHealth),
  ),
  useProtectedProbe: createQueryHook(
    'scheduling',
    'schedulingsProtectedProbe',
    op(schedulingSdk.schedulingsProtectedProbe),
  ),
  useWhoami: createQueryHook(
    'scheduling',
    'schedulingsWhoami',
    op(schedulingSdk.schedulingsWhoami),
  ),
  useProtectedWrite: createMutationHook(op(schedulingSdk.schedulingsProtectedWrite)),
} as const;

export const searchHooks = {
  useHealth: createQueryHook('search', 'searchsHealth', op(searchSdk.searchsHealth)),
  useProtectedProbe: createQueryHook(
    'search',
    'searchsProtectedProbe',
    op(searchSdk.searchsProtectedProbe),
  ),
  useRead: createQueryHook('search', 'searchsRead', op(searchSdk.searchsRead)),
  useProtectedWrite: createMutationHook(op(searchSdk.searchsProtectedWrite)),
} as const;

export const settingsHooks = {
  useHealth: createQueryHook('settings', 'settingsHealth', op(settingsSdk.settingsHealth)),
  useProtectedProbe: createQueryHook(
    'settings',
    'settingsProtectedProbe',
    op(settingsSdk.settingsProtectedProbe),
  ),
  useRead: createQueryHook('settings', 'settingsRead', op(settingsSdk.settingsRead)),
  useProtectedWrite: createMutationHook(op(settingsSdk.settingsProtectedWrite)),
} as const;

export const storageHooks = {
  useHealth: createQueryHook('storage', 'storagesHealth', op(storageSdk.storagesHealth)),
  useProtectedProbe: createQueryHook(
    'storage',
    'storagesProtectedProbe',
    op(storageSdk.storagesProtectedProbe),
  ),
  useRead: createQueryHook('storage', 'storagesRead', op(storageSdk.storagesRead)),
  useProtectedWrite: createMutationHook(op(storageSdk.storagesProtectedWrite)),
} as const;

export const tasksHooks = {
  useHealth: createQueryHook('tasks', 'tasksHealth', op(tasksSdk.tasksHealth)),
  useProtectedProbe: createQueryHook(
    'tasks',
    'tasksProtectedProbe',
    op(tasksSdk.tasksProtectedProbe),
  ),
  useRead: createQueryHook('tasks', 'tasksRead', op(tasksSdk.tasksRead)),
  useProtectedWrite: createMutationHook(op(tasksSdk.tasksProtectedWrite)),
} as const;

export const terminologyHooks = {
  useHealth: createQueryHook(
    'terminology',
    'terminologiesHealth',
    op(terminologySdk.terminologiesHealth),
  ),
  useProtectedProbe: createQueryHook(
    'terminology',
    'terminologiesProtectedProbe',
    op(terminologySdk.terminologiesProtectedProbe),
  ),
  useWhoami: createQueryHook(
    'terminology',
    'terminologiesWhoami',
    op(terminologySdk.terminologiesWhoami),
  ),
  useProtectedWrite: createMutationHook(op(terminologySdk.terminologiesProtectedWrite)),
  // Service-specific FHIR terminology operations.
  useExpand: createQueryHook(
    'terminology',
    'fhirTerminologyExpand',
    op(terminologySdk.fhirTerminologyExpand),
  ),
  useLookup: createQueryHook(
    'terminology',
    'fhirTerminologyLookup',
    op(terminologySdk.fhirTerminologyLookup),
  ),
  useValidateCode: createQueryHook(
    'terminology',
    'fhirTerminologyValidateCode',
    op(terminologySdk.fhirTerminologyValidateCode),
  ),
  useTranslate: createMutationHook(op(terminologySdk.fhirTerminologyTranslate)),
  useAssistSuggest: createMutationHook(op(terminologySdk.terminologyAssistSuggest)),
} as const;

/**
 * Full generated REST surface of every service SDK, re-exported namespaced for
 * callers that need a typed operation or request/response type not yet wrapped
 * in a convenience hook above. Wrap those with `createQueryHook` /
 * `createMutationHook` in the consuming app, and fold the wrapper back here when
 * it stabilizes (generator-evolution rule).
 */
export {
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
};
