const dotenvDot = require('dotenv-dot').transform;
const dotenvDotDefault = require('dotenv-dot').default;

const config = require('dotenv').config({
	path: './test/.env.test'
});


/**
 * Mock `process.env` before each test, and restore it once all tests have completed.
 */
const STARTING_ENV = process.env;

beforeEach(() => {
	process.env = { ...STARTING_ENV };
});

afterAll(() => {
	process.env = STARTING_ENV;
});


/**
 * Test NodeRequire
 */
describe('\'dotenv-dot\' module', () => {

	test('provides `.transform()` and `.default()`', () => {
		expect(dotenvDot).toBe(dotenvDotDefault);
	});

});


/**
 * Test empty signature
 */
describe('[1] dotenvDot()', () => {
	global.testSignature(dotenvDot, undefined, undefined, config);
});


/**
 * Test config output signature
 */
describe('[2] dotenvDot(DotenvConfigOutput)', () => {
	global.testSignature(dotenvDot, config, undefined);
});


/**
 * Test parsed output signature
 */
describe('[3] dotenvDot(DotenvParseOutput)', () => {
	global.testSignature(dotenvDot, config.parsed, undefined);
});


/**
 * Test parsed output and options signature
 */
describe('[4] dotenvDot(DotenvParseOutput, DotenvDotParseOptions)', () => {

	describe('{ }', () => {
		global.testSignature(dotenvDot, config.parsed, {});
	});

	describe('{ debug: false }', () => {
		global.testSignature(dotenvDot, config.parsed, { debug: false });
	});

	describe('{ debug: true }', () => {
		global.testSignature(dotenvDot, config.parsed, { debug: true });
	});

});


/**
 * Test config output and options signature
 */
describe('[5] dotenvDot(DotenvConfigOutput, DotenvDotConfigOptions)', () => {

	describe('{ }', () => {
		global.testSignature(dotenvDot, config, {});
	});

	describe('{ debug: false }', () => {
		global.testSignature(dotenvDot, config, { debug: false });
	});

	describe('{ debug: true }', () => {
		global.testSignature(dotenvDot, config, { debug: true });
	});

	describe('{ ignoreProcessEnv: false }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: false });
	});

	describe('{ ignoreProcessEnv: false, debug: false }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: false, debug: false });
	});

	describe('{ ignoreProcessEnv: false, debug: true }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: false, debug: true });
	});

	describe('{ ignoreProcessEnv: true }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: true });
	});

	describe('{ ignoreProcessEnv: true, debug: false }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: true, debug: false });
	});

	describe('{ ignoreProcessEnv: true, debug: true }', () => {
		global.testSignature(dotenvDot, config, { ignoreProcessEnv: true, debug: true });
	});

});


/**
 * Test other transformation results
 */
describe('DotenvDotOutput', () => {

	// Since we are not supporting index-notation, test that the library still supports dot-notation arrays.
	test('dot-notation arrays are supported', () => {
		const result = dotenvDot({
			'things.0': 'Was eaten by his others',
			'things.1': 'Thing One',
			'things.3': 'Wayward Thing Two'
		});

		expect(Array.isArray(result.things)).toBe(true);
		expect(result.things[0]).toBe('Was eaten by his others');
		expect(result.things[1]).toBe('Thing One');
		expect(result.things[2]).toBeUndefined();
		expect(result.things[3]).toBe('Wayward Thing Two');
	});

});
