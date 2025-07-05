/**
 * Shared type definitions for @vsce/create.
 */

/**
 * Options accepted by the top-level `scaffoldProject` API.
 */
export interface ScaffoldOptions {
	/** Absolute path of the directory to create. */
	projectDir: string;
	/** Selected template id (e.g. "basic", "treeview"). */
	template: string;
	/** Arbitrary template-specific options gathered from prompts or CLI flags. */
	options?: Record<string, unknown>;
	/** Overwrite existing files if the dir is not empty. */
	force?: boolean;
	/** Disable coloured log output. */
	nocolor?: boolean;
}

/**
 * Shape every template module must export.
 */
export interface TemplateDefinition {
	id: string;
	name: string;
	description: string;
	/**
	 * Validate/normalise user-supplied options.
	 */
	validate?(opts: Record<string, unknown>): Record<string, unknown>;
	/**
	 * Generate files/directories inside the target path.
	 */
	generate: (ctx: GenerateContext) => Promise<void> | void;
}

export interface GenerateContext {
	projectDir: string;
	options: Record<string, unknown>;
	log: (msg: string, color?: 'green' | 'cyan' | 'yellow' | 'red') => void;
}
