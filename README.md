<div align="center">


# api-client

**CuraOS unified frontend data-access layer: TanStack Query hooks over the per-service typed REST SDKs (ADR-0103) plus an Apollo Client for the Cosmo Router federated GraphQL supergraph (ADR-0163). React 19.**

Part of the CuraOS (Care Oriented Stack) platform. CuraOS unified frontend data-access layer: TanStack Query hooks over the per-service typed REST SDKs (ADR-0103) plus an Apollo Client for the Cosmo Router federated GraphQL supergraph (ADR-0163). React 19. Domain: neutral.

[![Status](https://img.shields.io/badge/status-public--alpha-informational)](#status)
[![License: BSL-1.1](https://img.shields.io/badge/license-BSL--1.1-yellow)](./LICENSE)
[![Exposure: Source available](https://img.shields.io/badge/exposure-Source--available-yellow)](#license)
[![Module: Package](https://img.shields.io/badge/module-Package-informational)](#how-it-works)

[Why](#why) · [Quick Start](#quick-start) · [Capabilities](#capabilities) · [How it Works](#how-it-works) · [Status](#status) · [Security](#security)

</div>

---

## At a Glance

| Field | Detail |
|---|---|
| Audience | Integrators and platform developers. |
| Homepage | [https://docs.curaos.abualruz.com](https://docs.curaos.abualruz.com) |
| Exposure | Source available |
| License | LicenseRef-CuraOS-BSL |
| Topics | `curaos` `package` `source-available` `integration` `self-hosted`  |

---

## Why

CuraOS unified frontend data-access layer: TanStack Query hooks over the per-service typed REST SDKs (ADR-0103) plus an Apollo Client for the Cosmo Router federated GraphQL supergraph (ADR-0163). React 19.

<!-- curaos:keep -->
<!-- /curaos:keep -->

---

## Quick Start

```bash
bun add @curaos/api-client
```

<!-- curaos:keep -->
<!-- /curaos:keep -->

---

## Capabilities

- turbo run generate succeeds from all specs in specs/; src/generated/ fully type-safe.
- tsc --noEmit passes with zero errors across generated and hand-written code.
- MSW handlers exported from src/msw/; imported and used in at least one app-level test.
- ESM + CJS dual build emitted; package.json exports map resolves both.

<!-- curaos:keep -->
<!-- /curaos:keep -->

---

## Surfaces

- Package surface
- Package ownership boundary

<!-- curaos:keep -->
<!-- /curaos:keep -->

---

## Media

- No media slot approved yet.

<!-- curaos:keep -->
<!-- /curaos:keep -->

---

## How it Works

| Area | Detail |
|---|---|
| Package | `@curaos/api-client` |
| Source | `frontend/packages/api-client` |
| Domain | `neutral` |
| Layer | `package` |
| Exposure | Source available |

- Source path: `frontend/packages/api-client`
- Generated documentation owner: `tools/codegen/src/repo-docs-emit.ts`



---

## API and Usage

See [docs.curaos.abualruz.com](https://docs.curaos.abualruz.com) (interim).

See [API reference](./src/index.ts) or generated TypeDoc.



---

## Status

public alpha

- Docs generated from `tools/codegen/src/repo-docs-emit.ts`.
- Public documentation: [docs.curaos.abualruz.com](https://docs.curaos.abualruz.com).

---

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting policy.

Public source is limited to integration edges and generated contract/client surfaces.

Private material stays out of this README:

- Generator templates
- Internal deployment automation
- Tenant operations data
- Roadmap and pricing internals

---

## Maintainers

- CuraOS Team - [GitHub](https://github.com/Cura-OS)

---

## Contributing

Contributions are handled through the repository maintainers. Public contribution guidelines are emitted for open and source-available repositories.

By contributing, you agree that your contributions will be licensed under the same license as this project.

---

## License

LicenseRef-CuraOS-BSL - CuraOS (Care Oriented Stack). See [LICENSE](./LICENSE) for details.
