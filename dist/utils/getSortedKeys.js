"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSortedkeys;

var _settings = require("./settings");

var _sortArray = _interopRequireDefault(require("sort-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var possibleOrder = ['asc', 'desc'];

function combineSortedKeysWithSubtotalKeys(sortedKeys, subtotalKeys) {
  var extractComparisonValue = function extractComparisonValue(keyObj) {
    return keyObj[Object.keys(keyObj)[0]];
  };

  var finalKeys = [];
  var sortedKeysLength = sortedKeys.length;
  sortedKeys.forEach(function (keyObj, i) {
    if (i === 0) {
      finalKeys.push(keyObj);
      return;
    }

    var previousValue = extractComparisonValue(sortedKeys[i - 1]);
    var thisValue = extractComparisonValue(keyObj);

    if (thisValue !== previousValue) {
      var subtotalKey = subtotalKeys.find(function (x) {
        return extractComparisonValue(x) === previousValue;
      });
      finalKeys.push(subtotalKey);
    }

    finalKeys.push(keyObj);

    if (i === sortedKeysLength - 1) {
      var _subtotalKey = subtotalKeys.find(function (x) {
        return extractComparisonValue(x) === previousValue;
      });

      finalKeys.push(_subtotalKey);
    }
  });
  return finalKeys;
}

function orderByReducer(orderBy) {
  return orderBy.filter(function (x) {
    return possibleOrder.includes(x.order);
  }).reduce(function (obj, item) {
    obj[item.field] = item.order;
    return obj;
  }, {});
}

function getSortableKeyRows(keys, grouped, rows) {
  // Get the k, v but making sure they are cast as numbers
  var values = keys.map(function (key) {
    return grouped[key];
  }).map(function (obj) {
    return Object.keys(obj).reduce(function (iobj, key) {
      iobj[key] = !isNaN(obj[key]) ? Number(obj[key]) : Number(obj[key].replace(/[^0-9.]/g, ''));
      return iobj;
    }, {});
  });
  var keysRows = keys.map(function (key, i) {
    var outerObj = key.split(_settings.separator).reduce(function (obj, k, i) {
      obj[rows[i]] = k;
      return obj;
    }, {});
    return _objectSpread(_objectSpread({}, outerObj), values[i]);
  });
  return keysRows;
}

function getSortedkeys(grouped, rows, valuesFields) {
  var orderBy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  // If there is not a 'order by' directive let's not wasted time and return
  // default asc order.
  var keysAll = Object.keys(grouped);

  if (orderBy.length === 0) {
    return keysAll.sort();
  }

  var keys = keysAll.filter(function (x) {
    return !x.includes(_settings.subtotalsSuffix);
  });
  var keysWithSubtotals = keysAll.filter(function (x) {
    return x.includes(_settings.subtotalsSuffix);
  }); // Reduces the 'orderBy' directives into an Object

  var orderByObj = orderByReducer(orderBy); // Splits the keys into a sortable array of objects.

  var keysRows = getSortableKeyRows(keys, grouped, rows); // Splits also the keyswith subtotals into a sortable array of objects.

  var keyRowsWithSubtotals = keysWithSubtotals.length === 0 ? keysWithSubtotals : getSortableKeyRows(keysWithSubtotals, grouped, rows); // It needs some mandatory sort fields for the grouping, the others are optional.

  var mandatory = rows.slice(0, rows.length - 1);
  var optional = [].concat(_toConsumableArray(rows.slice(rows.length - 1)), _toConsumableArray(valuesFields)).filter(function (field) {
    return orderByObj[field];
  });
  var orderFields = [].concat(_toConsumableArray(mandatory), _toConsumableArray(optional)); // Create the sort object configuration to pass to sortArray

  var sortArrayObj = {
    by: orderFields,
    order: orderFields.map(function (x) {
      return orderByObj[x] ? orderByObj[x] : 'asc';
    })
  };
  var sortedKeysRows = (0, _sortArray.default)(keysRows, sortArrayObj); // Adding back subtotals keys if necessary

  var finalSortedKeyRows = keyRowsWithSubtotals.length === 0 ? sortedKeysRows : combineSortedKeysWithSubtotalKeys(sortedKeysRows, keyRowsWithSubtotals); // Compose back the sorted keys.

  var sortedKeys = finalSortedKeyRows.map(function (x) {
    return Object.keys(x).slice(0, rows.length).map(function (v) {
      return x[v];
    }).join(_settings.separator);
  });
  return sortedKeys;
}