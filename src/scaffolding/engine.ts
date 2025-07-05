/**
 * @module engine
 * Core scaffolding logic – resolves templates, validates options and orchestrates file generation.
 */

import { resolve } from '@std/path';
import { existsSync } from '@std/fs';
import * as colors from '@std/fmt/colors';
import { Logger } from '../utils/log.ts';
import type { ScaffoldOptions, TemplateDefinition } from '../types.ts';

/**
 * Main entry used by external callers to scaffold a new VS Code extension
 * project. Responsible for: resolving the requested template, validating
 * options, invoking the template's generator, and printing concise feedback.
 */
export async function scaffoldProject(options: ScaffoldOptions): Promise<void> {
	const logger = new Logger(!options.nocolor);

	const projectDir = resolve(options.projectDir);
	if (
		!options.force && existsSync(projectDir) &&
		Deno.readDirSync(projectDir).next().done === false
	) {
		logger.error(
			`Target directory ${projectDir} is not empty. Use { force: true } to overwrite.`,
		);
		return;
	}

	// Load template metadata/module
	const template = await loadTemplate(options.template, logger);
	if (!template) return;

	// Validate template-specific CLI options
	let validatedOpts: Record<string, unknown>;
	try {
		validatedOpts = template.validate
			? template.validate(options.options ?? {})
			: (options.options ?? {});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		logger.error(`Option validation failed: ${message}`);
		return;
	}

	logger.info(`Scaffolding ${template.name} into ${projectDir}`);

	await template.generate({
		projectDir,
		options: validatedOpts,
		log: (msg, colour = 'green') =>
			logger.info(
				(colors as unknown as Record<string, (s: string) => string>)
					[colour](msg),
			),
	});

	logger.info('✔ Project scaffolded successfully\n');
}

async function loadTemplate(
	id: string,
	logger: Logger,
): Promise<TemplateDefinition | undefined> {
	try {
		const url = new URL(`../templates/${id}/mod.ts`, import.meta.url).href;
		const mod = await import(url);
		const template = mod.default as TemplateDefinition;
		if (!template || typeof template.generate !== 'function') {
			logger.error(
				`Template '${id}' is invalid – missing default export or generate()`,
			);
			return undefined;
		}
		return template;
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		logger.error(`Failed to load template '${id}': ${message}`);
		return undefined;
	}
}
