import { join } from '@std/path';
import { ensureDirSync } from '@std/fs';
/**
 * @module webview-template
 * Webview extension scaffold that demonstrates the VS Code Webview API.
 */

import { writeAllText, writeJson } from '../../utils/fs.ts';
import { validateCommonOptions } from '../../utils/validate.ts';
import { generateCommonFiles } from '../_shared/common.ts';
import type { TemplateDefinition } from '../../types.ts';

const template: TemplateDefinition = {
	id: 'webview',
	name: 'Webview Extension',
	description: 'VSCode extension showcasing a custom Webview panel.',

	validate(opts) {
		return validateCommonOptions(opts);
	},

	async generate(ctx) {
		await generateCommonFiles(ctx);
		ensureDirSync(ctx.projectDir);
		const name = ctx.options.projectName ?? 'webview-extension';

		// README
		await writeAllText(
			join(ctx.projectDir, 'README.md'),
			`# ${name}\n\nSample Webview extension scaffolded with @vsce/create.`,
		);

		// deno.json
		await writeJson(join(ctx.projectDir, 'deno.json'), {
			lint: { rules: { tags: ['recommended'] } },
			fmt: { options: { useTabs: false, lineWidth: 80 } },
			nodeModulesDir: 'auto',
			imports: {
				'vscode': 'jsr:@typed/vscode@^1.101.0',
				'@typed/vscode': 'jsr:@typed/vscode@^1.101.0',
			},
			tasks: {
				build: 'deno run -A scripts/build.ts',
				test: 'deno test -A',
			},
		});

		// jsr.json
		await writeJson(join(ctx.projectDir, 'jsr.json'), {
			name,
			version: '0.0.0',
			exports: { '.': './mod.ts' },
		});

		// package.json
		await writeJson(join(ctx.projectDir, 'package.json'), {
			name,
			displayName: name,
			description:
				'A Webview sample extension generated with @vsce/create',
			publisher: 'your-publisher',
			version: '0.0.0',
			private: true,
			categories: ['Other'],
			engines: { vscode: '^1.90.0' },
			extensionKind: ['workspace', 'web'],
			main: 'dist/extension.js',
			browser: 'dist/extension.js',
			activationEvents: ['onCommand:webviewDemo.open'],
			contributes: {
				commands: [{
					'command': 'webviewDemo.open',
					'title': 'Open Webview Demo',
				}],
				menus: {
					commandPalette: [{
						'command': 'webviewDemo.open',
						'when': '!inWeb',
					}],
				},
			},
		});

		// build script
		const buildScript =
			`import { bundleExtension } from \"jsr:@vsce/bundler\";\nawait bundleExtension({ projectDir: Deno.cwd(), entryPoint: \"src/extension.ts\", outDir: \"dist\", quiet: true });\n`;
		ensureDirSync(join(ctx.projectDir, 'scripts'));
		await writeAllText(
			join(ctx.projectDir, 'scripts', 'build.ts'),
			buildScript,
		);

		// src
		const srcDir = join(ctx.projectDir, 'src');
		ensureDirSync(srcDir);

		const extensionCode =
			`import { window, commands, ExtensionContext } from 'jsr:@typed/vscode@^1.101.0';\n\nfunction getHtml(content: string): string {\n  return \`<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\" />\n  <title>Webview Sample</title>\n</head>\n<body>\n  <h1>Hello from Webview!</h1>\n  <p>\${content}</p>\n</body>\n</html>\`;\n}\n\nexport function activate(ctx: ExtensionContext) {\n  const cmd = commands.registerCommand('webviewDemo.open', () => {\n    const panel = window.createWebviewPanel('demo', 'Webview Demo', { viewColumn: 1, preserveFocus: false }, {});\n    panel.webview.html = getHtml('This markup is served from your extension.');\n  });\n  ctx.subscriptions.push(cmd);\n}\n\nexport function deactivate() {}\n`;

		await writeAllText(join(srcDir, 'extension.ts'), extensionCode);

		ctx.log('Webview template generated');
	},
};

export default template;
