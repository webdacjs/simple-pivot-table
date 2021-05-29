"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDenormalized;

var _settings = require("./settings");

var _getSortedKeys = _interopRequireDefault(require("./getSortedKeys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function getDenormalizedLine(key, data, previousItem, keyCounts, valuesFields, countObj, showRanking) {
  var totalsLine = key.includes(_settings.subtotalsSuffix);
  var line = []; // Add Header

  var previousItemSplit = previousItem ? previousItem.split(_settings.separator) : null;
  var splitKey = key.split(_settings.separator);
  var splitKeyLength = splitKey.length;
  countObj.count++;

  for (var norm = 0; norm < splitKeyLength; norm++) {
    var partialK = splitKey.slice(0, norm + 1).join(_settings.separator);
    var prevK = previousItemSplit ? previousItemSplit.slice(0, norm + 1).join(_settings.separator) : null;
    line.push({
      type: 'header',
      value: splitKey[norm].replace(_settings.subtotalsSuffix, ''),
      rowSpan: keyCounts[partialK],
      visible: checkVisibility(previousItemSplit, keyCounts, partialK, prevK),
      totalsLine: totalsLine
    });

    if (showRanking && norm === splitKeyLength - 2) {
      if (countObj.prevKey !== partialK) {
        countObj.prevKey = partialK;
        countObj.count = 1;
      }
    }
  } // Inject Ranking if required


  if (showRanking) {
    var index = line.length - 1;
    line.splice(index, 0, {
      type: 'header',
      value: countObj.count,
      rowSpan: 1,
      visible: true,
      totalsLine: totalsLine
    });
  } // Add values.


  valuesFields.forEach(function (v) {
    line.push({
      type: 'value',
      value: data[v],
      visible: true,
      totalsLine: totalsLine
    });
  });
  return line;
} // This function it is used later to calculate later how many rowSpan will be required
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

function getDenormalized(groupedData, rows, orderBy, showRanking) {
  var grouped = groupedData.grouped;
  var valuesFields = Array.from(new Set(Object.keys(grouped).map(function (x) {
    return Object.keys(grouped[x]);
  }).flat()));
  var denormalizedArray = [];
  var sortedKeys = (0, _getSortedKeys.default)(grouped, rows, valuesFields, orderBy);
  var keyCounts = getKeysCounts(sortedKeys);
  var countObj = {
    count: 0,
    prevKey: ''
  };
  sortedKeys.forEach(function (key, i) {
    var previousItem = i > 0 ? sortedKeys[i - 1] : null;
    denormalizedArray.push(getDenormalizedLine(key, grouped[key], previousItem, keyCounts, valuesFields, countObj, showRanking));
  });
  return denormalizedArray;
}