"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getChunks;

// Adapted from: https://stackoverflow.com/questions/8495687/split-array-into-chunks
function getChunks(array) {
  var itemsPerChunk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return array.reduce(function (allChunks, thisChunk, index) {
    var chunk = Math.floor(index / itemsPerChunk);
    allChunks[chunk] = [].concat(allChunks[chunk] || [], thisChunk);
    return allChunks;
  }, []);
}