# dotenv-dot

<img src="https://roydukkey.github.io/assets/images/dotenv-dot.png" alt="dotenv-dot" align="right" />

Dotenv-dot adds dot-notation variable transformation on top of [dotenv](http://github.com/motdotla/dotenv). If you find yourself needing to condense environment variables into JSON variables, then dotenv-dot is your tool.

[![Release Version](https://img.shields.io/npm/v/dotenv-dot.svg)](https://www.npmjs.com/package/dotenv-dot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


## Install

```bash
npm install dotenv --save
npm install dotenv-dot --save
```


## Usage

Dot-notation variables are those which contain a dot (.) in their name. Add dot-notation variables to the `.env` file like any other variable.

```dosini
MAIL_CONFIG.service=gmail
MAIL_CONFIG.auth.user=noreply@domain.com
MAIL_CONFIG.auth.pass=pass1234
```

Once the dotenv-dot transformer is executed, these variables will be condensed into a new variable named `MAIL_CONFIG`.

```dosini
MAIL_CONFIG='{"service":"gmail","auth":{"user":"noreply@domain.com","pass":"pass1234"}}'
```

#### Transform `process.env` variables

As early as possible in your application, require dotenv and dotenv-dot. Then, execute dotenv-dot after dotenv.

```js
const dotenv = require('dotenv');
const dotenvDot = require('dotenv-dot').transform;

const myEnv = dotenv.config();
const results = dotenvDot(); // only updates `process.env`
```

#### Transform `process.env` and the results of `dotenv.config()`

If you want to update `process.env` and the output of the `dotenv.config()`, include the output as a parameter on the dotenv-dot transformer.

```js
const myEnv = dotenv.config();
const results = dotenvDot(myEnv); // updates `process.env` and `myEnv`
```

#### Transform variables without affecting `process.env`

It is possible to use dotenv without adding variables to `process.env`. Dotenv-dot can also do the same.

```js
const parsedOutput = dotenv.parse(`MAIL_CONFIG.service=gmail
MAIL_CONFIG.auth.user=noreply@domain.com
MAIL_CONFIG.auth.pass=pass1234`);

const results = dotenvDot(parsedOutput);
```

If you already have parsed output you may transform it without using dotenv.

```js
const results = dotenvDot({
  'MAIL_CONFIG.service': 'gmail',
  'MAIL_CONFIG.auth.user': 'noreply@domain.com'
  'MAIL_CONFIG.auth.pass': 'pass1234'
});
```


### Options

##### debug

Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as expected.

```js
const myEnv = dotenv.config();

require('dotenv-dot').transform(myEnv, {
  debug: process.env.DEBUG
});
```

##### ignoreProcessEnv

Default: `false`

You may want to ignore `process.env` when transforming the output of the `dotenv.config()`. When this option is turned on `process.env` will not be consulted or altered.

```js
const myEnv = dotenv.config();

require('dotenv-dot').transform(myEnv, {
  ignoreProcessEnv: true
});
```


### How do I use dotenv-dot with `import`?

```js
import * as dotenv from 'dotenv';
import dotenvDot from 'dotenv-dot';
```

Or, if only intending to access `process.env`, the two modules should be loading in this order using their auto-imports:

``` js
import 'dotenv/config';
import 'dotenv-dot/transform';
```

More information about the `import` syntax is available on the [dotenv repository](https://github.com/motdotla/dotenv/blob/master/README.md#how-do-i-use-dotenv-with-import).

*Note:* You may set the `debug` option using the dotenv debug [command line or environment variable](https://github.com/motdotla/dotenv/blob/master/README.md#preload). The `ignoreProcessEnv` option is irrelevant when using the auto-imports.


### How do I add arrays to the `.env` file?

Arrays are added by using numbers to indicate the value's index in the resulting array.

```dosini
THINGS.0='Was eaten by his others'
THINGS.1='Thing One'
THINGS.3='Wayward Thing Two'
```
