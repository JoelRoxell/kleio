'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logLevels = require('./models/log-levels');

var _logLevels2 = _interopRequireDefault(_logLevels);

var _log = require('./models/log');

var _log2 = _interopRequireDefault(_log);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line

/**
 * Core class which provides simplified logging capabilities.
 */

var Clio = function () {
  /**
   * Constructor
   *
   * @param  {String} socket comprised hostname.
   * @param  {String} env environment configuration.
   * @param  {Function} postMethod Allow send method to be replaced.
   */

  function Clio() {
    var socket = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var env = arguments.length <= 1 || arguments[1] === undefined ? 'dev' : arguments[1];
    var postMethod = arguments[2];

    _classCallCheck(this, Clio);

    this._id = _crypto2.default.randomBytes(8).toString('hex');
    this._env = env;

    Object.assign(this, this._splitHostFromPath(socket));

    // Allow server function to be replaced.
    this._postMethod = typeof postMethod === 'function' ? postMethod : this._defaultPostMethod;
  }

  _createClass(Clio, [{
    key: '_splitHostFromPath',


    /**
     * Splits the domain name from port number.
     * @param  {String} socket socket specification
     *
     * @return {Array} Array of the "divided" socket.
     */
    value: function _splitHostFromPath(socket) {
      var hostConfig = null,
          host = null,
          port = null;

      if (typeof socket !== 'string') {
        throw new Error('Passted socket configuration must be of type string');
      }

      hostConfig = socket.split(':');
      port = parseInt(hostConfig.pop(), 10);
      host = hostConfig.join(':');

      if (typeof host !== 'string' || typeof port !== 'number') {
        throw new Error('Invalid host string was passed.');
      }

      return {
        _host: host,
        _port: parseInt(port, 10)
      };
    }

    /**
     * Default post method used to send log object to an external service,
     * may be overriden in constructor.
     *
     * @param  {Log}      log object.
     * @param  {Function} cb  callback.
     *
     * @return {Object}   payload sent to server.
     */

  }, {
    key: '_defaultPostMethod',
    value: function _defaultPostMethod(log, cb) {
      var payload = JSON.stringify(log);

      try {
        fetch(this._host + ':' + this._port, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: payload
        }).then(function (res) {
          if (typeof cb === 'function') {
            cb(null, res);
          }
        }).catch(function (err) {
          if (typeof cb === 'function') {
            cb(err);
          }
        });
      } catch (e) {
        throw e;
      }

      return payload;
    }

    /**
     * Prints log model information to console.
     *
     * @param  {Log} log object
     */

  }, {
    key: '_print',
    value: function _print(log) {
      var levels = Clio.levels;

      switch (log.level) {
        case levels.ERROR:
          console.error(log.description, log);
          break;
        case levels.WARN:
          console.warn(log.description, log);
          break;
        case levels.INFO:
          console.info(log.description, log);
          break;
        case levels.VERBOSE:
          console.log(log.description, log);
          break;
        case levels.DEBUG:
          console.debug(log.description, log);
          break;
        default:
          throw new Error('A log level must be provided');
      }
    }
  }, {
    key: '_store',
    value: function _store() {}
    // TODO: Store log in localstorage.


    /**
     * Recoreds the current description, depending on the initial configuration the item will either be sent to console, server and/or localstorage.
     *
     * @param  {String} description Description of the error or general information of the specific dunction body.
     * @param  {Number} level Error level identification.
     * @param  {String} stacktrace Current stacktrace
     * @param  {Object} data JOSN-object with additional data.
     * @param  {Funciton} cb callback
     *
     * @return {Log} The created log issue.
     */

  }, {
    key: 'record',
    value: function record() {
      var description = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var level = arguments.length <= 1 || arguments[1] === undefined ? Clio.levels.DEBUG : arguments[1];
      var stacktrace = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var data = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
      var cb = arguments[4];

      var log = new _log2.default(description, level, stacktrace, data);

      if (this._env === Clio.ENV_MODES.PROD) {
        this._postMethod(log, cb);
      } else {
        this._print(log);
      }

      return log;
    }
  }, {
    key: 'host',
    get: function get() {
      return this._host;
    }
  }, {
    key: 'port',
    get: function get() {
      return this._port;
    }
  }, {
    key: 'levels',
    get: function get() {
      return this._levels;
    }
  }]);

  return Clio;
}();

Clio.levels = _logLevels2.default;
Clio.ENV_MODES = _config2.default.ENV_MODES;

exports.default = Clio;