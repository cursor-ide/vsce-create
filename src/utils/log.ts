import * as colors from '@std/fmt/colors';

/**
 * Simple colour-aware logger used internally by @vsce/create.
 */
type Colour = 'green' | 'cyan' | 'yellow' | 'red';

export class Logger {
	private readonly useColor: boolean;

	constructor(useColor = true) {
		this.useColor = useColor;
	}

	info(msg: string, colour: Colour = 'cyan'): void {
		console.log(this.colourize(msg, colour));
	}

	warn(msg: string): void {
		console.warn(this.colourize(msg, 'yellow'));
	}

	error(msg: string): void {
		console.error(this.colourize(msg, 'red'));
	}

	private colourize(msg: string, colour: Colour): string {
		if (!this.useColor) return msg;
		const fn = (colors as unknown as Record<string, (s: string) => string>)[
			colour
		];
		return fn ? fn(msg) : msg;
	}
}
