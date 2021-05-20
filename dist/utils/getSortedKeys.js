"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSortedkeys;

var _settings = require("./settings");

var _sortArray = _interopRequireDefault(require("sort-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var possibleOrder = ['asc', 'desc'];

function getSortedkeys(keys, rows) {
  var orderBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (orderBy.length === 0) {
    return keys.sort();
  }

  var orderByObj = orderBy.filter(function (x) {
    return possibleOrder.includes(x.order);
  }).reduce(function (obj, item) {
    obj[item.field] = item.order;
    return obj;
  }, {});
  var keysRows = keys.map(function (key) {
    return key.split(_settings.separator).reduce(function (obj, k, i) {
      obj[rows[i]] = k;
      return obj;
    }, {});
  });
  var sortArrayObj = {
    by: rows,
    order: rows.map(function (x, i) {
      return orderByObj[x] ? orderByObj[x] : 'asc';
    })
  };
  var sorterKeysRows = (0, _sortArray.default)(keysRows, sortArrayObj);
  var sortedKeys = sorterKeysRows.map(function (x) {
    return Object.keys(x).map(function (v) {
      return x[v];
    }).join(_settings.separator);
  });
  return sortedKeys;
}