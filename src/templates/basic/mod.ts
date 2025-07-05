import { join } from '@std/path';
import { ensureDirSync } from '@std/fs';
import { writeAllText, writeJson } from '../../utils/fs.ts';
import { validateCommonOptions } from '../../utils/validate.ts';
import { generateCommonFiles } from '../_shared/common.ts';
import type { TemplateDefinition } from '../../types.ts';

const template: TemplateDefinition = {
	id: 'basic',
	name: 'Basic Extension',
	description: 'Minimal dual-runtime VSCode extension scaffold.',

	validate(opts) {
		return validateCommonOptions(opts);
	},

	async generate(ctx) {
		await generateCommonFiles(ctx);
		// Create root directory structure
		ensureDirSync(ctx.projectDir);

		const name = ctx.options.projectName ?? 'my-extension';
		// 1. README
		await writeAllText(
			join(ctx.projectDir, 'README.md'),
			`# ${name}\n\nGenerated with @vsce/create (basic template).`,
		);

		// 2. deno.json
		await writeJson(join(ctx.projectDir, 'deno.json'), {
			lint: { rules: { tags: ['recommended'] } },
			fmt: { options: { useTabs: false, lineWidth: 80 } },
			nodeModulesDir: 'auto',
			imports: {
				'vscode': 'jsr:@typed/vscode@^1.101.0',
				'@typed/vscode': 'jsr:@typed/vscode@^1.101.0',
			},
			tasks: {
				'build': 'deno run -A scripts/build.ts',
				'test': 'deno test -A',
			},
		});

		// 3. jsr.json
		await writeJson(join(ctx.projectDir, 'jsr.json'), {
			name,
			version: '0.0.0',
			exports: {
				'.': './mod.ts',
			},
		});

		// 4. package.json
		await writeJson(join(ctx.projectDir, 'package.json'), {
			name,
			displayName: name,
			description: 'A hello world extension generated with @vsce/create',
			publisher: 'your-publisher',
			version: '0.0.0',
			private: true,
			categories: ['Other'],
			engines: { 'vscode': '^1.90.0' },
			extensionKind: ['workspace', 'web'],
			main: 'dist/extension.js',
			browser: 'dist/extension.js',
			activationEvents: ['onCommand:extension.helloWorld'],
			contributes: {
				commands: [
					{
						command: 'extension.helloWorld',
						title: 'Hello World',
					},
				],
			},
		});

		// 5. scripts/build.ts
		const buildScript =
			`import { bundleExtension } from \"jsr:@vsce/bundler\";\nawait bundleExtension({ projectDir: Deno.cwd(), entryPoint: \"src/extension.ts\", outDir: \"dist\", quiet: true });\n`;
		ensureDirSync(join(ctx.projectDir, 'scripts'));
		await writeAllText(
			join(ctx.projectDir, 'scripts', 'build.ts'),
			buildScript,
		);

		// 6. src/extension.ts stub
		const srcDir = join(ctx.projectDir, 'src');
		ensureDirSync(srcDir);
		const extCode =
			`import { commands, window, ExtensionContext } from 'jsr:@typed/vscode@^1.101.0';\n\nexport function activate(ctx: ExtensionContext) {\n  const disposable = commands.registerCommand('extension.helloWorld', () => {\n    window.showInformationMessage('Hello from ${name}!');\n  });\n  ctx.subscriptions.push(disposable);\n}\n\nexport function deactivate() {}\n`;
		await writeAllText(join(srcDir, 'extension.ts'), extCode);

		ctx.log(
			'Generated deno.json, jsr.json, package.json, scripts/build.ts, and src/extension.ts',
		);
	},
};

export default template;
