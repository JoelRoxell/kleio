## Kleio
[![Build Status](https://travis-ci.org/JoelRoxell/Kleio.svg?branch=master)](https://travis-ci.org/JoelRoxell/Kleio)

Kleio is a minimal logger used to simplify debugging and error management during the development as well as production phase. Depending on `env` Kleio either logs to console or to a remote host.

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


## Methods
#### `record(description, level, stacktrace, data, cb)`

Collects log information and sends it to console and/or the specified external service, depending on `env` configuration.

```javascript
kleio.record(
  'Log description',
  Kleio.levels.ERROR,
  new Error('A stacktrace').stack,
  optionalData,
  cb
)
```

## Installation
`npm install kleio --save`

## Tests

`npm test`

## API Reference
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
