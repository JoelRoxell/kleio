import levels from 'models/log-levels';
import crypto from 'crypto';

class Clio {
  constructor(host = '', env = 'dev') {
    this._levels = levels
    this._env = env
    this._host = host
    this._id = crypto.randomBytes(8).toString('hex')
  }

  _splitHostFromPath(url) {
    console.log(url);

    return {
      host: url,
      path: url
    }
  }

  print(message = '', stacktrace = {}, level = 0) {
    if (this._env === Clio.ENV_MODES.PROD) {
      return 0
    }

    console.log(message, stacktrace, level)

    return 0
  }

  send(log, cb) {
    const postData = JSON.stringify(log)

    fetch(this._host, 'GET').then((res) => {
      console.log('received', res);

      if (typeof cb === 'function') {
        cb()
      }
    }).catch((err) => {
      console.log(err);
      cb();
    });
  }

  collect(cb) {
    https.get(`${this._host}${this._path}`, (res) => {
      let body = ''

      // FIXME: Should use pipes
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        if (typeof cb === 'function') {
          cb(body)
        }
      })
    })
  }
}

Clio.ENV_MODES = {
  DEV: 'dev',
  PROD: 'prod'
}

module.exports = Clio
