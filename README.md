## Clio

Clio is a minimal logger used to simplify debugging and error management during the development as well as production phase. Depending on `env` Clio either logs to console or to a remote host.

## Code Example

### Instantiation
```javascript
import Clio from 'clio';

const clio = new Clio('http://remote.server:8080');
```

### Provide a custom post method
```javascript
import Clio from 'clio';

const clio = new Clio('https://remote.server/log', log => {
  // Post implementation...
});
```


## Methods
#### `record(description, level, stacktrace, data)`

Collects log information and sends it to console and/or the specified external service, depending on `env` configuration.

```javascript
clio.record(
  'Log description',
  new Error('A stacktrace').stack,
  Clio.levels.ERROR,
  optionalData
)
```

## Installation
`npm install clio --save`

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

## Tests

`npm test`

## License

MIT
