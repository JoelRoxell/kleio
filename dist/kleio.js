'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEVELS = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LEVELS = exports.LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  VERBOSE: 3,
  DEBUG: 4,
  SILLY: 5,
  SILENT: 6
};

/**
 * Creates log entry object
 * @param  {String} message  Log messge.
 * @param  {Number} severity Integer describing the error level.
 * @param  {mixed}  meta     Optional meta data that might be valuable during debugging.
 * @return {Object}          Comprised log obejct.
 */
function createEntry(message, severity, meta) {
  if (typeof message !== 'string') {
    throw new Error('parameter message must be of type string, not ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)));
  }

  return {
    time: new Date().toISOString(),
    message: message,
    severity: severity,
    meta: meta
  };
}

/**
 * Prints log message to console, used in development environments.
 * @param  {String} message  Log messge.
 * @param  {Number} severity Integer describing the error level.
 * @param  {mixed}  meta     Optional meta data that might be valuable during debugging.
 */
function consoleLog(message, severity, meta) {
  var ERROR = LEVELS.ERROR,
      WARN = LEVELS.WARN,
      INFO = LEVELS.INFO,
      VERBOSE = LEVELS.VERBOSE,
      DEBUG = LEVELS.DEBUG,
      SILLY = LEVELS.SILLY,
      SILENT = LEVELS.SILENT;


  switch (severity) {
    case ERROR:
      console.error(message, meta);
      break;

    case WARN:
      console.warn(message, meta);
      break;

    case INFO:
      console.info(message, meta);
      break;

    case VERBOSE:
      console.log(message);
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
      console.log(message, meta);
  }
}

/**
 * Logger.
 * @param  {String} env       Environment variable, (development|production)
 * @param  {Function} post    Callback used to post log to remote server, only called in prodcution.
 * @param  {Number} severity  Integer describing the error level.
 * @param  {String} message   Log description.
 * @param  {mixed}  meta      Optional meta data that might be valuable during debugging.
 * @return {Promise|Function} Use this if additional tasks or error managments must be performed after a log entry.
 */
function core(env, post, severity, message, meta) {
  if (env === 'production') {
    try {
      var payload = createEntry(message, severity, meta);

      return post(payload);
    } catch (e) {
      return Promise.reject(e);
    }
  } else if (env === 'development') {
    consoleLog(message, severity, meta);
  }
}

var log = _ramda2.default.curry(core);

exports.default = log;