import run from 'aocrunner';
import PriorityQueue from '../utils/PriorityQueue.js';

const parseInput = (rawInput) => {
    return rawInput.split('\n').map((line) => {
        return [...line].map((char) => {
            if (/[a-z]/.test(char)) return char.charCodeAt() - 97;
            return char;
        });
    });
};

const shortestPath = (map, startRow, startCol, endRow, endCol, curMin = Infinity) => {
    const height = map.length;
    const width = map[0].length;
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // prettier-ignore
    const pq = new PriorityQueue((a, b) => a[2] < b[2]);
    const visited = Array.from(Array(height), () => Array(width).fill(Infinity));

    pq.enqueue([startRow, startCol, 0]);

    while (!pq.isEmpty()) {
        const [r, c, d] = pq.dequeue();
        if (r === endRow && c === endCol) return d;
        if (d >= curMin) return Infinity;
        if (visited[r][c] <= d) continue;
        visited[r][c] = d;
        for (const [rr, cc] of dirs) {
            const nr = r + rr;
            const nc = c + cc;
            if (nr < 0 || nc < 0 || nr === height || nc === width) continue;
            if (map[nr][nc] - map[r][c] < 2) pq.enqueue([nr, nc, d + 1]);
        }
    }

    return Infinity; // no path found
};

const part1 = (rawInput) => {
    const map = parseInput(rawInput);
    const height = map.length;
    const width = map[0].length;
    let startRow, startCol, endRow, endCol;

    // find start and end locations
    for (let r = 0; r < height; ++r) {
        for (let c = 0; c < width; ++c) {
            if (map[r][c] === 'S') {
                map[r][c] = 0;
                startRow = r;
                startCol = c;
            } else if (map[r][c] === 'E') {
                map[r][c] = 25;
                endRow = r;
                endCol = c;
            }
        }
    }

    return shortestPath(map, startRow, startCol, endRow, endCol);
};

const part2 = (rawInput) => {
    const map = parseInput(rawInput);
    const height = map.length;
    const width = map[0].length;
    const startPoints = [];
    let endRow, endCol;

    // find all start locations and end location
    for (let r = 0; r < height; ++r) {
        for (let c = 0; c < width; ++c) {
            if (map[r][c] === 'S') {
                map[r][c] = 0;
            } else if (map[r][c] === 'E') {
                map[r][c] = 25;
                endRow = r;
                endCol = c;
            }
            if (map[r][c] === 0) {
                startPoints.push([r, c]);
            }
        }
    }

    let minDist = Infinity;

    for (const [r, c] of startPoints) {
        minDist = Math.min(minDist, shortestPath(map, r, c, endRow, endCol, minDist));
    }

    return minDist;
};

run({
    part1: {
        tests: [
            {
                input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
                expected: 31,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
                expected: 29,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
