const fs = require('fs');

const input = fs
  .readFileSync('./input')
  // .readFileSync('./input-example')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const parseScannerData = input => {
  const scannerData = [];

  for (const line of input) {
    if (line.includes('scanner')) scannerData.push([]);
    else scannerData[scannerData.length - 1].push(line.split(',').map(Number));
  }

  return scannerData;
};

const getOrientation = (scanner, orientation) => {
  const direction = Math.floor(orientation / 4);
  const rotation = orientation % 4;

  return scanner.map(([x, y, z]) => {
    // go up
    if (direction === 1) [y, z] = [z, -y];
    // go down
    if (direction === 2) [y, z] = [-z, y];
    // go left
    if (direction === 3) [x, z] = [-z, x];
    // go right
    if (direction === 4) [x, z] = [z, -x];
    // look behind
    if (direction === 5) [x, z] = [-x, -z];

    // 90deg right
    if (rotation === 1) [x, y] = [-y, x];
    // 180deg right
    if (rotation === 2) [x, y] = [-x, -y];
    // 270deg right
    if (rotation === 3) [x, y] = [y, -x];

    return [x, y, z];
  });
};

const reorientScanners = input => {
  const scannerData = parseScannerData(input);
  const adjustedScanners = [{ position: [0, 0, 0], beacons: scannerData.shift(), isChecked: false }];

  while (scannerData.length) {
    for (let i = 0; i < adjustedScanners.length; ++i) {
      const { position, beacons, isChecked } = adjustedScanners[i];
      if (isChecked) continue;
      adjustedScanners[i].isChecked = true;

      for (let j = scannerData.length - 1; j >= 0; --j) {
        const compareScanner = scannerData[j];

        for (let k = 0; k < 24; ++k) {
          const reorientedScanner = getOrientation(compareScanner, k);
          const relativeDistances = {};
          let foundMatch = false;

          for (const [x, y, z] of beacons) {
            for (const [xx, yy, zz] of reorientedScanner) {
              const key = (x - xx).toString() + ' ' + (y - yy).toString() + ' ' + (z - zz).toString();
              relativeDistances[key] = relativeDistances[key] + 1 || 1;
            }
          }

          for (const key in relativeDistances) {
            if (relativeDistances[key] >= 12) {
              const [offsetX, offsetY, offsetZ] = key.split(' ').map(Number);
              scannerData.splice(j, 1);

              adjustedScanners.push({
                position: [position[0] + offsetX, position[1] + offsetY, position[2] + offsetZ],
                beacons: reorientedScanner,
                isChecked: false,
              });

              foundMatch = true;
              break;
            }
          }

          if (foundMatch) break;
        }
      }
    }
  }

  return adjustedScanners;
};

// Part 1: Assemble the full map of beacons. How many beacons are there?
const p1 = scanners => {
  const uniquePoints = new Set();

  for (const { position, beacons } of scanners) {
    for (const [x, y, z] of beacons) {
      uniquePoints.add(x + position[0] + ' ' + (y + position[1]) + ' ' + (z + position[2]));
    }
  }

  return uniquePoints.size;
};

// Part 2: What is the largest Manhattan distance between any two scanners?
const p2 = scanners => {
  let maxDistance = 0;

  const scannerPositions = scanners.map(obj => obj.position);

  for (const [x, y, z] of scannerPositions) {
    for (const [xx, yy, zz] of scannerPositions) {
      maxDistance = Math.max(maxDistance, Math.abs(x - xx) + Math.abs(y - yy) + Math.abs(z - zz));
    }
  }

  return maxDistance;
};

console.time('Time to Reorient Scanners');
const adjustedScanners = reorientScanners(input);
console.timeEnd('Time to Reorient Scanners');
console.log();

console.time('Part 1 Time');
console.log('Part 1:', p1(adjustedScanners));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(adjustedScanners));
console.timeEnd('Part 2 Time');
