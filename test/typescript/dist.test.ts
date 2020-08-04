// Default import
import dotenvDot from 'dotenv-dot';
import * as dotenv from 'dotenv';

// Auto-import
import 'dotenv/config';
const STARTING_ENV = process.env;
import 'dotenv-dot/transform';


/**
 * Test the distribution module
 */
describe('\'dotenv-dot\' module', () => {

	test('provides the \'transform\' auto-import', () => {
		expect(process.env.DOT_NOTATION_NO_OVERRIDE).toBe(global.NO_OVERRIDE);
		expect(process.env.DOT_NOTATION).toBe(global.OVERRIDE);

		process.env = STARTING_ENV;
	});

	test('provides default import', () => {
		process.env = { ...STARTING_ENV };

		const config = dotenv.config({
			path: './test/.env.test'
		});

		dotenvDot();

		expect(process.env.DOT_NOTATION_NO_OVERRIDE).toBe(global.NO_OVERRIDE);
		expect(process.env.DOT_NOTATION).toBe(global.OVERRIDE);
		expect(config.parsed.DOT_NOTATION_NO_OVERRIDE).toBe(global.NO_OVERRIDE);
		expect(config.parsed.DOT_NOTATION).toBeUndefined();

		process.env = STARTING_ENV;
	});

});
