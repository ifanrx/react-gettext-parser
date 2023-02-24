"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _path = _interopRequireDefault(require("path"));
var _colors = _interopRequireDefault(require("colors"));
var _yargs = _interopRequireDefault(require("yargs"));
var _parse = require("./parse.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var args = _yargs["default"].usage('react-gettext-parser <options> glob [, glob, ...]').help('h').alias('h', 'help').option('o', {
  alias: 'output',
  description: 'Path to output .pot file'
}).option('c', {
  alias: 'config',
  description: 'Path to a react-gettext-parser config file'
}).option('trim', {
  type: 'boolean',
  description: 'Trims extracted strings from surrounding whitespace'
}).option('trim-lines', {
  type: 'boolean',
  description: 'Trims each line in extracted strings from surrounding whitespace'
}).option('trim-newlines', {
  type: 'boolean',
  description: 'Trims extracted strings from new-lines'
}).option('disable-line-numbers', {
  type: 'boolean',
  description: 'Disables line numbers in POT reference comments'
}).option('no-wrap', {
  type: 'boolean',
  description: 'Does not break long strings into several lines'
}).option('header', {
  type: 'array',
  description: 'Sets a POT header value with the syntax "Some-Header: some value". You can specify more than one header. Add a -- after your --header argument(s).'
}).argv;
var filesGlob = args._;
var headerInputsToObject = function headerInputsToObject(inputs) {
  return inputs.map(function (x) {
    return x.split(':');
  }).map(function (x) {
    return x.map(function (y) {
      return y.trim();
    });
  }).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return _objectSpread({}, acc, _defineProperty({}, key.toLowerCase(), value));
  }, {});
};
var opts = {
  output: args.output,
  trim: args.trim,
  trimLines: args['trim-lines'],
  trimNewlines: args['trim-newlines'],
  disableLineNumbers: args['disable-line-numbers'],
  noWrap: args['no-wrap'],
  transformHeaders: function transformHeaders(headers) {
    return _objectSpread({}, headers, headerInputsToObject(args.header || []));
  }
};
if (args.config) {
  // eslint-disable-next-line
  var configs = require(_path["default"].join(process.cwd(), args.config));
  opts = _objectSpread({}, opts, configs);
}
(0, _parse.parseGlob)(filesGlob, opts);