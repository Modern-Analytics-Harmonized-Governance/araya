---
name: sprint-planning
description: "Facilitate sprint planning — setting the sprint goal, selecting backlog items,"
---
---

# Sprint Planning

Facilitate sprint planning — setting the sprint goal, selecting backlog items,
estimating effort, and assigning work — aligning the team on what will be
delivered in the next sprint.

## What problem this solves
Without structured sprint planning, teams start sprints without clear goals,
overcommit on scope, and discover mid-sprint that work isn't properly sequenced.
This skill facilitates the planning ceremony that produces a realistic, committed
sprint backlog with clear goals and assignments.

## When to use
At the start of every sprint (every 1-2 weeks). When a project kicks off. When
scope changes significantly mid-sprint and replanning is needed.

## Input
Product backlog, team capacity, previous sprint velocity, dependencies from
`pm-dependencies` output.

## Output
```markdown
# Sprint Plan — Sprint 3
**Dates:** May 27 — June 9, 2026 (2 weeks)
**Team:** Valentina, Teresa, Diana, Isla, Priscila, Bernabé

## Sprint Goal
Deliver User Management API with JWT authentication — users can register,
log in, and manage their profiles via a secure, documented REST API.

## Capacity
| Agent | Available Days | Capacity (pts) | Notes |
|-------|---------------|----------------|-------|
| Valentina | 10 | 20 | Full-time backend |
| Teresa | 10 | 15 | QA + test automation |
| Diana | 8 | 12 | Security reviews (2 days on other project) |
| Isla | 8 | 12 | Infra + CI/CD |
| Priscila | 6 | 9 | Docs (4 days on book chapter) |
| **Total** | — | **68 pts** | |

## Sprint Backlog
| ID | Task | Points | Priority | Agent | Depends On |
|----|------|--------|----------|-------|-----------|
| 1.1 | Design user schema + migration | 3 | P0 | Bernabé | — |
| 1.2 | Implement POST /users | 5 | P0 | Valentina | 1.1 |
| 1.3 | Implement GET /users/:id | 3 | P1 | Valentina | 1.2 |
| 1.4 | Implement auth middleware (JWT) | 8 | P0 | Valentina | 1.2 |
| 1.5 | Implement role-based authorization | 5 | P1 | Valentina | 1.4 |
| 1.6 | Unit tests for user endpoints | 5 | P0 | Teresa | 1.2, 1.3 |
| 1.7 | Integration tests for auth flow | 5 | P1 | Teresa | 1.4 |
| 1.8 | Security review of auth code | 3 | P0 | Diana | 1.4, 1.5 |
| 1.9 | Docker Compose with health checks | 3 | P1 | Isla | — |
| 1.10 | CI/CD pipeline with quality gates | 5 | P1 | Isla | 1.9 |
| 1.11 | API documentation (OpenAPI) | 5 | P1 | Priscila | 1.2, 1.3, 1.4 |
| 1.12 | Error handling middleware | 3 | P2 | Valentina | 1.2 |

**Committed:** 53 pts / 68 pts capacity (78% — includes buffer)

## Sprint Schedule
| Day | Focus |
|-----|-------|
| Day 1-2 | Schema design + POST /users + Docker setup |
| Day 3-5 | GET /users/:id + Auth middleware |
| Day 6-7 | Authorization + Security review |
| Day 8-9 | Testing + API docs + CI/CD |
| Day 10 | Buffer + bug fixes + sprint review prep |

## Definition of Done
- [ ] Code merged to `dev` with passing CI
- [ ] Unit tests pass (coverage ≥ 80%)
- [ ] Security review passed (Diana approved)
- [ ] API docs updated (Priscila reviewed)
- [ ] Feature flag configured (if applicable)
- [ ] No P0/P1 bugs open

## Risk Mitigation
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Auth middleware larger than estimated | Medium | High | Split into 2 tasks (basic JWT + advanced RBAC) |
| Diana unavailable for security review | Low | Critical | Valentina does initial review; Diana validates |
```

## Steps
1. Review previous sprint: what was done, what carried over, velocity achieved
2. Calculate team capacity: available person-days × historical velocity per day
3. Define sprint goal: one sentence — what does success look like?
4. Select backlog items: prioritize by value and dependency order
5. Estimate effort for each item (story points or T-shirt sizes)
6. Assign tasks to agents based on skills, capacity, and dependencies
7. Commit to 70-80% of capacity — buffer for unknowns, blockers, and context switching
8. Define Definition of Done for each task type
9. Identify risks and mitigation (coordinate with `pm-risk`)
10. Write sprint plan to `.araya/plan/spec/sprint-plan.md`

## Rules
- Sprint goal must be one sentence — if you can't summarize it, it's not clear
- Commit to 70-80% of capacity — 100% commitment is 100% burnout with no buffer
- Every task must have exactly one owner and explicit dependencies
- P0 tasks define the sprint — if a P0 task can't be done, the sprint goal can't be met
- Definition of Done must be testable — no vague "code reviewed", must be "PR merged, CI green, 2 approvals"
- Carry-over from previous sprint: analyze why it carried over before recommitting
- Present sprint plan to The Data Professor for approval before starting
