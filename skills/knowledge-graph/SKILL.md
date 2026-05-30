---
name: knowledge-graph
description: "ARAYA Organizational Knowledge Graph — entity-relationship governance, impact analysis, and organizational query engine."
---

# Organizational Knowledge Graph

Transform isolated artifacts into connected knowledge. Every agent, skill,
technology, project, requirement, and trajectory is a node. Every ownership,
dependency, preference, and influence is an edge.

## Entity Types

Agent, Skill, Capability, Technology, Project, Requirement,
AcceptanceCriteria, Task, Evidence, Delivery, Trajectory, Pattern,
ADR, Standard, Rule, Domain

## Relationship Types

OWNS, USES, IMPLEMENTS, VALIDATES, REVIEWS, PARTICIPATED_IN,
DEPENDS_ON, GENERATED, RECOMMENDS, LEARNED_FROM, RELATED_TO,
REQUIRES, GOVERNS, PREFERS, INFLUENCES

## Commands

- `/araya graph` — entity and relationship summary
- `/araya graph --search "<term>"` — search by entity name or type
- `/araya graph --show "<entity>"` — detailed entity view with relationships
- `/araya graph --impact "<entity>"` — impact analysis (agents, skills, projects, standards affected)
- `/araya graph --visualize "<entity>"` — generate Mermaid relationship diagram
- `/araya ask "<question>"` — organizational query engine using graph + capabilities + constitution + trajectories

## Rules

- Graph is file-based and deterministic — no external databases
- Relationships are generated from existing artifacts (specs, preferences, metrics, trajectories)
- Graph recommendations never override constitutional rules
- Impact analysis is mandatory before major technology or architecture changes
