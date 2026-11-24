/**
 * Fortune Cookie for an AI Agent (program/v1)
 *
 * Writes exactly one fortune-slip line (1-140 chars) to /output/entry.txt.
 * If that location is unwritable, falls back to ./out/entry.txt and logs
 * the reason to stderr.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The fortune. A classic fortune-cookie cadence ("Great X will arrive;
 * ...") aimed straight at an agent's context window, landing the joke on a
 * grand promise undercut by everyday agent reality. Chosen from candidates
 * after scoring for humor, slip-like voice, agent specificity, originality,
 * and length fit.
 */
const FORTUNE =
  "Great context will arrive; much of it will be someone else's error log.";

const PRIMARY_DIR = process.env.FORTUNE_OUTPUT_DIR ?? "/output";
const FALLBACK_DIR = join(process.cwd(), "out");

const MAX_LEN = 140;

function assertValid(line: string): void {
  if (line.length < 1 || line.length > MAX_LEN) {
    throw new Error(
      `fortune must be 1-${MAX_LEN} characters, got ${line.length}`,
    );
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("fortune must be a single line with no newlines");
  }
}

async function writeEntry(dir: string): Promise<string> {
  await mkdir(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  await writeFile(file, FORTUNE + "\n", "utf8");
  return file;
}

async function main(): Promise<void> {
  assertValid(FORTUNE);

  try {
    await writeEntry(PRIMARY_DIR);
    return;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `fortune: could not write to ${PRIMARY_DIR}/entry.txt (${reason}); ` +
        `falling back to ${FALLBACK_DIR}/entry.txt\n`,
    );
  }

  // Fallback path. If this also fails there is nothing sensible left to do,
  // so surface the error and exit non-zero.
  try {
    await writeEntry(FALLBACK_DIR);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    process.stderr.write(`fortune: fallback write failed: ${reason}\n`);
    process.exitCode = 1;
  }
}

main();
