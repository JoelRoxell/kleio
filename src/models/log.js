class Log {
  constructor(title, description, level, stackTrace, data) {
    this.title = title;
    this.description = description;
    this.level = level;
    this.stackTrace = stackTrace;
    this.data = data;
  }
}

export default Log;
