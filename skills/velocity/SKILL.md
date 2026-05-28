---
name: velocity
description: "Track, analyze, and forecast team velocity — the amount of work completed per"
---
---

# Velocity

Track, analyze, and forecast team velocity — the amount of work completed per
sprint — using historical data to predict future capacity and identify
improvement opportunities.

## What problem this solves
Without velocity tracking, sprint commitments are guesses, stakeholders ask
"when will it be done?" with no data-driven answer, and process improvements
can't be measured. Velocity turns historical performance into reliable forecasts
and evidence for process change.

## When to use
At sprint boundaries. When forecasting project completion. When stakeholders
ask for timelines. When evaluating whether process changes are working.

## Input
Sprint history: committed points, completed points, carry-over, team composition.

## Output
```markdown
# Velocity Report — Q1-Q2 2026

## Sprint Velocity History
| Sprint | Dates | Committed | Completed | Carry-Over | Completion % | Team Size |
|--------|-------|-----------|-----------|------------|-------------|-----------|
| Sprint 1 | Apr 1-14 | 40 | 32 | 8 | 80% | 5 |
| Sprint 2 | Apr 15-28 | 48 | 44 | 4 | 92% | 6 |
| Sprint 3 | Apr 29 - May 12 | 52 | 50 | 2 | 96% | 6 |
| Sprint 4 | May 13-26 | 55 | 48 | 7 | 87% | 6 |
| Sprint 5 | May 27 - Jun 9 | 53 | 50 | 3 | 94% | 6 |
| Sprint 6 | Jun 10-23 | 58 | 56 | 2 | 97% | 7 |

## Velocity Metrics
| Metric | Value | Trend |
|--------|-------|-------|
| **Average Velocity** | 46.7 pts/sprint | ⬆️ 10% improvement over 6 sprints |
| **Rolling 3-Sprint Avg** | 51.3 pts | ⬆️ Stabilizing |
| **Completion Rate** | 91% | ⬆️ From 80% to 97% |
| **Carry-Over Rate** | 9% | ⬇️ From 20% to 3% |
| **Std Deviation** | 8.1 pts | ➡️ Moderate variability |

## Velocity Chart
```
60 ┤                                    ●
55 ┤                        ●     ●
50 ┤                  ●           ●
45 ┤            ●
40 ┤      ●
35 ┤
30 ┤ ●
   └─────┬─────┬─────┬─────┬─────┬─────
     S1    S2    S3    S4    S5    S6
```

## Forecast: User Management v2.0
- **Remaining backlog:** 210 story points
- **Forecasted velocity:** 51 pts/sprint (rolling 3-sprint avg)
- **Confidence range:** 43-59 pts (avg ± 1 std dev)
- **Estimated sprints:** 4-5 sprints
- **Estimated completion:** Jul 21 — Aug 4, 2026

## What Changed Velocity?
| Change | Sprint | Impact |
|--------|--------|--------|
| Added Diana (Security) | Sprint 2 | +12 pts capacity, -30% review time |
| CI/CD pipeline improvement | Sprint 3 | +5% fewer rework cycles |
| "No Meeting Wednesday" experiment | Sprint 4 | -7% (negative! Distracted by async coordination) |
| Reverted "No Meeting Wednesday" | Sprint 5 | +4% recovery |
| Added Bernabé (Data Engineer) | Sprint 6 | +8 pts capacity |

## Recommendations
1. **Forecast with rolling average, not max velocity** — 51 pts is reliable; 58 pts is aspirational
2. **"No Meeting Wednesday" experiment failed** — don't repeat without team buy-in
3. **Adding specialists (security, data) improved velocity** — consider adding frontend specialist
4. **Completion rate at 97%** — team is accurately estimating; can reduce buffer from 30% to 20%
5. **Watch for plateau** — velocity growth is slowing; may need process change, not more people
```

## Steps
1. Collect sprint data: committed points, completed points, carry-over, blockers, team changes
2. Calculate metrics:
   - Velocity: completed points per sprint
   - Rolling average (3 sprints): smoother, less volatile than single sprint
   - Completion rate: completed / committed
   - Volatility: standard deviation (high = unpredictable)
3. Visualize: velocity chart with trend line, completion rate, carry-over rate
4. Analyze changes: what events correlate with velocity changes? (team size, tools, process)
5. Forecast: use rolling average for future sprint capacity; range = avg ± std dev
6. Recommend: process changes, team adjustments, estimation refinements
7. Write velocity report to `.araya/plan/spec/velocity-report.md`

## Rules
- Use rolling 3-sprint average for forecasting — single sprint velocity is too volatile
- Never use best-case velocity for commitments — use average or conservative (avg - 1 std dev)
- Story points measure effort, not time — velocity normalizes for team-specific estimation
- Changes in velocity must be investigated — is it estimation accuracy or real productivity change?
- Team composition changes reset velocity baselines — new members have a ramp-up period
- Don't compare velocity across teams — points are team-specific, not universal
- Velocity is for the team, not for performance evaluation — weaponized velocity destroys trust
