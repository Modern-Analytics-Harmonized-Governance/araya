---
name: cr-generate
description: "Generate Change Requests (CR) from approved findings, creating new work packages that route back into the SDLC."
---

# CR — Change Request

Convert approved DRR findings into formal Change Requests that become
new work packages. Each CR routes back into the proper SDLC lifecycle.

## What problem this solves

Approved findings without CRs are forgotten. CRs transform feedback into
actionable work packages with traceability to the original delivery.

## When to Use

After IAR is complete and Manu (PO) has approved which findings to address.

## Input

DRR ID, IAR ID, and Manu's approval decisions.

## Steps

1. Filter DRR findings to only those approved by Manu
2. For each approved finding, create a CR with routing instructions
3. Route per finding type:
   - Missing Requirement → SDD → BDD → TDD → Implementation
   - Bug → TDD → Implementation
   - UX/UI → BDD → Implementation
   - Security → Architecture → Security Review → Implementation
   - Performance → TDD → Implementation
   - Documentation → Documentation
4. Set CR status: approved, rejected, deferred, needs_clarification
5. Save to `.araya/reviews/cr/{cr_id}.yaml`

## CR Format

```yaml
cr_id: CR-2026-014
source_drr: DRR-2026-001
source_iar: IAR-2026-001
status: approved
findings:
  - finding_id: DRR-001
    route: SDD → BDD → TDD → Implementation
    work_package: WP-2026-007
impact:
  sdd: true
  bdd: true
  tdd: true
  architecture: false
```

## Expected Output

Structured CR saved to `.araya/reviews/cr/`. Sonia uses CR to create
the next work package and route it back into `/araya run`.

## Done Criteria

- [ ] Only Manu-approved findings converted to CRs
- [ ] Each CR has routing instructions
- [ ] Rejected/deferred findings documented with reason
- [ ] CR saved to `.araya/reviews/cr/`
- [ ] Work package created for execution
