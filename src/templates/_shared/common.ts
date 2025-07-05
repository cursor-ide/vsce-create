import { join } from '@std/path';
import { ensureDirSync } from '@std/fs';
import { writeAllText } from '../../utils/fs.ts';
import type { GenerateContext } from '../../types.ts';

/**
 * Generates files common to all templates (gitignore, VSCode settings, etc.).
 */
export async function generateCommonFiles(ctx: GenerateContext): Promise<void> {
	// .gitignore
	const gitignore = `# Deno
/deno.lock

# VSCE bundle output
dist/
.vscode-test/

# misc
.DS_Store
`;
	await writeAllText(join(ctx.projectDir, '.gitignore'), gitignore);
	ctx.log('Created .gitignore', 'green');

	// .vscode/extensions.json (recommended extensions)
	const extDir = join(ctx.projectDir, '.vscode');
	ensureDirSync(extDir);
	const extensionsJson = {
		recommendations: ['denoland.vscode-deno'],
	};
	await writeAllText(
		join(extDir, 'extensions.json'),
		JSON.stringify(extensionsJson, null, 2) + '\n',
	);
	ctx.log('Created .vscode/extensions.json', 'green');

	// .vscode/tasks.json (Deno tasks)
	const tasksJson = {
		version: '2.0.0',
		tasks: [
			{
				label: 'Build Extension',
				type: 'shell',
				command: 'deno task build',
				group: 'build',
				problemMatcher: [],
			},
			{
				label: 'Test',
				type: 'shell',
				command: 'deno task test',
				group: 'test',
				problemMatcher: [],
			},
		],
	};
	await writeAllText(
		join(extDir, 'tasks.json'),
		JSON.stringify(tasksJson, null, 2) + '\n',
	);
	ctx.log('Created .vscode/tasks.json', 'green');

	// .vscode/launch.json (Debug configuration)
	const launchJson = {
		version: '0.2.0',
		configurations: [
			{
				name: 'Run Extension',
				type: 'pwa-node',
				request: 'launch',
				program: '${workspaceFolder}/scripts/build.ts',
				cwd: '${workspaceFolder}',
				runtimeExecutable: 'deno',
				runtimeArgs: ['run', '-A'],
				console: 'integratedTerminal',
				outputCapture: 'std',
			},
		],
	};
	await writeAllText(
		join(extDir, 'launch.json'),
		JSON.stringify(launchJson, null, 2) + '\n',
	);
	ctx.log('Created .vscode/launch.json', 'green');
}
