import levels from 'models/log-levels';
import crypto from 'crypto';

/**
 * Core class that provides simplified logging capabilities.
 */
class Clio {
  /**
   * Constructor
   * @param  {String} socket comprised host name.
   * @param  {String} env environment configuration.
   */
  constructor(socket = '', env = 'dev') {
    this._id = crypto.randomBytes(8).toString('hex')
    this._levels = levels

    Object.assign(this, this._splitHostFromPath(socket));
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
   * [_splitHostFromPath description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  _splitHostFromPath(url) {
    if (typeof url !== 'string') {
      throw new Error('Passted socket configuration must be of type string');
    }

    const hostConfig = url.split(':');

    return {
      _host: hostConfig[0],
      _port: parseInt(hostConfig[1])
    }
  }

  /**
   * [_send description]
   * @param  {[type]}   log [description]
   * @param  {Function} cb  [description]
   * @return {[type]}       [description]
   */
  _send(log, cb) {
    const postData = JSON.stringify(log);

    fetch(this._host, 'GET').then((res) => {
      if (typeof cb === 'function') {
        cb();
      }
    }).catch((err) => {
      console.log(err);
      cb();
    });
  }

  /**
   * [record description]
   * @param  {[type]} message    =             '' [description]
   * @param  {[type]} stacktrace =             {} [description]
   * @param  {[type]} level      =             0  [description]
   * @return {[type]}            [description]
   */
  record(message = '', level = this.levels.DEBUG, stacktrace = {}, data = {}) {
    if (this._env === Clio.ENV_MODES.PROD) {
      return 0
    }

    console.log(message, stacktrace, level)

    return 0
  }
}

export default Clio;
