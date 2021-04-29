// Adapted from: https://stackoverflow.com/questions/8495687/split-array-into-chunks
export default function getChunks (array, itemsPerChunk = 2) {
  return array.reduce(
    (allChunks, thisChunk, index) => {
      const chunk = Math.floor(index / itemsPerChunk)
      allChunks[chunk] = [].concat((allChunks[chunk] || []), thisChunk)
      return allChunks
    }, [])
}
