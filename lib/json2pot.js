"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPot = void 0;
var _gettextParser = require("gettext-parser");
var _lodash = _interopRequireDefault(require("lodash.groupby"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Creates a gettext-parser/node-gettext compatible JSON PO(T)
 * structure from a list of gettext blocks.
 */
var createTranslationsTable = function createTranslationsTable(blocks) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var translations = (0, _lodash["default"])(blocks, function (b) {
    return b.msgctx || '';
  });

  // Hack
  // TODO: Explain this gettext-parser thingy
  translations[''] = translations[''] || {};
  translations[''][''] = {
    msgid: '',
    msgstr: ['']
  };
  return {
    charset: headers.charset || 'utf-8',
    headers: {
      'content-type': headers['content-type'] || 'text/plain; charset=utf-8',
      'pot-creation-date': new Date().toString(),
      'content-transfer-encoding': headers['content-transfer-encoding'] || '8bit',
      'plural-forms': headers['plural-forms'] || 'nplurals=2; plural=(n != 1);'
    },
    translations: translations
  };
};
var convertReferenceToString = function convertReferenceToString(reference, disableLineNumbers) {
  return disableLineNumbers ? "".concat(reference.filename) : "".concat(reference.filename, ":").concat(reference.line);
};
var convertCommentArraysToStrings = function convertCommentArraysToStrings(blocks) {
  var disableLineNumbers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return blocks.map(function (b) {
    return _objectSpread({}, b, {
      comments: {
        reference: b.comments.reference.map(function (ref) {
          return convertReferenceToString(ref, disableLineNumbers);
        }).join('\n'),
        extracted: b.comments.extracted.join('\n')
      }
    });
  });
};
var toPot = function toPot(blocks) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parsedBlocks = convertCommentArraysToStrings(blocks, opts.disableLineNumbers);
  var potJson = createTranslationsTable(parsedBlocks);

  // Allow the consumer to transform headers
  var transformHeaders = opts.transformHeaders ? opts.transformHeaders : function (x) {
    return x;
  };
  var transformedPotJson = _objectSpread({}, potJson, {
    headers: transformHeaders(potJson.headers)
  });
  var compilerOpts = {};
  if (opts.noWrap === true) {
    compilerOpts.foldLength = 0;
  }
  var pot = _gettextParser.po.compile(transformedPotJson, compilerOpts);
  return pot.toString();
};
exports.toPot = toPot;