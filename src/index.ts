import { DotenvConfigOutput, DotenvParseOutput } from 'dotenv/types';
import * as dotObject from 'dot-object';


/**
 * Options for transforming 'dotenv' parsed output.
 */
export interface DotenvDotParseOptions {
	/**
	 * Whether or not logging is enabled to help debug why certain keys or values are not being set as expected.
	 */
	debug?: boolean
}


/**
 * Options for transforming 'dotenv' config output.
 */
export interface DotenvDotConfigOptions extends DotenvDotParseOptions {
	/**
	 * Whether or not to transform .env variables in `process.env` along side the provided 'dotenv' config.
	 */
	ignoreProcessEnv?: boolean
}


/**
 * An object representation of the variables that were successfully transformed and condensed.
 */
export interface DotenvDotOutput {
	[name: string]: unknown;
}


/**
 * Transform dot-notation .env variables in {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} into condensed JSON variables.
 *
 * @returns An object representation of the variables that were successfully transformed and condensed
 */
export function transform (): DotenvDotOutput;


/**
 * Transform dot-notation .env variables in the specified 'dotenv' config output and {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} into condensed JSON variables.
 *
 * @param configOutput - The 'dotenv' config output which provides dot-notation variable for transformation
 *
 * @returns An object representation of the variables that were successfully transformed and condensed
 */
export function transform (configOutput: DotenvConfigOutput): DotenvDotOutput;


/**
 * Transform dot-notation .env variables in the specified 'dotenv' parsed output into condensed JSON variables.
 *
 * @param parsedOutput - The 'dotenv' parsed output which provides dot-notation variable for transformation
 *
 * @returns An object representation of the variables that were successfully transformed and condensed
 */
export function transform (parsedOutput: DotenvParseOutput): DotenvDotOutput;


/**
 * Transform dot-notation .env variables in the specified 'dotenv' parsed output into condensed JSON variables.
 *
 * @param parsedOutput - The 'dotenv' parsed output which provides dot-notation variable for transformation
 * @param options - The options for transforming 'dotenv' parsed output
 *
 * @returns An object representation of the variables that were successfully transformed and condensed
 */
export function transform (parsedOutput: DotenvParseOutput, options: DotenvDotParseOptions): DotenvDotOutput;


/**
 * Transform dot-notation .env variables in the specified 'dotenv' config output and {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} into condensed JSON variables.
 *
 * @param configOutput - The 'dotenv' config output which provides dot-notation variable for transformation
 * @param options - The options for transforming 'dotenv' config output
 *
 * @returns An object representation of the variables that were successfully transformed and condensed
 */
export function transform (configOutput: DotenvConfigOutput, options: DotenvDotConfigOptions): DotenvDotOutput;


/**
 * @internal
 */
export function transform (output?: DotenvConfigOutput | DotenvParseOutput, { debug = false, ignoreProcessEnv = false } = {}): DotenvDotOutput {

	// If output is undefined, ensure `process.env` is transformed.
	if (output === undefined) {
		ignoreProcessEnv = false;
	}

	// Attempt to expose 'dotenv' parsed output from 'dotenv' config output.
	else {
		const keys = Object.keys(output);

		if (keys.length === 1 && keys[0] === 'parsed') {
			output = (output as DotenvConfigOutput).parsed;
		}

		// When a 'dotenv' config has not been provided, ensure `process.env` is ignored.
		else {
			ignoreProcessEnv = true;
		}
	}

	// If output is undefined, used empty object with proper type.
	const confirmedOutput = (output ?? {}) as DotenvParseOutput;

	const source = ignoreProcessEnv ? confirmedOutput : Object.assign({}, confirmedOutput, process.env);
	const dotObjectTarget: DotenvDotOutput = {};

	for (const key in source) {
		if (source.hasOwnProperty(key) && key.includes('.')) {
			dotObject.str(key, source[key], dotObjectTarget);
		}
	}

	Object.keys(dotObjectTarget).forEach((key) => {
		const value = JSON.stringify(dotObjectTarget[key]);

		applyKeyValue(confirmedOutput, key, value, debug, 'parsed');

		if (!ignoreProcessEnv) {
			applyKeyValue(process.env, key, value, debug, 'process.env');
		}
	});

	return dotObjectTarget;

}


/*
 * Alias:
 *   import { transform } from 'dotenvDot';
 * For use in TypeScript projects as:
 *   import dotenvDot from 'dotenvDot';
 */
export default transform;


/**
 * Indicates the context for which a log was issued.
 */
type LogContext = 'process.env' | 'parsed';


/**
 * Apply a key/value pair to the store.
 *
 * @param store - The destination for the new key/value pair
 * @param key - The key which identifies the new value
 * @param value - The value which is identified by the new key
 * @param debug - Whether or not logging is enabled to help debug why certain keys or values are not being set as expected
 * @param context - The context for which a log was issued
 */
function applyKeyValue (store: Record<string, unknown>, key: string, value: string, debug: boolean, context: LogContext): void {
	if (!store.hasOwnProperty(key)) {
		store[key] = value;
	}
	else if (debug) {
		console.log(`[dotenv-dot][DEBUG] "${key}" is already defined in \`${context}\` and will not be overwritten by transformer`);
	}
}
