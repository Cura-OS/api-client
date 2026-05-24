# api_client

> **Status:** clean slate, awaiting Codegen scaffold per ADR-0153.

This service is part of CuraOS — a composable, self-hosted, multi-tenant platform.

## Cluster

ADR-0209 (Frontend packages + Backend libs cluster) + ADR-0106 (Frontend stack)

## Stack baseline

All foundation services use **NestJS (TypeScript)** per [ADR-0100 Foundation Platform Runtime](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0100-foundation-platform-runtime.md). Service-specific overrides documented in cluster ADR above.

Cross-cutting:
- Data: PostgreSQL 17 + Valkey + SeaweedFS + OpenSearch per [ADR-0101](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0101-data-layer.md)
- Events: Kafka 4 / NATS JetStream + Apicurio per [ADR-0102](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0102-event-messaging.md)
- API: TypeSpec → REST + GraphQL + gRPC/Connect-RPC per [ADR-0103](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0103-api-surface.md)
- Auth: CuraOS Auth (Better Auth + SimpleWebAuthn + SAML + SMART-on-FHIR) per [ADR-0120](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0120-foundation-auth.md)
- Workflow: Temporal + Activepieces + cron per [ADR-0122](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0122-foundation-workflow-manager.md)
- Plugin/sidecar/interceptor: WASM + NestJS sidecar + isolated-vm per [ADR-0123](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0123-foundation-codegen-plugin.md)
- Tenancy: `@curaos/tenancy` per [ADR-0155](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0155-tenant-routing-curaos-tenancy.md)
- Auth tokens: JWT + opaque + mTLS per [ADR-0156](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0156-auth-token-flow-jwt-opaque-mtls.md)

## How to scaffold this service

This service is scaffolded via the **CuraOS Codegen Platform** (per [ADR-0123](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0123-foundation-codegen-plugin.md) + [ADR-0153](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace/blob/main/ai/curaos/docs/adr/0153-codegen-recipe-coverage.md)) using the appropriate cookbook recipe:

```bash
# from CuraOS workspace root
curaos-codegen generate \
  --recipe backend.nestjs-service \
  --service api_client \
  --spec ./ai/curaos/frontend/curaos-apps/packages/cura_os/api_client/spec.tsp \
  --output ./
```

(Recipe details TBD per Codegen Engine v0 release.)

## Companion ai/dev docs

Agent-facing artifacts (Requirements, CONTEXT, AGENTS) live in the workspace mirror at:

```
curaos-ai-workspace/ai/curaos/frontend/curaos-apps/packages/cura_os/api_client/
```

## Workspace

Parent workspace: [Cura-Care-Oriented-Stack/curaos-ai-workspace](https://github.com/Cura-Care-Oriented-Stack/curaos-ai-workspace)

Parent monorepo: [Cura-Care-Oriented-Stack/curaos](https://github.com/Cura-Care-Oriented-Stack/curaos)
