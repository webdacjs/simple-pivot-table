"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFullTree;

var _settings = require("./settings");

var _lodash = _interopRequireDefault(require("lodash.set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFullTree(groupedData) {
  var finalObj = {};
  var grouped = groupedData.grouped;
  Object.keys(grouped).forEach(function (thisKey) {
    var dotKey = thisKey.split(_settings.separator).join('.');
    (0, _lodash.default)(finalObj, dotKey, grouped[thisKey]);
  });
  return finalObj;
}