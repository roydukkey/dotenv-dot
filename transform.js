(function () {
	require('./dist/index').transform(
		undefined,
		Object.assign({},
			require('dotenv/lib/env-options'),
			require('dotenv/lib/cli-options')(process.argv)
		)
	);
})();
