"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNewLines = removeNewLines;
exports.getColumns = getColumns;
exports.timerFn = timerFn;
exports.csvToJson = csvToJson;
exports.getCsvContents = getCsvContents;
exports.getFilteredRows = getFilteredRows;

var _sortObjectsArray = _interopRequireDefault(require("sort-objects-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function removeNewLines(val) {
  return val.replace(/(\r\n|\n|\r)/gm, '');
}

function getColumns(columnsLabels, rows, values) {
  var columnsCombined = [].concat(_toConsumableArray(rows), _toConsumableArray(values.map(function (x) {
    return x.field;
  })));

  if (columnsLabels) {
    return columnsCombined.map(function (col, i) {
      return columnsLabels[i] ? columnsLabels[i] : col;
    });
  }

  return [].concat(_toConsumableArray(rows), _toConsumableArray(values.map(function (x) {
    return x.field;
  })));
}

function filterIterations(rawRows, filters) {
  var filteredRows = _toConsumableArray(rawRows);

  filters.forEach(function (filterFn) {
    filteredRows = filteredRows.filter(filterFn);
  });
  return filteredRows;
}

function timerFn(funtionName) {
  var t0 = performance.now();
  return function () {
    var t1 = performance.now();
    console.log("TIMER (".concat(funtionName, ") took ").concat(t1 - t0, "  milliseconds."));
  };
}

function getMostCommonSeparator(val) {
  var possibleDelimiters = ['\t', ',', ';', '","'];
  var delimitersCount = possibleDelimiters.reduce(function (obj, key) {
    obj[key] = val.split(key).length;
    return obj;
  }, {});
  var sorted = (0, _sortObjectsArray.default)(delimitersCount, 'value', 'desc'); // Deal with "," case

  if ((sorted[1] || {}).key === '","' && sorted[0].key === ',') {
    return sorted[1].key;
  }

  return sorted[0].key;
}

function getJsonValue(key) {
  var numericValue = parseFloat(key);
  return numericValue == key ? numericValue : key;
}

function csvToJson(val) {
  var separator = getMostCommonSeparator(val);
  var splitcsv = separator === '","' ? val.split('\n').filter(function (x) {
    return x;
  }).map(function (x) {
    return x.slice(1, -1);
  }) : val.split('\n').filter(function (x) {
    return x;
  });
  var header = splitcsv[0].split(separator).map(function (x) {
    return removeNewLines(x);
  });
  var json = splitcsv.slice(1).map(function (line) {
    return line.split(separator).map(function (x) {
      return removeNewLines(x);
    }).reduce(function (obj, key, i) {
      obj[header[i]] = getJsonValue(key);
      return obj;
    }, {});
  });
  return json;
}

function getCsvContents(pivotRows, cols, rows, showColumnTotals, colsTotals) {
  var header = "\"".concat(cols.join('","'), "\"");
  var thisRows = pivotRows.map(function (x) {
    return x.map(function (y) {
      return y.value;
    }).map(function (z) {
      return z;
    });
  }).map(function (x) {
    return "\"".concat(x.join('","'), "\"");
  });

  if (showColumnTotals) {
    var totalLine = new Array(rows.length).fill('totals');
    Object.keys(colsTotals).forEach(function (item) {
      totalLine.push(colsTotals[item]);
    });
    thisRows.push("\"".concat(totalLine.join('","'), "\""));
  }

  return [header].concat(_toConsumableArray(thisRows)).join('\n');
}

function checkValidJSON(val) {
  var expectedConstructor = [].constructor;
  return val.constructor === expectedConstructor;
}

function getFilteredRows(rawRows, filters) {
  var validJson = checkValidJSON(rawRows);
  var loadedData = validJson ? rawRows : csvToJson(rawRows);
  return filters ? filterIterations(loadedData, filters) : loadedData;
}