# Delivery Health Scoring

## Formula

```
Health Score = validation_coverage × 0.4 + traceability_coverage × 0.4 + lifecycle_completion × 0.2
```

Where:
- **validation_coverage** = passed ACs / total ACs
- **traceability_coverage** = average of REQ→AC, AC→TASK, TASK→EVD coverage
- **lifecycle_completion** = validated + archived changes / total changes

## Scoring Tiers

| Score | Tier | Meaning |
|-------|------|---------|
| 95–100 | 🟢 GREEN | Healthy — all metrics at target |
| 80–94 | 🟡 YELLOW | Warning — some metrics below target |
| 0–79 | 🔴 RED | Critical — multiple metrics failing |

## Interpretation

- **GREEN**: Delivery is on track. All ACs verified. Traceability complete.
- **YELLOW**: Some gaps. Review needed but delivery may proceed with documented deviations.
- **RED**: Significant gaps. Delivery should not proceed until resolved.

## Input Data Sources

All data comes from existing artifacts in `.araya/`:
- `/specs/` and `/changes/` for lifecycle counts
- Acceptance documents for validation coverage
- Traceability chain for coverage metrics
