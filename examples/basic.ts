/**
 * Minimal example: programmatically scaffold a basic VS Code extension.
 *
 * Run with:
 *
 * ```bash
 * deno run -A examples/basic.ts
 * ```
 */
import { scaffoldProject } from '../mod.ts';

await scaffoldProject({
	projectDir: './my-basic-extension',
	template: 'basic',
	force: true,
	options: {},
});

console.log('✅ Project generated at ./my-basic-extension');
