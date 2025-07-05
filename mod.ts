/**
 * @module @vsce/create
 *
 * Deno-native scaffolding engine for VS Code extensions.
 * This module exposes the **stable** programmatic API used by higher-level
 * tooling such as `@vsce/cli`. End-users are encouraged to consume the CLI; the
 * functions here are intended for advanced automation and testing.
 */

export { scaffoldProject } from './src/scaffolding/engine.ts';
export type { ScaffoldOptions, TemplateDefinition } from './src/types.ts';
