import { join } from '@std/path';
import { bundleExtension } from '../../vsce-bundler/mod.ts';
import { assert } from '@std/assert';
import { scaffoldProject } from '../mod.ts';

Deno.test('basic template generates expected file set and build succeeds', async () => {
	const tmp = await Deno.makeTempDir();

	await scaffoldProject({
		projectDir: tmp,
		template: 'basic',
		nocolor: true,
	});

	const expected = [
		'README.md',
		'.gitignore',
		'deno.json',
		'jsr.json',
		'package.json',
		'scripts/build.ts',
		'src/extension.ts',
		'.vscode/extensions.json',
		'.vscode/tasks.json',
		'.vscode/launch.json',
	];

	for (const file of expected) {
		const path = join(tmp, file);
		try {
			await Deno.stat(path);
		} catch {
			throw new Error(`${file} was not created`);
		}
	}

	// Verify build script references @vsce/bundler
	const buildContent = await Deno.readTextFile(join(tmp, 'scripts/build.ts'));
	assert(
		buildContent.includes('@vsce/bundler'),
		'build script missing bundler import',
	);

	// Build the project using the real bundler
	const result = await bundleExtension({
		projectDir: tmp,
		entryPoint: 'src/extension.ts',
		outDir: 'dist',
		quiet: true,
	});
	assert(result.bundlePath.endsWith('dist/extension.js'));
	const info = await Deno.stat(result.bundlePath);
	assert(info.isFile && info.size > 0, 'bundle file not created');
});
