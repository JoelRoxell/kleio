## Kleio
[![Build Status](https://travis-ci.org/JoelRoxell/Kleio.svg?branch=master)](https://travis-ci.org/JoelRoxell/Kleio)

Kleio is a functional logger which purpose is to simplify debugging and error management in production and development phases. In essence kleio provides the common error-level/severity system based on `npm` logging levels and the simplicity to quickly post debugging information to a remote host.

## Installation
`npm install kleio --save`

## Usage
> Note that the logger is invoked when last parameter has be acquired passed.

### Create a functional logger which can be used multiple times
```javascript
let log = kleio(/* post implementation */)(/* environment */);

log(/* message */)(/* severity */)(/* meta-data */);
// Or
log(/* message */, /* severity */, /* meta-data */);
```

## Example
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
//
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
