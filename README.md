## kleio [![Build Status](https://travis-ci.org/JoelRoxell/Kleio.svg?branch=master)](https://travis-ci.org/JoelRoxell/Kleio)

Functional logger which purpose is to simplify debugging and error management during production and development phases. In essence kleio provides the common error-level/severity system based on `npm` logging levels. Kleio provides a simple and minimal API in order to send debugging information to a remote host with ease.

## Installation
`npm install kleio --save`

## Usage
> Note: The logger is invoked when last parameter has be acquired.

### Create a reusable functional logger
```javascript
let log = kleio(/* environment */)(/* post implementation */);

log(/* message */)(/* severity */)(/* meta-data */);
// Or
log(/* message */, /* severity */, /* meta-data */);
```

### Log object
Passed to the `post` function parameter.
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

### A simple use case
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

let log = kleio(process.env.NODE_ENV)(postFunction);

log(LEVELS.ERROR)('Hello log!')({
  'some': 'additional data that might be valuable.'
});

log(LEVELS.DEBUG)('A test log')();

log(LEVELS.ERROR)('Perform something after post')()
  .then(res => { /* ... */ });
  .catch(err => { /* ... */ });
```

### A more advanced use case
```javascript
// services/log.js
import kleio, { LEVELS } from 'kleio';

const env = process.env.NODE_ENV || 'development';

const developmentLogger = kleio(env)(function(log) {
  return fetch('/log/to/development/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(log)
  }).then(checkStatus);
});
const productionLogger = kleio(env)(function(log) {
  return fetch('/log/to/production/server', {
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

error('Error message', { /* ... */ }).then(function(res) {
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

## Tests
`npm test`


## License
MIT
