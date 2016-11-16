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
    return new Promise(function (resolve, reject) {
      try {
        var payload = createEntry(message, severity, meta);

        resolve(post(payload));
      } catch (e) {
        reject(e);
      }
    });
  } else if (env === 'development') {
    consoleLog(message, severity, meta);
  }
}

var log = _ramda2.default.curry(core);

exports.default = log;