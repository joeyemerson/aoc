const fs = require('fs');

const input = fs
    .readFileSync('./input')
    .toString()
    .split('\n')
    .filter(line => line !== '')
    .map(line => {
        const [inst, rangesString] = line.split(' ');
        const ranges = rangesString.split(',').map(str => {
            const [axis, range] = str.split('=');
            const [start, end] = range.split('..').map(Number);
            return [start, end];
        });
        return [inst, ranges];
    });

// Part 1: Execute the reboot steps.
// Afterward, considering only cubes in the region x=-50..50,y=-50..50,z=-50..50, how many cubes are on?
const p1 = input => {
    const grid = Array.from(Array(101), () => {
        return Array.from(Array(101), () => {
            return Array(101).fill(0);
        });
    });

    for (const [inst, ranges] of input) {
        const val = inst === 'on' ? 1 : 0;
        for (let x = Math.max(ranges[0][0], -50); x <= Math.min(ranges[0][1], 50); ++x) {
            for (let y = Math.max(ranges[1][0], -50); y <= Math.min(ranges[1][1], 50); ++y) {
                for (let z = Math.max(ranges[2][0], -50); z <= Math.min(ranges[2][1], 50); ++z) {
                    grid[x + 50][y + 50][z + 50] = val;
                }
            }
        }
    }

    let result = 0;

    for (const x of grid) {
        for (const y of x) {
            for (const z of y) {
                result += z;
            }
        }
    }

    return result;
};

// Part 2: Starting again with all cubes off, execute all reboot steps.
// Afterward, considering all cubes, how many cubes are on?
const p2 = input => {
    return 'not done yet';
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
