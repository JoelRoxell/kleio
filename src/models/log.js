class Log {
  constructor(description, level, stackTrace, data) {
    this.description = description;
    this.stackTrace = stackTrace;
    this.level = level;
    this.data = data;
  }
}

export default Log;
