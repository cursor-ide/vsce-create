import { dirname } from '@std/path';
import { ensureDir } from '@std/fs';

/**
 * Convenience helper to write text to a file, ensuring parent directories
 * exist and encoding is UTF-8.
 */
export async function writeAllText(path: string, data: string): Promise<void> {
	await ensureDir(dirname(path));
	await Deno.writeTextFile(path, data);
}

/**
 * Shortcut to write a formatted JSON file.
 */
export async function writeJson(path: string, value: unknown): Promise<void> {
	const text = JSON.stringify(value, null, 2) + '\n';
	await writeAllText(path, text);
}
