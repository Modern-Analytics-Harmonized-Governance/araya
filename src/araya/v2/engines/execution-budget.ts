// ARAYA v2.0 — Execution Budget Engine
// Tracks and enforces cost, time, token, and turn limits.

import type { ArayaV2Config } from "../types";

export class ExecutionBudgetEngine {
  private startTime: number = 0;
  private costAccumulated: number = 0;
  private tokensUsed: number = 0;
  private turnsUsed: Map<string, number> = new Map();
  private budgetExceeded: boolean = false;

  constructor(private config: ArayaV2Config) {}

  /** Start tracking for a new run. */
  start(): void {
    this.startTime = Date.now();
    this.costAccumulated = 0;
    this.tokensUsed = 0;
    this.turnsUsed.clear();
    this.budgetExceeded = false;
  }

  /** Track token usage. Returns true if budget is still within limits. */
  trackTokens(input: number, output: number, reasoning: number): boolean {
    const total = input + output + reasoning;
    this.tokensUsed += total;

    if (reasoning > this.config.execution_budget.max_reasoning_tokens) {
      this.budgetExceeded = true;
      return false;
    }
    return true;
  }

  /** Track cost. Returns true if budget is still within limits. */
  trackCost(costUsd: number): boolean {
    this.costAccumulated += costUsd;

    if (this.costAccumulated > this.config.execution_budget.max_cost_usd) {
      this.budgetExceeded = true;
      return false;
    }
    return true;
  }

  /** Track agent turns. Returns true if agent hasn't exceeded turn limit. */
  trackTurn(agentName: string): boolean {
    const current = this.turnsUsed.get(agentName) ?? 0;
    const maxTurns = this.config.agents[agentName]?.max_turns
      ?? this.config.execution_budget.max_turns_per_agent;

    if (current >= maxTurns) {
      return false;
    }

    this.turnsUsed.set(agentName, current + 1);
    return true;
  }

  /** Check if runtime has exceeded the limit. */
  isRuntimeExceeded(): boolean {
    const elapsed = (Date.now() - this.startTime) / 60_000; // minutes
    return elapsed > this.config.execution_budget.max_runtime_minutes;
  }

  /** Check if parallel agent limit is exceeded. */
  canLaunchAgent(currentAgentCount: number): boolean {
    return currentAgentCount < this.config.execution_budget.max_parallel_agents;
  }

  /** Get current cost accumulated. */
  getCostAccumulated(): number {
    return this.costAccumulated;
  }

  /** Get total tokens used. */
  getTokensUsed(): number {
    return this.tokensUsed;
  }

  /** Get elapsed time in ms. */
  getElapsedMs(): number {
    return Date.now() - this.startTime;
  }

  /** Check if any budget has been exceeded. */
  isBudgetExceeded(): boolean {
    return this.budgetExceeded || this.isRuntimeExceeded();
  }

  /** Get budget status report. */
  getStatus(): {
    cost: { used: number; max: number; exceeded: boolean };
    time: { elapsed_min: number; max_min: number; exceeded: boolean };
    tokens: { used: number; max_reasoning: number };
    turns: Record<string, number>;
  } {
    return {
      cost: {
        used: this.costAccumulated,
        max: this.config.execution_budget.max_cost_usd,
        exceeded: this.costAccumulated > this.config.execution_budget.max_cost_usd,
      },
      time: {
        elapsed_min: (Date.now() - this.startTime) / 60_000,
        max_min: this.config.execution_budget.max_runtime_minutes,
        exceeded: this.isRuntimeExceeded(),
      },
      tokens: {
        used: this.tokensUsed,
        max_reasoning: this.config.execution_budget.max_reasoning_tokens,
      },
      turns: Object.fromEntries(this.turnsUsed),
    };
  }
}
