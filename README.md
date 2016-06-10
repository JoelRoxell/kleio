## Kleio
[![Build Status](https://travis-ci.org/JoelRoxell/Kleio.svg?branch=master)](https://travis-ci.org/JoelRoxell/Kleio)

Kleio is a minimal client side logger with the purpose to simplify debugging and error management during production as well as development phases. In essence Klio provides a common error-level system based on `npm` logging levels and the simplicity to quickly post debugging information to a remote host.

## Installation
`npm install kleio --save`

## Tests

`npm test`

## Code Example

### Instantiation
```javascript
import Kleio from 'kleio';

const kleio = new Kleio('http://remote.server:8080');
```

### Provide a custom post method
```javascript
import Kleio from 'kleio';

const kleio = new Kleio('https://remote.server/log', log => {
  // Post implementation...
});
```

## API Reference

### Environment
Define environment by using either `process.env` or `Kleio.ENV_MODES`
```javascript
const kleio = new Kleio('http://remote.server:8080', Kleio.ENV_MODES.PROD);
```

```javascript
  ENV_MODES: {
  PROD: 'PROD',
  DEV: 'DEV',
  SILENT: 'SILENT'
}
```

### Methods
#### `record(title, description, level, stacktrace, data, cb)`

Collect information and send it to console and/or the specified external service, depending on `env` configuration.

```javascript
kleio.record(
  'Log title',
  'Log description',
  Kleio.levels.ERROR,
  new Error('A stacktrace').stack,
  optionalData,
  cb
)
```

### Log model
Posted to the remote server and/or local storage.
```javascript
Log {
  title: String,
  description: String,
  stackTrace: String,
  level: Number,
  data: Object
}
```

### Log levels
Levels are defined using integer values 0(high) to 5(low).
```javascript
{
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  VERBOSE: 3,
  DEBUG: 4,
  SILLY: 5
}
```

## License

MIT
