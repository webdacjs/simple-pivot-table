"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDenormalized;

var _settings = require("./settings");

function checkVisibility(previousItemSplit, keyCounts, partialK, prevK) {
  if (!previousItemSplit) {
    return true;
  } else if (partialK !== prevK) {
    return true;
  } else if (keyCounts[partialK] === 1) {
    return true;
  }

  return false;
}

function getDenormalizedLine(key, data, previousItem, keyCounts, valuesFields) {
  var line = []; // Add Header

  var previousItemSplit = previousItem ? previousItem.split(_settings.separator) : null;
  var splitKey = key.split(_settings.separator);
  var splitKeyLength = splitKey.length;

  for (var norm = 0; norm < splitKeyLength; norm++) {
    var partialK = splitKey.slice(0, norm + 1).join(_settings.separator);
    var prevK = previousItemSplit ? previousItemSplit.slice(0, norm + 1).join(_settings.separator) : null;
    line.push({
      type: 'header',
      value: splitKey[norm],
      rowSpan: keyCounts[partialK],
      visible: checkVisibility(previousItemSplit, keyCounts, partialK, prevK)
    });
  } // Add values.


  valuesFields.forEach(function (v) {
    line.push({
      type: 'value',
      value: data[v],
      visible: true
    });
  });
  return line;
} // This functions is used to calculate later on how many rowSpan will be required
// when generating the actual HTML table.


function getKeysCounts(sortedKeys) {
  var keyCounts = {};
  var l = sortedKeys.length; // Using for for browser efficiency
  // https://jsben.ch/wY5fo

  for (var x = 0; x < l; x++) {
    var splitKey = sortedKeys[x].split(_settings.separator);
    var splitKeyLength = splitKey.length;

    for (var y = 0; y < splitKeyLength; y++) {
      var partialK = splitKey.slice(0, y + 1).join(_settings.separator);
      keyCounts[partialK] = keyCounts[partialK] ? keyCounts[partialK] + 1 : 1;
    }
  }

  return keyCounts;
}

function getDenormalized(groupedData, rows, values) {
  var valuesFields = values.map(function (x) {
    return x.field;
  });
  var grouped = groupedData.grouped,
      totals = groupedData.totals;
  var denormalizedArray = [];
  var sortedKeys = Object.keys(grouped).sort();
  var keyCounts = getKeysCounts(sortedKeys);
  sortedKeys.forEach(function (key, i) {
    var previousItem = i > 0 ? sortedKeys[i - 1] : null;
    denormalizedArray.push(getDenormalizedLine(key, grouped[key], previousItem, keyCounts, valuesFields));
  });
  return denormalizedArray;
}