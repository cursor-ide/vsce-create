import { join } from '@std/path';
import { assert } from '@std/assert';
import { scaffoldProject } from '../mod.ts';
import { bundleExtension } from 'jsr:@vsce/bundler@^1.0.0';

interface Case {
	template: string;
	extraFiles: string[];
}

const cases: Case[] = [
	{ template: 'treeview', extraFiles: [] },
	{ template: 'webview', extraFiles: [] },
	{ template: 'language-server', extraFiles: ['src/server.ts'] },
];

for (const { template, extraFiles } of cases) {
	Deno.test(`${template} template bundles successfully`, async () => {
		const tmp = await Deno.makeTempDir();

		await scaffoldProject({ projectDir: tmp, template, nocolor: true });

		const required = [
			'README.md',
			'.gitignore',
			'deno.json',
			'jsr.json',
			'package.json',
			'scripts/build.ts',
			'src/extension.ts',
			...extraFiles,
		];

		for (const f of required) {
			const path = join(tmp, f);
			try {
				await Deno.stat(path);
			} catch {
				throw new Error(`[${template}] expected file missing: ${f}`);
			}
		}

		// Build with real bundler
		const result = await bundleExtension({
			projectDir: tmp,
			entryPoint: 'src/extension.ts',
			outDir: 'dist',
			quiet: true,
		});

		assert(result.bundlePath.endsWith('dist/extension.js'));
	});
}
