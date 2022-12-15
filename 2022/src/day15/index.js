import run from 'aocrunner';

const parseInput = (rawInput) => {
    return rawInput.split('\n').map((line) => {
        return line.match(/-?\d+/g).map(Number);
    });
};

const getDist = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    // const targetRow = 10; // test input
    const targetRow = 2000000; // full input
    const targetBeacons = new Set();
    const ranges = [];
    for (const [sx, sy, bx, by] of input) {
        const d = getDist(sx, sy, bx, by);
        const hd = d - Math.abs(sy - targetRow);
        if (hd >= 0) {
            if (by === targetRow) targetBeacons.add(bx + ' ' + by);
            ranges.push([sx - hd, sx + hd + 1]);
        }
    }
    // merge ranges
    for (let i = ranges.length - 1; i > 0; --i) {
        const [startA, endA] = ranges[i];
        let merged = false;
        for (let j = 0; j < i; ++j) {
            const [startB, endB] = ranges[j];
            if (!(endA < startB) && !(endB < startA)) {
                ranges[j] = [Math.min(startA, startB), Math.max(endA, endB)];
                merged = true;
            }
        }
        if (merged) ranges.splice(i, 1);
    }
    let result = 0;
    for (const [start, end] of ranges) {
        result += end - start;
    }
    return result - targetBeacons.size;
};

/*
PART 2
The boundary of a scanner is four line segments. If a scanner is in position (sx,sy) and has 'radius' r, then we want the line segments just outside, i.e. of radius r+1. There will be two line segments of gradient 1:
y = x + sy-sx+r+1
y = x + sy-sx-r-1

and two line segments of gradient -1:
y = -x + sx+sy+r+1
y = -x + sx+sy-r-1

Determining where a line y=x+a and a line y=-x+b intersect is very easy - they intersect at the point ( (b-a)/2 , (a+b)/2 ).

One of these intersection points will be the missing scanner location. So, we assemble a set of all the 'a' coefficients (lines of gradient 1) and all the 'b' coefficients (lines of gradient -1), then look at their intersections to see if they are the point we need.
*/

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const xMul = 4000000;
    const minVal = 0; // both inputs
    // const maxVal = 20; // test input
    const maxVal = 4000000; // full input
    const radiusMap = {};
    const scanners = [];
    const aCoeffs = new Set();
    const bCoeffs = new Set();
    for (const [sx, sy, bx, by] of input) {
        const radius = getDist(sx, sy, bx, by);
        radiusMap[sx + ' ' + sy] = radius;
        scanners.push([sx, sy]);
        aCoeffs.add(sy - sx + radius + 1).add(sy - sx - radius - 1);
        bCoeffs.add(sx + sy + radius + 1).add(sx + sy - radius - 1);
    }
    for (const a of aCoeffs) {
        for (const b of bCoeffs) {
            // x and y are the intersection point of the 2 coefficients
            const x = (b - a) / 2;
            const y = (a + b) / 2;
            // check if point is in bounds
            if (x >= minVal && y >= minVal && x <= maxVal && y <= maxVal) {
                let isValid = true;
                // ensure no scanner can reach the intersection point
                for (const [xx, yy] of scanners) {
                    if (getDist(x, y, xx, yy) <= radiusMap[xx + ' ' + yy]) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) return x * xMul + y;
            }
        }
    }
    return 0;
};

const testInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

console.log('Target and boundary values are different');
console.log('between sample input and full input. These');
console.log('can be changed by commenting/uncommenting');
console.log('rows in the part1 and part2 functions.');
console.log;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 26,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 56000011,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
