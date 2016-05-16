## Clio

Clio is a lightweight and minimal logger used to simplify debugging and error management during the development phase as well as in production. Depending on `process.env.mode` Clio either logs to console or to a remote host.

## Code Example

### Instantiation
```javascript
const Clio = require('clio').loader({
  host: 'http://remoteServer:8080',
  env: process.env.mode,
  localStorage: true
})
```

### Record an error
```javascript
Clio.record(
  'Title',
  'description',
  new Error('Some critical error occurred somewhere'),
  Clio.level.ERROR,
  optionalData,
  (err, res) => { /* ... */ }
)
```

(TODO: more examples)

## Installation

// TODO

## API Reference
### Log model
Posted to the remote server and/or local storage.
```javascript
Log {
  title: String,
  description: String,
  stackTrace: Error,
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

### Methods
// TODO

## Tests

`npm test`

## License

MIT
