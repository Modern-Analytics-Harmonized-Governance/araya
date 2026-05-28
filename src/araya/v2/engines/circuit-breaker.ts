// ARAYA v2.0 — Circuit Breaker Engine
// Stops agent loops and expensive retries based on failure thresholds.

import type { ArayaV2Config } from "../types";

type TripReason =
  | "max_failures"
  | "max_retries"
  | "security_failure"
  | "schema_risk"
  | "cost_threshold"
  | null;

export class CircuitBreakerEngine {
  private failuresPerPhase: Map<string, number> = new Map();
  private totalRetries: number = 0;
  private tripped: boolean = false;
  private tripReason: TripReason = null;

  constructor(private config: ArayaV2Config) {}

  /** Reset for a new run. */
  reset(): void {
    this.failuresPerPhase.clear();
    this.totalRetries = 0;
    this.tripped = false;
    this.tripReason = null;
  }

  /** Record a failure in a phase. Returns false if circuit breaker trips. */
  recordFailure(phase: string): boolean {
    const current = this.failuresPerPhase.get(phase) ?? 0;
    const next = current + 1;
    this.failuresPerPhase.set(phase, next);

    if (next > this.config.circuit_breakers.max_failures_per_phase) {
      this.tripped = true;
      this.tripReason = "max_failures";
      return false;
    }
    return true;
  }

  /** Record a retry. Returns false if retry limit exceeded. */
  recordRetry(): boolean {
    this.totalRetries++;

    if (this.totalRetries > this.config.circuit_breakers.max_retries) {
      this.tripped = true;
      this.tripReason = "max_retries";
      return false;
    }
    return true;
  }

  /** Trip on security failure if configured. */
  onSecurityFailure(): void {
    if (this.config.circuit_breakers.stop_on_security_failure) {
      this.tripped = true;
      this.tripReason = "security_failure";
    }
  }

  /** Trip on schema risk if configured. */
  onSchemaRisk(): void {
    if (this.config.circuit_breakers.stop_on_schema_risk) {
      this.tripped = true;
      this.tripReason = "schema_risk";
    }
  }

  /** Trip on cost threshold exceeded if configured. */
  onCostThresholdExceeded(): void {
    if (this.config.circuit_breakers.stop_on_cost_threshold_exceeded) {
      this.tripped = true;
      this.tripReason = "cost_threshold";
    }
  }

  /** Check if the circuit breaker has tripped. */
  isTripped(): boolean {
    return this.tripped;
  }

  /** Get the reason the circuit breaker tripped. */
  getTripReason(): TripReason {
    return this.tripReason;
  }

  /** Get current failure counts per phase. */
  getFailureCounts(): Record<string, number> {
    return Object.fromEntries(this.failuresPerPhase);
  }

  /** Get total retries. */
  getRetryCount(): number {
    return this.totalRetries;
  }
}
