import { join } from '@std/path';
import { ensureDirSync } from '@std/fs';
/**
 * @module treeview-template
 * Tree View extension scaffold generating a dual-runtime VS Code extension that
 * demonstrates `TreeDataProvider` usage.
 */

import { writeAllText, writeJson } from '../../utils/fs.ts';
import { validateCommonOptions } from '../../utils/validate.ts';
import { generateCommonFiles } from '../_shared/common.ts';
import type { TemplateDefinition } from '../../types.ts';

/**
 * Tree View extension scaffold generating a dual-runtime VS Code extension that
 * demonstrates `TreeDataProvider` usage.
 */
const template: TemplateDefinition = {
	id: 'treeview',
	name: 'Tree View Extension',
	description: 'VSCode extension showcasing a custom TreeView UI component.',

	validate(opts) {
		return validateCommonOptions(opts);
	},

	async generate(ctx) {
		await generateCommonFiles(ctx);
		ensureDirSync(ctx.projectDir);
		const name = ctx.options.projectName ?? 'treeview-extension';

		// README
		await writeAllText(
			join(ctx.projectDir, 'README.md'),
			`# ${name}\n\nSample TreeView extension scaffolded with @vsce/create.`,
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
				'A Tree View sample extension generated with @vsce/create',
			publisher: 'your-publisher',
			version: '0.0.0',
			private: true,
			categories: ['Other'],
			engines: { vscode: '^1.90.0' },
			extensionKind: ['workspace', 'web'],
			main: 'dist/extension.js',
			browser: 'dist/extension.js',
			activationEvents: [
				'onView:sampleView',
				'onCommand:sampleView.refresh',
			],
			contributes: {
				commands: [
					{
						'command': 'sampleView.refresh',
						'title': 'Refresh Items',
					},
				],
				views: {
					explorer: [{ 'id': 'sampleView', 'name': 'Sample View' }],
				},
				menus: {
					'view/title': [
						{
							'command': 'sampleView.refresh',
							'when': 'view == sampleView',
							'group': 'navigation',
						},
					],
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
			`import { window, TreeDataProvider, TreeItem, EventEmitter, Event, commands, ExtensionContext } from 'jsr:@typed/vscode@^1.101.0';\n\nclass Node extends TreeItem {\n  constructor(label: string) {\n    super(label);\n  }\n}\n\nclass SimpleProvider implements TreeDataProvider<Node> {\n  private readonly _onDidChangeTreeData = new EventEmitter<Node | undefined>();\n  readonly onDidChangeTreeData: Event<Node | undefined> = this._onDidChangeTreeData.event;\n  getTreeItem(element: Node) {\n    return element;\n  }\n  getChildren(): Node[] {\n    return [new Node('Item 1'), new Node('Item 2')];\n  }\n}\n\nexport function activate(ctx: ExtensionContext) {\n  const provider = new SimpleProvider();\n  window.createTreeView('sampleView', { treeDataProvider: provider });\n  const refresh = commands.registerCommand('sampleView.refresh', () => provider['_onDidChangeTreeData'].fire(undefined));\n  ctx.subscriptions.push(refresh);\n}\n\nexport function deactivate() {}\n`;

		await writeAllText(join(srcDir, 'extension.ts'), extensionCode);

		ctx.log('Treeview template generated');
	},
};

export default template;
