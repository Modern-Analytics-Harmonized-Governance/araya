// ARAYA v2.0 — Workflow Policy Engine
// Selects gates and phases based on delivery mode and policy.
// Integrated with DependencyAnalyzer for DAG-aware orchestration.

import type {
  ArayaV2Config,
  DeliveryModeName,
  WorkflowPolicyName,
} from "../types";
import { DependencyAnalyzer, Task } from "../../parallel/analyzer";

const ALL_PHASES = [
  "sdd", "bdd", "tdd", "implementation",
  "review", "security", "validation", "documentation"
];

// Natural phase dependencies — what must complete before what can start
const PHASE_DEPENDENCIES: Record<string, string[]> = {
  sdd:            [],
  bdd:            ["sdd"],
  tdd:            ["bdd"],
  plan:           [],
  tests:          ["plan"],
  implementation: ["tdd", "tests"],
  review:         ["implementation"],
  security:       ["implementation"],
  validation:     ["review", "tests"],
  documentation:  ["implementation"],
};

export interface PhaseDependencyGraph {
  phases: string[];
  parallelGroups: string[][];
  criticalPath: string[];
  canOptimize: boolean;
  estimatedSerialSteps: number;
  estimatedParallelSteps: number;
}

export class WorkflowPolicyEngine {
  constructor(private config: ArayaV2Config) {}

  /**
   * Resolve the phases required for a given mode + policy combination.
   */
  resolve(mode: DeliveryModeName, policy: WorkflowPolicyName): string[] {
    const modeConfig = this.config.delivery_modes[mode];
    if (!modeConfig) {
      throw new Error(`Unknown delivery mode: ${mode}`);
    }

    const policyConfig = this.config.workflow_policies[policy];
    if (!policyConfig) {
      throw new Error(`Unknown workflow policy: ${policy}`);
    }

    let phases = [...modeConfig.phases];

    if (policy === "conservative") {
      phases = [...new Set([...phases, ...ALL_PHASES])];
    } else if (policy === "aggressive") {
      const core = ["implementation", "review"];
      phases = phases.filter(p => core.includes(p));
      if (phases.length === 0) phases = core;
    }

    return phases;
  }

  /**
   * Build a dependency graph for the resolved phases.
   * Uses DependencyAnalyzer to compute parallel groups, critical path,
   * and optimization potential.
   */
  getPhaseDependencyGraph(
    mode: DeliveryModeName,
    policy: WorkflowPolicyName
  ): PhaseDependencyGraph {
    const phases = this.resolve(mode, policy);

    // Build task list for the analyzer
    const tasks: Task[] = phases.map((phase, i) => ({
      id: phase,
      name: phase,
      dependencies: (PHASE_DEPENDENCIES[phase] ?? []).filter(d => phases.includes(d)),
    }));

    const analyzer = new DependencyAnalyzer(tasks);
    const parallelGroups = analyzer.getParallelGroups();
    const criticalPath = analyzer.getCriticalPath();

    return {
      phases,
      parallelGroups,
      criticalPath,
      canOptimize: parallelGroups.some(g => g.length > 1),
      estimatedSerialSteps: phases.length,
      estimatedParallelSteps: parallelGroups.length,
    };
  }

  /**
   * Generate a human-readable dependency analysis for run configuration.
   */
  formatDependencyAnalysis(
    mode: DeliveryModeName,
    policy: WorkflowPolicyName
  ): string {
    const graph = this.getPhaseDependencyGraph(mode, policy);

    const lines: string[] = [
      `## Phase Dependency Analysis`,
      ``,
      `**Critical Path:** ${graph.criticalPath.join(" → ")}`,
      `**Optimization Potential:** ${graph.canOptimize ? "✅ Parallel groups detected" : "⚠️ Fully sequential — no parallelism possible"}`,
      `**Serial Steps:** ${graph.estimatedSerialSteps} | **Parallel Steps:** ${graph.estimatedParallelSteps}`,
      ``,
      `### Execution Levels (Parallel Groups)`,
    ];

    for (let i = 0; i < graph.parallelGroups.length; i++) {
      const group = graph.parallelGroups[i];
      const marker = group.length > 1 ? "⚡ PARALLEL" : "→";
      lines.push(`  Level ${i + 1}: ${marker} ${group.join(", ")}`);
    }

    if (graph.canOptimize) {
      lines.push(``);
      lines.push(`**Note:** Phases in the same level can execute concurrently when SDK sub-agent delegation is available (MVP3+). Currently executing sequentially.`);
    }

    return lines.join("\n");
  }

  /**
   * Check if security review is required for the given policy.
   */
  requiresSecurityReview(policy: WorkflowPolicyName): boolean {
    const policyConfig = this.config.workflow_policies[policy];
    return policyConfig?.require_security_review === true;
  }

  /**
   * Check if architect review is required for the given policy.
   */
  requiresArchitectReview(policy: WorkflowPolicyName): boolean {
    const policyConfig = this.config.workflow_policies[policy];
    return policyConfig?.require_architect_review === true;
  }

  /**
   * Check if human approval is required for the given mode.
   */
  requiresHumanApproval(mode: DeliveryModeName): boolean {
    const modeConfig = this.config.delivery_modes[mode];
    return modeConfig?.requires_approval === true;
  }

  /**
   * Get the delivery mode configuration.
   */
  getMode(mode: DeliveryModeName) {
    return this.config.delivery_modes[mode];
  }

  /**
   * Get the workflow policy configuration.
   */
  getPolicy(policy: WorkflowPolicyName) {
    return this.config.workflow_policies[policy];
  }
}
