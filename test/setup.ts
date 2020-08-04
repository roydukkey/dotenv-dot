import { DotenvConfigOutput, DotenvParseOutput } from 'dotenv/types';
import dotenvDot, { DotenvDotConfigOptions } from '../src/index';


global.OVERRIDE = '{"twoLevels":{"username":"address@gmail.com","password":"someFakePassword"},"oneLevel":"This is only one level"}';
global.NO_OVERRIDE = 'Will not override';

global.LOG_PARSED = '[dotenv-dot][DEBUG] "DOT_NOTATION_NO_OVERRIDE" is already defined in `parsed` and will not be overwritten by transformer';
global.LOG_ENV = '[dotenv-dot][DEBUG] "DOT_NOTATION_NO_OVERRIDE" is already defined in `process.env` and will not be overwritten by transformer';

global.ENV_KEY_NEW = 'process.env\t: has new condensed key';
global.ENV_NO_OVERRIDE = 'process.env\t: existing key retains original value';
global.ENV_KEY_ABSENT = 'process.env\t: new condensed key is absent';

global.CONFIG_KEY_NEW = 'config.parsed\t: has new condensed key';
global.CONFIG_KEY_ABSENT = 'config.parsed\t: new condensed key is absent';
global.CONFIG_NO_OVERRIDE = 'config.parsed\t: existing key retains original value';
global.CONFIG_LOG = 'config.parsed\t: log has been issued';
global.CONFIG_NO_LOG = 'config.parsed\t: log has not been issued';

global.BOTH_LOG = 'process.env, config.parsed: logs have been issued';
global.BOTH_NO_LOG = 'process.env, config.parsed: logs have not been issued';

global.PARSED_KEY_NEW = 'parsed\t\t: has new condensed key';
global.PARSED_NO_OVERRIDE = 'parsed\t\t: existing key retains original value';
global.PARSED_LOG = 'parsed\t\t: log has been issued';
global.PARSED_NO_LOG = 'parsed\t\t: log has not been issued';


/**
 * Provides a basic tests for the 'dotenv-dot' module allowing each module parameter to be configured.
 *
 * @param module - The 'dotenv-dot' module to use for testing, ie: 'dist' or 'src'.
 * @param output - The output parameter of the 'dotenv-dot' module.
 * @param options - The options parameter of the 'dotenv-dot' module.
 * @param dotenvOutput - The 'dotenv' config when the 'dotenv-dot' module is using an empty constructor.
 */
global.testSignature = (module: typeof dotenvDot, output?: DotenvConfigOutput | DotenvParseOutput, options?: DotenvDotConfigOptions, dotenvOutput?: DotenvConfigOutput | DotenvParseOutput): void => {

	const { debug, ignoreProcessEnv } = Object.assign({
		debug: false,
		ignoreProcessEnv: output === undefined
			? false
			: !isDotenvConfigOutput(output)
	}, options);

	// Test logging
	test(isDotenvConfigOutput(output)
		? debug
			? !ignoreProcessEnv
				? global.BOTH_LOG
				: global.CONFIG_LOG
			: !ignoreProcessEnv
				? global.BOTH_NO_LOG
				: global.CONFIG_NO_LOG
		: debug
			? global.PARSED_LOG
			: global.PARSED_NO_LOG,
	() => {
		const spy = mockConsoleLog(true);

		module(cloneOutput(output), options);

		const expects = expect(spy);

		if (debug) {
			expects.toHaveBeenCalledTimes(!ignoreProcessEnv ? 2 : 1);
			expects.toHaveBeenCalledWith(global.LOG_PARSED);
			if (!ignoreProcessEnv) {
				expects.toHaveBeenCalledWith(global.LOG_ENV);
			}
		}
		else {
			expects.not.toHaveBeenCalled();
		}

		spy.mockRestore();
	});

	// Test new key on `process.env`
	test(ignoreProcessEnv ? global.ENV_KEY_ABSENT : global.ENV_KEY_NEW, () => {
		const spy = mockConsoleLog(debug);

		module(cloneOutput(output), options);

		const expects = expect(process.env.DOT_NOTATION);

		if (ignoreProcessEnv) {
			expects.toBeUndefined();
		}
		else {
			expects.toBe(global.OVERRIDE);
		}

		spy?.mockRestore();
	});

	// Test existing key retains original value on `process.env`
	test(global.ENV_NO_OVERRIDE, () => {
		const spy = mockConsoleLog(debug);

		module(cloneOutput(output), options);

		expect(process.env.DOT_NOTATION_NO_OVERRIDE).toBe(global.NO_OVERRIDE);

		spy?.mockRestore();
	});

	// Test new key on `config.parsed` and/or `parsed`
	test(isDotenvConfigOutput(output)
		? output === undefined ? global.CONFIG_KEY_ABSENT : global.CONFIG_KEY_NEW
		: global.PARSED_KEY_NEW,
	() => {
		const spy = mockConsoleLog(debug);
		const config = cloneOutput(output);
		const parsed = extractParsed(config, dotenvOutput);

		module(config, options);

		const expects = expect(parsed.DOT_NOTATION);

		if (output === undefined) {
			expects.toBeUndefined();
		}
		else {
			expects.toBe(global.OVERRIDE);
		}

		spy?.mockRestore();
	});

	// Test existing key retains original value on `config.parsed` or `parsed`
	test(isDotenvConfigOutput(output)
		? global.CONFIG_NO_OVERRIDE
		: global.PARSED_NO_OVERRIDE,
	() => {
		const spy = mockConsoleLog(debug);
		const config = cloneOutput(output);
		const parsed = extractParsed(config, dotenvOutput);

		module(config, options);

		expect(parsed.DOT_NOTATION_NO_OVERRIDE).toBe(global.NO_OVERRIDE);

		spy?.mockRestore();
	});

};


function mockConsoleLog (debug: boolean): jest.SpyInstance<void, [unknown?, ...unknown[]]> {
	return debug ? jest.spyOn(console, 'log').mockImplementation() : undefined;
}


function isDotenvConfigOutput (output: DotenvConfigOutput | DotenvParseOutput): boolean {
	return output !== undefined && Object.keys(output)[0] === 'parsed';
}


function cloneOutput<T extends DotenvConfigOutput | DotenvParseOutput> (output: T): T {
	return output === undefined
		? output
		: isDotenvConfigOutput(output)
			? JSON.parse(JSON.stringify(output))
			: { ...output };
}


function extractParsed (output: DotenvConfigOutput | DotenvParseOutput, dotenvOutput?: DotenvConfigOutput | DotenvParseOutput): DotenvParseOutput {
	return ((isDotenvConfigOutput(output) ? output.parsed : output) ?? extractParsed(dotenvOutput)) as DotenvParseOutput;
}

