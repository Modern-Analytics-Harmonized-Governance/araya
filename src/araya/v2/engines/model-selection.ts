// ARAYA v2.0 — Model Selection Engine
// Maps capability tiers (fast/balanced/reasoning) to providers and models.
// Never hardcodes model names — uses capability descriptors.

import type { ArayaV2Config, AgentV2Config, ModelTierName } from "../types";

export class ModelSelectionEngine {
  constructor(private config: ArayaV2Config) {}

  /**
   * Resolve the model tier for an agent.
   * Falls back to the agent's configured tier, then to "balanced".
   */
  resolveTier(agent: AgentV2Config): ModelTierName {
    const tier = agent.model_tier ?? "balanced";
    if (tier in this.config.model_tiers) {
      return tier as ModelTierName;
    }
    return "balanced";
  }

  /**
   * Get the tier configuration.
   */
  getTierConfig(tier: ModelTierName) {
    const config = this.config.model_tiers[tier];
    if (!config) {
      throw new Error(`Unknown model tier: ${tier}`);
    }
    return config;
  }

  /**
   * Get the primary provider for a given tier.
   */
  getPrimaryProvider(tier: ModelTierName): string {
    return this.getTierConfig(tier).primary_provider;
  }

  /**
   * Get allowed fallback providers for a given tier.
   */
  getFallbackProviders(tier: ModelTierName): string[] {
    return this.getTierConfig(tier).allowed_fallback_providers;
  }

  /**
   * Get the reasoning effort for a given tier or agent.
   */
  getReasoningEffort(
    tier: ModelTierName,
    agent?: AgentV2Config
  ): "low" | "medium" | "high" {
    // Agent-level override takes precedence
    if (agent?.reasoning_effort) return agent.reasoning_effort;
    return this.getTierConfig(tier).reasoning_effort;
  }

  /**
   * Check if a provider is allowed for a given tier.
   */
  isProviderAllowed(tier: ModelTierName, provider: string): boolean {
    const config = this.getTierConfig(tier);
    if (provider === config.primary_provider) return true;
    return config.allowed_fallback_providers.includes(provider);
  }

  /**
   * Get the default tier for an agent based on its role and skills.
   */
  getAgentTier(agentName: string): ModelTierName {
    const agent = this.config.agents[agentName];
    if (!agent) return "balanced";
    return this.resolveTier(agent);
  }

  /**
   * List all available tiers.
   */
  listTiers(): Array<{ name: string; purpose: string }> {
    return Object.entries(this.config.model_tiers).map(([name, config]) => ({
      name,
      purpose: config.purpose,
    }));
  }
}
