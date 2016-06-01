class LogModel {
  constructor(description, stackTrace, level, data) {
    this.description = description
    this.stackTrace = stackTrace
    this.level = level
    this.data = data
  }
}

export const Log = LogModel;
