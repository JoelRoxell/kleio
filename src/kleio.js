import levels from './models/log-levels';
import Log from './models/log';
import crypto from 'crypto';
import config from '../config';
import whatwgFetch from 'whatwg-fetch'; // eslint-disable-line

/**
 * Core class which provides simplified logging capabilities.
 */
class Kleio {
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

  get id() {
    return this._id;
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
   * Prints log model information to console.
   *
   * @param  {Log} log object
   */
  _print(log) {
    const levels = Kleio.levels;

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

    try {
      fetch(`${this._host}:${this._port}`, {
        method: 'POST',
        headers: {
          'Accept': 'Application/json',
          'Content-Type': 'Application/json'
        },
        body: payload
      }).then(res => {
        if (typeof cb === 'function') {
          cb(null, res);
        }
      }).catch(err => {
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
   * Prase the log model to a correct format based on http://jsonapi.org/
   * @param  {Log} log data model
   * @return {Object}  parsed JSON object
   */
  _prepareApiLogModel(log) {
    return {
      data: {
        type: 'log',
        id: this._id,
        attributes: {
          userAgent: navigator.userAgent,
          ...log
        }
      }
    };
  }

  /**
   * Recoreds the current description, depending on the initial configuration the item will either be sent to console, server and/or localstorage.
   *
   * @param  {String}  title log title
   * @param  {String} description Description of the error or general information of the specific dunction body.
   * @param  {Number} level Error level identification.
   * @param  {String} stacktrace Current stacktrace
   * @param  {Object} data JOSN-object with additional data.
   * @param  {Funciton} cb callback
   *
   * @return {Log} The created log issue.
   */
  record(
    title,
    description = '',
    level = Kleio.levels.DEBUG,
    stacktrace = {},
    data = {},
    cb
  ) {
    let log = new Log(title, description, level, stacktrace, data);

    log = this._prepareApiLogModel(log);

    if (this._env === Kleio.ENV_MODES.PROD) {
      this._postMethod(log, cb);
    } else {
      this._print(log);
    }

    return log;
  }
}

Kleio.levels = levels;
Kleio.ENV_MODES = config.ENV_MODES;

export default Kleio;
