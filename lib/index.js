const Clio = require('./clio')

const loader = function(config = {}) {
  return new Clio(config.host, config.env)
}

module.exports = {
  Clio,
  loader
}
