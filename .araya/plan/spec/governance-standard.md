---
name: araya-governance-standard
description: "ARAYA Enterprise Execution Governance Standard — mandatory 5-phase delivery pipeline with requirement preservation, traceability, cross-audit, and controlled merge"
---

# ARAYA Enterprise Execution Governance Standard

## Principle

**Implementation never starts directly from conversational requests.**

Every major capability must flow through:
```
Requirement → SDD → BDD → TDD → Dependency Analysis → Resource Assignment → Implementation → Cross-Audit → Controlled Merge
```

## Governance Tiers

| Tier | Mode | Governance Required |
|------|------|-------------------|
| **Full** | `full` | All 5 phases — SDD, BDD, TDD, cross-audit, controlled merge |
| **Standard** | `standard` | Phases 1-3 — SDD/BDD/TDD before implementation, cross-audit optional |
| **Light** | `quick`, `repair` | Minimal — review only. For docs, fixes, config changes |
| **Advisory** | `review` | Analysis only — no implementation |

## Phase 1: Architecture & Requirement Governance

### 1.1 Requirement Preservation (MANDATORY)
Before ANY implementation, the original request must be stored verbatim:
- `.araya/runs/{run_id}/requirements.md` — original request, architectural interpretation, expected behavior, acceptance criteria

### 1.2 SDD (Software Design Document)
Must define: architecture, boundaries, workflows, entities, APIs, permissions, orchestration, environment strategy, deployment strategy, AI strategy, operational lifecycle, integrations, ownership.

Artifact: `.araya/plan/spec/sdd-{feature}.md`

### 1.3 BDD (Behavior-Driven Development)
Must define: user behavior, operational flows, lifecycle transitions, onboarding, exceptions, billing, governance, AI interactions.

Artifact: `.araya/plan/bdd/{feature}.feature`

### 1.4 TDD (Test-Driven Development)
Must define: validations, integration tests, workflow tests, isolation tests, permission tests, UX state tests, AI behavior tests, deployment tests, regression tests.

Artifact: `.araya/plan/tdd/{feature}-tests.md`

### 1.5 Traceability Matrix
Every requirement must trace to BDD scenarios and TDD tests.

Artifact: `.araya/runs/{run_id}/traceability.md`

### 1.6 Dependency Analysis
DAG of affected systems, integration points, and deployment order.

Artifact: `.araya/runs/{run_id}/dependencies.md`

## Phase 2: Controlled Resource Assignment

- Assign agent owners per phase
- Define acceptance criteria per deliverable
- Define integration dependencies
- Capacity check (no agent over-assigned)

Artifact: `.araya/runs/{run_id}/assignments.md`

## Phase 3: Implementation

**ONLY after Phase 1 + 2 artifacts are approved.**

- Execute phase assignments sequentially
- Each agent produces structured output
- Outputs validated against acceptance criteria

## Phase 4: Cross-Audit Validation

Independent review by agents NOT involved in implementation:

| Auditor | Audits |
|---------|--------|
| **Elena** (PM Auditor) | Process compliance, traceability, requirement coverage |
| **Diana** (Security) | Security posture, threat model compliance |
| **Aisha** (Architecture) | Architecture alignment, no drift from SDD |
| **Lidia** (Domain, if applicable) | Domain methodology correctness |

### Delivery vs. Request Comparison
After implementation, compare:
- Requested behavior vs. Delivered behavior
- Missing elements
- Partial implementations
- Architectural deviations
- Technical debt introduced
- Deferred decisions

Artifact: `.araya/runs/{run_id}/audit-report.md`

## Phase 5: Controlled Merge

Only validated features merge. Criteria:
- [ ] All Phase 1 artifacts exist and are approved
- [ ] Phase 2 assignments confirmed by assigned agents
- [ ] Phase 3 structured outputs pass quality gates
- [ ] Phase 4 cross-audit complete with no blocking findings
- [ ] Delivery vs. Request comparison shows no critical gaps
- [ ] The Data Professor approves the merge

## Enforcement

The ARAYA orchestrator enforces:
- `full` mode → ALL 5 phases required, blocks implementation without artifacts
- `standard` mode → Phases 1-3 required, cross-audit recommended
- `quick`/`repair` → Bypass governance (documentation, fixes only)
- `safe-mode` → Plan only, no implementation regardless of mode
