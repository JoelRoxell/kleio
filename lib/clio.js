const levels = require('./log-levels'),
  crypto = require('crypto'),
  https = require('https')

class Clio {
  constructor(host = '', env = 'dev') {
    this._levels = levels
    this._env = env
    this._host = host
    this._id = crypto.randomBytes(8).toString('hex')
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
    let postOptions = {
      host: this._host,
      port: this._port || 80,
      path: this._path,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length // Use buffer bytelength ?
      }
    }

    let req = https.request(postOptions, (res) => {
      console.log(`STATUS: ${res.statusCode}`)

      res.on('end', () => {
        if (typeof cb === 'function') {
          cb()
        }
      })
    })

    req.write(postData)
    req.end()
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
