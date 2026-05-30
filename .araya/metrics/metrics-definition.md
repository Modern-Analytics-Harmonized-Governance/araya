# Governance Metrics Definitions

## Coverage Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Requirements Coverage** | REQs with linked ACs / Total REQs × 100 | 100% |
| **Acceptance Coverage** | ACs with linked TASKs / Total ACs × 100 | ≥ 90% |
| **Task Coverage** | TASKs with evidence / Total TASKs × 100 | ≥ 90% |
| **Traceability Coverage** | Average of all coverage metrics | ≥ 90% |

## Lifecycle Metrics

Count of changes by lifecycle state:
- Draft, Planned, Approved, Executing, Review, Validated, Archived

## Validation Metrics

| Metric | Source |
|--------|--------|
| Total ACs | Batch 2 acceptance documents |
| Passed / Failed / Pending | Batch 2 validation results |
| Coverage % | Passed / Total × 100 |

## Review Metrics

| Metric | Source |
|--------|--------|
| Deliveries Reviewed | DRR count |
| Open Change Requests | CRs with open status |
| Closed Change Requests | CRs with closed status |

## Delivery Health Score

```
Inputs: validation_coverage × 0.4 + traceability_coverage × 0.4 - orphans × 0.2

GREEN:  ≥ 95
YELLOW: 80–94
RED:    < 80
```
