## Kleio [![Build Status](https://travis-ci.org/JoelRoxell/Kleio.svg?branch=master)](https://travis-ci.org/JoelRoxell/Kleio)

Kleio is a functional logger which purpose is to simplify debugging and error management during production and development phases. In essence kleio provides the common error-level/severity system based on `npm` logging levels. The goal of kleio is to provide a simple and efficient API to quickly send debugging information to a remote host.

## Installation
`npm install kleio --save`

## Usage
> Note that the logger is invoked when last parameter has be acquired passed.

### Create a reusable functional logger
```javascript
let log = kleio(/* post implementation */)(/* environment */);

log(/* message */)(/* severity */)(/* meta-data */);
// Or
log(/* message */, /* severity */, /* meta-data */);
```

### Simple example
```javascript
import kleio, { LEVELS } from 'kleio';

const postFunction = function(log) {
  fetch('/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(log)
  });
}

let log = kleio(postFunction)(process.env.NODE_ENV);

log('Hello log!')(LEVELS.ERROR)({
  'some': 'additional data that might be valuable.'
});

log('A test log')(LEVELS.DEBUG)();

log('Perform something after post')(LEVELS.ERROR)()
  .then(res => { /* ... */ });
  .catch(err => { /* ... */ });
```

### A more advanced use case
```javascript
// services/log.js
import { _ } from 'ramda';
import kleio, { LEVELS } from 'kleio';

const env = process.env.NODE_ENV || 'development';

const developmentLogger = kleio(env)(_);
const productionLogger = kleio(env)(function(log) {
  return fetch('/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(log)
  }).then(checkStatus);
});

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return Promise.reject(response);
  }
}

export const error = productionLogger(LEVELS.ERROR);
export const warn = productionLogger(LEVELS.WARN);
export const log = developmentLogger(LEVELS.SILLY);
export const info = developmentLogger(LEVELS.INFO);
export const debug = developmentLogger(LEVELS.DEBUG);
export const verbose = developmentLogger(LEVELS.VERBOSE);

// antoher-file.js
import { log, error, info, debug, verbose } from 'services/log';

log('A silly log', 1339);

error('Error message', {}).then(function(res) {
    /* ... */
  })
  .catch(function(e) {
    /* ... */
  });

info('Info message', 123);

debug('Debug message', {
  x: 10
});

verbose('Verbose', [
  {
    x: 10
  },
  {
    x: 20
  }
]);
```

#### Post directly
```javascript
import kleio from 'kleio';

kleio(
  /* post implementation */,
  /* environment */,
  /* message */,
  /* severity */,
  /* meta-data */
).then(res => { /* ... */}).catch(err => { /* ... */});

// or

kleio(/* post implementation */)
  (/* environment */)
  (/* message */)
  (/* severity */)
  (/* meta-data */)
  .then(res => { /* ... */})
  .catch(err => { /* ... */});
```

### Log object
Posted to the remote server and/or local storage.
```javascript
Log {
  time: String,
  message: String,
  severity: Number,
  meta: Object
}
```

### Log levels
Levels are defined using integer values 0(high) to 6(low).
```javascript
{
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  VERBOSE: 3,
  DEBUG: 4,
  SILLY: 5,
  SILENT: 6
}
```

## Tests
`npm test`


## License
MIT
