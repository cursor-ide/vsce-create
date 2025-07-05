import { join } from '@std/path';
import { ensureDirSync } from '@std/fs';
/**
 * @module language-server-template
 * Language Server extension scaffold that runs a simple LSP in a Web Worker.
 */

import { writeAllText, writeJson } from '../../utils/fs.ts';
import { validateCommonOptions } from '../../utils/validate.ts';
import { generateCommonFiles } from '../_shared/common.ts';
import type { TemplateDefinition } from '../../types.ts';

const template: TemplateDefinition = {
	id: 'language-server',
	name: 'Language Server Extension',
	description:
		'Scaffold for a VSCode Web extension that runs a simple language server in a web worker.',

	validate(opts) {
		return validateCommonOptions(opts);
	},

	async generate(ctx) {
		await generateCommonFiles(ctx);
		ensureDirSync(ctx.projectDir);
		const name = ctx.options.projectName ?? 'language-server-extension';

		// README
		await writeAllText(
			join(ctx.projectDir, 'README.md'),
			`# ${name}\n\nThis template shows how to run a basic LSP in a Web Worker using the @vsce ecosystem.`,
		);

		// deno.json
		await writeJson(join(ctx.projectDir, 'deno.json'), {
			lint: { rules: { tags: ['recommended'] } },
			fmt: { options: { useTabs: false, lineWidth: 80 } },
			nodeModulesDir: true,
			imports: {
				'vscode': 'jsr:@typed/vscode@^1.101.0',
				'@typed/vscode': 'jsr:@typed/vscode@^1.101.0',
				'vscode-languageclient/browser':
					'npm:vscode-languageclient@9.5.0/browser.mjs',
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
				'A Language Server sample extension generated with @vsce/create',
			publisher: 'your-publisher',
			version: '0.0.0',
			private: true,
			categories: ['Other'],
			engines: { vscode: '^1.90.0' },
			extensionKind: ['workspace', 'web'],
			main: 'dist/extension.js',
			browser: 'dist/extension.js',
			activationEvents: [
				'onCommand:lsp.showInfo',
				'onLanguage:plaintext',
			],
			contributes: {
				commands: [{
					'command': 'lsp.showInfo',
					'title': 'Show LSP Info',
				}],
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
			`import { commands, window, ExtensionContext } from 'jsr:@typed/vscode@^1.101.0';\nimport { WorkerTransport, BrowserMessageReader, BrowserMessageWriter } from 'npm:vscode-languageclient@9.5.0/browser.mjs';\n\nexport function activate(ctx: ExtensionContext) {\n  const transport = WorkerTransport.create(new URL('./server.ts', import.meta.url));\n  const client = transport.createLanguageClient({\n    name: 'Sample LSP',\n    documentSelector: [{ scheme: 'file', language: 'plaintext' }],\n  });\n  ctx.subscriptions.push(client.start());\n\n  const cmd = commands.registerCommand('lsp.showInfo', () => {\n    window.showInformationMessage('Language server is running');\n  });\n  ctx.subscriptions.push(cmd);\n}\n\nexport function deactivate() {};\n`;

		const serverCode =
			`import { createConnection, ProposedFeatures, TextDocuments, Diagnostic, DiagnosticSeverity } from 'npm:vscode-languageserver@8.1.0/browser';\n\nconst connection = createConnection(ProposedFeatures.all);\nconst documents = new TextDocuments();\n\nconnection.onInitialize(() => ({\n  capabilities: { textDocumentSync: documents.syncKind },\n}));\n\ndocuments.onDidOpen(({ document }) => {\n  const diag: Diagnostic = {\n    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },\n    message: 'LSP ready',\n    severity: DiagnosticSeverity.Information,\n  };\n  connection.sendDiagnostics({ uri: document.uri, diagnostics: [diag] });\n});\n\ndocuments.listen(connection);\nconnection.listen();\n`;

		await writeAllText(join(srcDir, 'extension.ts'), extensionCode);
		await writeAllText(join(srcDir, 'server.ts'), serverCode);

		ctx.log('Language-server template generated');
	},
};

export default template;
