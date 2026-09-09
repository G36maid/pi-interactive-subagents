import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAgentDir } from "@mariozechner/pi-coding-agent";

export const SUBAGENTS_CONFIG_FILENAME = "subagents.json";

/**
 * pi-standard global config location for this extension:
 * `~/.pi/agent/extensions/subagents.json`. Resolved via getAgentDir(), so
 * rebranded distributions and PI_CODING_AGENT_DIR are respected.
 */
export function defaultSubagentsConfigPath(): string {
  return join(getAgentDir(), "extensions", SUBAGENTS_CONFIG_FILENAME);
}

export interface RawSubagentsConfig {
  sourcePath: string;
  parsed: unknown;
}

/**
 * Read and parse the subagents config file. Returns undefined when the file is
 * absent — every section in it is optional, so a missing file means defaults.
 * Malformed JSON throws with the offending path.
 */
export function readSubagentsConfig(
  configPath = defaultSubagentsConfigPath(),
): RawSubagentsConfig | undefined {
  let rawConfig: string;
  try {
    rawConfig = readFileSync(configPath, "utf8");
  } catch (error) {
    const errno = error as NodeJS.ErrnoException;
    if (errno.code !== "ENOENT") throw error;
    return undefined;
  }

  try {
    return { sourcePath: configPath, parsed: JSON.parse(rawConfig) as unknown };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in subagent config ${configPath}: ${detail}`);
  }
}
