"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gulp = void 0;
var _path = _interopRequireDefault(require("path"));
var _through = _interopRequireDefault(require("through2"));
var _vinyl = _interopRequireDefault(require("vinyl"));
var _pluginError = _interopRequireDefault(require("plugin-error"));
var _colors = _interopRequireDefault(require("colors"));
var _json2pot = require("./json2pot");
var _parse = require("./parse");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var GULP_OPTS = {
  output: 'messages.pot'
};
var gulp = function gulp() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var allMessages = [];
  var options = _objectSpread({}, GULP_OPTS, opts);
  function read(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new _pluginError["default"]('gulp-react-gettext-parser', 'Streams not supported'));
    }
    if (file.isBuffer()) {
      var messages = (0, _parse.extractMessages)(file._contents.toString('utf8'), _objectSpread({}, options, {
        filename: _path["default"].relative(process.cwd(), file.history[0])
      }));
      allMessages = allMessages.concat(messages);
      return cb();
    }
    return cb();
  }
  function write(cb) {
    allMessages = (0, _parse.getUniqueBlocks)(allMessages);
    var potFile = new _vinyl["default"]({
      base: process.cwd(),
      path: options.output,
      contents: Buffer.from((0, _json2pot.toPot)(allMessages))
    });
    this.push(potFile);
    console.log("Writing .pot file to ".concat(options.output).green);
    cb();
  }
  return _through["default"].obj(read, write);
};
exports.gulp = gulp;