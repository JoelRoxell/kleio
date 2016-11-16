import R from 'ramda';

export const LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  VERBOSE: 3,
  DEBUG: 4,
  SILLY: 5,
  SILENT: 6
};

function createEntry(message, severity, meta) {
  if (typeof message !== 'string') {
    throw new Error(`parameter message must be of type string, not ${typeof message}`);
  }

  return {
    time: new Date().toISOString(),
    message,
    severity,
    meta
  };
}

function consoleLog(message, severity, meta) {
  const { ERROR, WARN, INFO, VERBOSE, DEBUG, SILLY, SILENT } = LEVELS;

  switch (severity) {
    case ERROR:
      console.error(message);
      break;

    case WARN:
      console.warn(message);
      break;

    case INFO:
      console.info(message);
      break;

    case VERBOSE:
      console.log(message);
      console.log(meta);
      console.table(meta);
      break;

    case DEBUG:
      console.log(message);
      console.debug(meta);
      break;

    case SILENT:
      break;

    case SILLY:
    default:
      console.log(message);
  }
}

function core(env, post, message, severity, meta) {
  if (env === 'production') {
    return new Promise(function(resolve, reject) {
      try {
        const payload = createEntry(message, severity, meta);

        resolve(post(payload));
      } catch (e) {
        reject(e);
      }
    });
  } else if (env === 'development') {
    consoleLog(message, severity, meta);
  }
}

const log = R.curry(core);

export default log;
