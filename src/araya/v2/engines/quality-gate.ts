// ARAYA v2.0 — Quality Gate Engine
// Validates agent outputs against mode-specific quality criteria.

import type { ArayaV2Config, StructuredOutput, RunConfig } from "../types";

type GateResult = "pass" | "fail" | "warn";

interface GateCheck {
  name: string;
  result: GateResult;
  detail: string;
}

export class QualityGateEngine {
  constructor(private config: ArayaV2Config) {}

  /**
   * Run all applicable quality gates against a structured output.
   */
  evaluate(output: StructuredOutput, runConfig: RunConfig): {
    passed: boolean;
    checks: GateCheck[];
    summary: string;
  } {
    const checks: GateCheck[] = [];

    // Gate 1: Status check
    if (output.status !== "completed") {
      checks.push({
        name: "status",
        result: "fail",
        detail: `Agent status is '${output.status}', expected 'completed'`,
      });
    } else {
      checks.push({
        name: "status",
        result: "pass",
        detail: "Agent completed successfully",
      });
    }

    // Gate 2: Confidence threshold
    if (output.confidence < 0.7) {
      checks.push({
        name: "confidence",
        result: "fail",
        detail: `Confidence ${output.confidence} below 0.7 threshold`,
      });
    } else if (output.confidence < 0.85) {
      checks.push({
        name: "confidence",
        result: "warn",
        detail: `Confidence ${output.confidence} below 0.85 — review recommended`,
      });
    } else {
      checks.push({
        name: "confidence",
        result: "pass",
        detail: `Confidence ${output.confidence} meets threshold`,
      });
    }

    // Gate 3: Risk check
    const criticalRisks = output.risks.filter(r => r.severity === "critical");
    if (criticalRisks.length > 0) {
      checks.push({
        name: "risks",
        result: "fail",
        detail: `${criticalRisks.length} critical risk(s): ${criticalRisks.map(r => r.id).join(", ")}`,
      });
    } else {
      checks.push({
        name: "risks",
        result: "pass",
        detail: "No critical risks identified",
      });
    }

    // Gate 4: Blocker check
    if (output.blockers.length > 0) {
      checks.push({
        name: "blockers",
        result: "fail",
        detail: `${output.blockers.length} blocker(s): ${output.blockers.map(b => b.id).join(", ")}`,
      });
    } else {
      checks.push({
        name: "blockers",
        result: "pass",
        detail: "No blockers",
      });
    }

    // Gate 5: Test check (for modes that require tests)
    if (output.tests_run > 0 && !output.tests_passed) {
      checks.push({
        name: "tests",
        result: "fail",
        detail: `${output.tests_run} tests run but not all passed`,
      });
    } else if (output.tests_run > 0) {
      checks.push({
        name: "tests",
        result: "pass",
        detail: `All ${output.tests_run} tests passed`,
      });
    }

    // Gate 6: Human approval required check
    if (output.requires_human_approval) {
      checks.push({
        name: "human_approval",
        result: "warn",
        detail: `Human approval required: ${output.approval_reason ?? "unspecified reason"}`,
      });
    }

    // Gate 7: Full mode requires evidence
    if (runConfig.mode === "full") {
      const hasEvidence =
        output.evidence.logs.length > 0 ||
        output.evidence.reports.length > 0;
      checks.push({
        name: "evidence",
        result: hasEvidence ? "pass" : "fail",
        detail: hasEvidence
          ? "Evidence artifacts present"
          : "No evidence artifacts found (required for full mode)",
      });
    }

    const failed = checks.filter(c => c.result === "fail");
    const warned = checks.filter(c => c.result === "warn");

    return {
      passed: failed.length === 0,
      checks,
      summary: `${checks.length} gates: ${checks.filter(c => c.result === "pass").length} passed, ${failed.length} failed, ${warned.length} warnings`,
    };
  }

  /**
   * Check if a gate failure should trigger circuit breaker.
   */
  isSecurityFailure(output: StructuredOutput): boolean {
    return output.risks.some(
      r => r.severity === "critical" &&
      (r.description.toLowerCase().includes("security") ||
       r.description.toLowerCase().includes("vulnerability"))
    );
  }

  /**
   * Check if output indicates schema risk.
   */
  isSchemaRisk(output: StructuredOutput): boolean {
    return output.files_changed.some(
      f => f.includes("schema") || f.includes("migration") || f.includes(".sql")
    );
  }
}
