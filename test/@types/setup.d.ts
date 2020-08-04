declare namespace NodeJS {
	export interface Global {

		OVERRIDE: string;
		NO_OVERRIDE: string;

		LOG_PARSED: string;
		LOG_ENV: string;

		ENV_KEY_NEW: string;
		ENV_KEY_ABSENT: string;
		ENV_NO_OVERRIDE: string;

		CONFIG_KEY_NEW: string;
		CONFIG_KEY_ABSENT: string;
		CONFIG_NO_OVERRIDE: string;
		CONFIG_LOG: string;
		CONFIG_NO_LOG: string;

		BOTH_LOG: string;
		BOTH_NO_LOG: string;

		PARSED_KEY_NEW: string;
		PARSED_NO_OVERRIDE: string;
		PARSED_LOG: string;
		PARSED_NO_LOG: string;

		testSignature: (module: dotenvDot, output?: DotenvConfigOutput | DotenvParseOutput, options?: DotenvDotConfigOptions, dotenvOutput?: DotenvConfigOutput | DotenvParseOutput) => void;

	}
}

interface dotenvDot {
	(): void;
	(configOrParsedOutput: DotenvConfigOutput | DotenvParseOutput): void;
	(parsedOutput: DotenvParseOutput, options: DotenvDotParseOptions): void;
	(configOutput: DotenvConfigOutput, options: DotenvDotConfigOptions): void;
}

interface DotenvConfigOutput {
	error?: Error;
	parsed?: DotenvParseOutput;
}

interface DotenvParseOutput {
	[name: string]: string;
}

interface DotenvDotParseOptions {
	debug?: boolean
}

interface DotenvDotConfigOptions extends DotenvDotParseOptions {
	ignoreProcessEnv?: boolean
}
