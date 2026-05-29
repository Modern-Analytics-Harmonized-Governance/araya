---
name: drr-create
description: "Create Delivery Review Reports (DRR) to formally capture all post-delivery feedback, findings, and observations."
---

# DRR — Delivery Review Report

Create formal Delivery Review Reports that capture all feedback after a
delivery has been reviewed by the Product Owner, stakeholder, or user.

## What problem this solves

Post-delivery feedback is lost in chat history, comments, and ad-hoc
discussions. DRRs formalize every observation as a traceable finding
with category, severity, reviewer, and status.

## When to Use

- After any delivery is presented for review
- When Manu (PO) or stakeholders provide feedback
- Before closing any delivery as "complete"

## Input

Delivery ID, reviewer name, and all feedback observations.

## Steps

1. Create the DRR with unique ID: `DRR-{YYYY}-{NNN}`
2. Classify each finding by category: Bug, Missing Requirement, Enhancement, UX, UI, Security, Architecture, Performance, Documentation, Naming, Compliance, Technical Debt, Clarification
3. Assign severity per finding: critical, high, medium, low
4. Set status: open
5. Save to `.araya/reviews/drr/{drr_id}.yaml`

## DRR Format

```yaml
drr_id: DRR-2026-001
delivery_id: DEL-2026-005
reviewer: manu
status: open
findings:
  - id: DRR-001
    type: Missing Requirement
    severity: high
    description: Export button missing
    date: 2026-05-29
```

## Expected Output

Structured DRR saved to `.araya/reviews/drr/` with all findings classified.

## Done Criteria

- [ ] All feedback captured as findings with unique IDs
- [ ] Each finding has category, severity, and description
- [ ] DRR saved to `.araya/reviews/drr/`
- [ ] Status set to open
