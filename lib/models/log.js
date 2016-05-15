class Log {
  constructor(description, stackTrace, level, data) {
    this.description = description
    this.stackTrace = stackTrace
    this.level = level
    this.data = data
  }
}

module.exports = Log
