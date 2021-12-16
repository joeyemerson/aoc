const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const transmission = input[0];

const binary = [...transmission.replace(/./g, m => parseInt(m, 16).toString(2).padStart(4, '0'))];

const seedValues = [0, 1, Infinity, -Infinity, null, -1, -1, -1];

const expressionFuncs = [
  (a, b) => a + b, // sum
  (a, b) => a * b, // product
  (a, b) => Math.min(a, b), // minimum
  (a, b) => Math.max(a, b), // maximum
  null, // id 4 is value packet
  (a, b) => (a < 0 ? b : a > b ? 1 : 0), // greater
  (a, b) => (a < 0 ? b : a < b ? 1 : 0), // less
  (a, b) => (a < 0 ? b : a === b ? 1 : 0), // equal
];

const evaluate = (binary, part) => {
  const getHeader = idx => {
    return [binary.slice(idx, idx + 3), binary.slice(idx + 3, idx + 6)].map(slice => parseInt(slice.join(''), 2));
  };

  const getValueChunks = idx => {
    const chunks = [];
    for (; ; idx += 5) {
      const chunk = binary.slice(idx, idx + 5).join('');
      chunks.push(chunk);
      if (chunk[0] === '0') break;
    }
    return chunks;
  };

  const stack = [];
  const parts = [0, null];
  let idx = 0;

  while (idx < binary.length) {
    const top = stack[stack.length - 1];

    if (!top || idx < top.end || top.subpacketCount > 0) {
      const [version, id] = getHeader(idx);
      idx += 6;
      parts[0] += version;
      if (top) --top.subpacketCount;

      if (id === 4) {
        const chunks = getValueChunks(idx);
        const value = parseInt(chunks.map(chunk => chunk.slice(1)).join(''), 2);
        idx += chunks.length * 5;
        top.accumulator = expressionFuncs[top.id](top.accumulator, value);
      } else {
        const lengthTypeId = binary[idx++];
        const offset = lengthTypeId === '0' ? 15 : 11;
        const lengthValue = parseInt(binary.slice(idx, idx + offset).join(''), 2);
        const subpacketsLength = lengthTypeId === '0' ? lengthValue : 0;
        const subpacketCount = lengthTypeId === '1' ? lengthValue : 0;
        idx += offset;
        stack.push({
          end: idx + subpacketsLength,
          subpacketCount: subpacketCount,
          id: id,
          accumulator: seedValues[id],
        });
      }
    } else {
      const poppedAccumulator = stack.pop().accumulator;
      if (stack.length) {
        const newTop = stack[stack.length - 1];
        newTop.accumulator = expressionFuncs[newTop.id](newTop.accumulator, poppedAccumulator);
      } else {
        parts[1] = poppedAccumulator;
        break;
      }
    }
  }

  if (parts[1] === null) parts[1] = stack[0].accumulator;
  return parts[part];
};

console.time('Part 1 Time');
console.log('Part 1:', evaluate(binary, 0));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', evaluate(binary, 1));
console.timeEnd('Part 2 Time');
