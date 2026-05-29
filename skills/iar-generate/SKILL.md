---
name: iar-generate
description: "Generate Impact Analysis Reports (IAR) to determine which project artifacts are affected by delivery review findings."
---

# IAR — Impact Analysis Report

Analyze the impact of each DRR finding on project artifacts. Determine
which requirements, behaviors, tests, architecture, and implementation
are affected — and estimate the effort required.

## What problem this solves

Raw findings don't tell the team what to fix. IAR maps each finding to
affected artifacts so Sonia can route work correctly: missing requirement
→ SDD, bug → TDD, UX issue → BDD, security → architecture review.

## When to Use

After a DRR is created and before generating Change Requests.

## Input

DRR ID and the full project context (SDD, BDD, TDD, architecture).

## Steps

1. Read the DRR and extract all findings
2. For each finding, determine affected artifacts: SDD, BDD, TDD, Architecture, Implementation, UI, Documentation
3. Estimate effort per finding (story points or T-shirt size)
4. Assess risk: critical, high, medium, low
5. Save to `.araya/reviews/iar/{iar_id}.yaml`

## IAR Format

```yaml
iar_id: IAR-2026-001
source_drr: DRR-2026-001
affected:
  - SDD
  - BDD
  - TDD
estimated_effort:
  story_points: 8
risk: medium
findings_analysis:
  - finding_id: DRR-001
    impact: SDD, BDD, TDD
    route: SDD → BDD → TDD → Implementation
    effort: 5 pts
  - finding_id: DRR-002
    impact: BDD, UI
    route: BDD → Implementation
    effort: 3 pts
```

## Expected Output

Structured IAR saved to `.araya/reviews/iar/` with impact analysis per finding.

## Done Criteria

- [ ] Every DRR finding analyzed for impact
- [ ] Affected artifacts identified per finding
- [ ] Effort estimated per finding
- [ ] Risk level assessed
- [ ] IAR saved to `.araya/reviews/iar/`
