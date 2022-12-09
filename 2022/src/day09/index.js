import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n').map((line) => line.split(' '));

const moveHead = (x, y, dir, steps) => {
    const dirs = { U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0] };
    return [x + dirs[dir][0] * steps, y + dirs[dir][1] * steps];
};

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const visited = new Set();
    visited.add('0 0');
    let hx = 0,
        hy = 0,
        tx = 0,
        ty = 0;
    for (const [dir, steps] of input) {
        [hx, hy] = moveHead(hx, hy, dir, steps);
        while (distance(hx, hy, tx, ty) >= 2) {
            if (tx !== hx) {
                tx += hx > tx ? 1 : -1;
            }
            if (ty !== hy) {
                ty += hy > ty ? 1 : -1;
            }
            visited.add(tx + ' ' + ty);
        }
    }
    return visited.size;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const visited = new Set();
    visited.add('0 0');
    // head is 0, tail is 9
    const knots = Array.from(Array(10), () => [0, 0]);
    for (const [dir, steps] of input) {
        const [newHx, newHy] = moveHead(...knots[0], dir, steps);
        while (knots[0][0] !== newHx || knots[0][1] !== newHy) {
            knots[0][0] += knots[0][0] < newHx ? 1 : knots[0][0] > newHx ? -1 : 0;
            knots[0][1] += knots[0][1] < newHy ? 1 : knots[0][1] > newHy ? -1 : 0;
            for (let i = 1; i < 10; ++i) {
                if (distance(...knots[i], ...knots[i - 1]) >= 2) {
                    if (knots[i][0] !== knots[i - 1][0]) {
                        knots[i][0] += knots[i - 1][0] > knots[i][0] ? 1 : -1;
                    }
                    if (knots[i][1] !== knots[i - 1][1]) {
                        knots[i][1] += knots[i - 1][1] > knots[i][1] ? 1 : -1;
                    }
                    if (i === 9) visited.add(knots[i].join(' '));
                }
            }
        }
    }
    return visited.size;
};

run({
    part1: {
        tests: [
            {
                input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
                expected: 13,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
                expected: 1,
            },
            {
                input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
                expected: 36,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
