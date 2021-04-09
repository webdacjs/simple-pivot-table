"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColumns = getColumns;
exports.getFilteredRows = getFilteredRows;
exports.timerFn = timerFn;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getColumns(columnsLabels, rows, values) {
  if (columnsLabels) {
    return columnsLabels;
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

function getFilteredRows(rawRows, filters) {
  return filters ? filterIterations(rawRows, filters) : rawRows;
}

function timerFn(funtionName) {
  var t0 = performance.now();
  return function () {
    var t1 = performance.now();
    console.log("TIMER (".concat(funtionName, ") took ").concat(t1 - t0, "  milliseconds."));
  };
}