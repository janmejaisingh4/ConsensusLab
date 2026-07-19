export type Provider = "openai" | "claude" | "gemini";
export interface ModelResult { provider: Provider; model: string; answer?: string; error?: string; latencyMs: number; }
export interface ConsensusResponse { mode: "live" | "demo"; responses: ModelResult[]; synthesis: string; evaluator: string; totalMs: number; }
