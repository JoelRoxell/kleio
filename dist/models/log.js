"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Log = function Log(description, level, stackTrace, data) {
  _classCallCheck(this, Log);

  this.description = description;
  this.stackTrace = stackTrace;
  this.level = level;
  this.data = data;
};

exports.default = Log;