import { join } from '@std/path';
import { assert, assertEquals } from '@std/assert';
import { scaffoldProject } from '../mod.ts';

Deno.test('scaffoldProject creates README in basic template', async () => {
	const tmp = await Deno.makeTempDir();

	await scaffoldProject({
		projectDir: tmp,
		template: 'basic',
		nocolor: true,
	});

	const readmePath = join(tmp, 'README.md');
	const content = await Deno.readTextFile(readmePath);
	assert(content.includes('Generated with @vsce/create'));

	// Template should preserve default project name when none supplied
	assertEquals(content.startsWith('# my-extension'), true);
});
