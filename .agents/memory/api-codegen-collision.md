---
name: OpenAPI generator naming collisions
description: A codegen edge case to watch for when combining path and query parameters.
---

Orval can emit a Zod path-parameter schema and a generated TypeScript query-parameter type with the same `<OperationId>Params` export when one operation combines a path parameter with a query parameter. This breaks the shared Zod barrel typecheck.

**Why:** The collision is produced by codegen, not by application code, and is easy to misdiagnose after a successful Orval run.

**How to apply:** Prefer separate endpoints or client-side filtering when a generated operation would combine both parameter shapes; rerun codegen and the libs typecheck after any spec change.