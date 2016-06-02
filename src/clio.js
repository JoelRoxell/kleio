import levels from 'models/log-levels';
import Log from 'models/log';
import crypto from 'crypto';
import { config } from '../config';

/**
 * Core class which provides simplified logging capabilities.
 */
class Clio {
  /**
   * Constructor
   *
   * @param  {String} socket comprised hostname.
   * @param  {String} env environment configuration.
   * @param  {Function} postMethod Allow send method to be replaced.
   */
  constructor(socket = '', env = 'dev', postMethod) {
    this._id = crypto.randomBytes(8).toString('hex');
    this._env = env;

    Object.assign(this, this._splitHostFromPath(socket));

    // Allow server function to be replaced.
    this._postMethod = typeof postMethod === 'function' ?
      postMethod : this._defaultPostMethod;
  }

  get host() {
    return this._host;
  }

  get port() {
    return this._port;
  }

  get levels() {
    return this._levels;
  }

  /**
   * Splits the domain name from port number.
   * @param  {String} socket socket specification
   *
   * @return {Array} Array of the "divided" socket.
   */
  _splitHostFromPath(socket) {
    let hostConfig = null,
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
   * Send the passed log object to an external service.
   *
   * @param  {Log}   log object.
   * @param  {Function} postMethod use the post function specified by constructor.
   * @param  {Function} cb  callback.
   */
  _sendWrapper(log, postMethod, cb) {
    postMethod(log, cb);
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
  _defaultPostMethod(log, cb) {
    const payload = JSON.stringify(log);

    fetch(this._host, 'POST', {
      body: JSON.stringify(log)
    }).then(res => {
      if (typeof cb === 'function') {
        cb(null, res);
      }
    }).catch(err => cb(err));

    return payload;
  }

  /**
   * Prints log model information to console.
   *
   * @param  {Log} log object
   */
  _print(log) {
    const levels = Clio.levels;

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

  _store() {
    // TODO: Store log in localstorage.
  }

  /**
   * Recoreds the current description, depending on the initial configuration the item will either be sent to console, server and/or localstorage.
   *
   * @param  {String} description Description of the error or general information of the specific dunction body.
   * @param  {Number} level Error level identification.
   * @param  {String} stacktrace Current stacktrace
   * @param  {Object} data JOSN-object with additional data.
   *
   * @return {Log} The created log issue.
   */
  record(
    description = '',
    level = Clio.levels.DEBUG,
    stacktrace = {},
    data = {}
  ) {
    const log = new Log(description, level, stacktrace, data);

    if (this._env === Clio.ENV_MODES.PROD) {
      this._postMethod(log);
    } else {
      this._print(log);
    }

    return log;
  }
}

Clio.levels = levels;
Clio.ENV_MODES = config.ENV_MODES;

export default Clio;