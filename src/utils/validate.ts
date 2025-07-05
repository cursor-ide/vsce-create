/**
 * Common option validation helpers for template modules.
 *
 * Each template may accept a `projectName` override and potentially other
 * template-specific flags.  This helper ensures the supplied options are of the
 * expected shape and produces a typed result so template generators can rely on
 * correct types without repeating boilerplate checks.
 */

export type CommonTemplateOptions = Record<string, unknown> & {
  /**
   * Optional friendly name for the generated extension / JSR package.
   * If omitted, templates fall back to their internal defaults.
   */
  readonly projectName?: string;
}

/**
 * Validate user-supplied options shared by all templates.
 *
 * Throws an Error with a descriptive message if validation fails.
 */
export function validateCommonOptions(
  opts: Record<string, unknown>,
): Record<string, unknown> {
  const { projectName, ...rest } = opts;

  if (projectName !== undefined && typeof projectName !== "string") {
    throw new Error("'projectName' option must be a string if provided");
  }

  const unknownKeys = Object.keys(rest);
  if (unknownKeys.length) {
    throw new Error(`Unknown option(s): ${unknownKeys.join(", ")}`);
  }

  return { projectName };
}
