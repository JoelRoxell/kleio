"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Log = function Log(title, description, level, stackTrace, data) {
  _classCallCheck(this, Log);

  this.title = title;
  this.description = description;
  this.level = level;
  this.stackTrace = stackTrace;
  this.data = data;
};

exports.default = Log;