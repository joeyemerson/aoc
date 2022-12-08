import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n').map((row) => [...row].map(Number));

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const h = input.length;
    const w = input[0].length;
    const visible = input.map((row) => row.map(() => 0));
    for (let r = 0; r < h; ++r) {
        let p = -1;
        for (let c = 0; c < w; ++c) {
            if (input[r][c] > p) visible[r][c] = 1;
            p = Math.max(p, input[r][c]);
        }
        p = -1;
        for (let c = w - 1; c >= 0; --c) {
            if (input[r][c] > p) visible[r][c] = 1;
            p = Math.max(p, input[r][c]);
        }
    }
    for (let c = 0; c < w; ++c) {
        let p = -1;
        for (let r = 0; r < h; ++r) {
            if (input[r][c] > p) visible[r][c] = 1;
            p = Math.max(p, input[r][c]);
        }
        p = -1;
        for (let r = h - 1; r >= 0; --r) {
            if (input[r][c] > p) visible[r][c] = 1;
            p = Math.max(p, input[r][c]);
        }
    }
    return visible.reduce((acc, cur) => {
        return acc + cur.reduce((sum, num) => sum + num, 0);
    }, 0);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const h = input.length;
    const w = input[0].length;
    const go = (r, c, d, val) => {
        if (r < 0 || c < 0 || r === h || c === w) return 0;
        if (input[r][c] >= val) return 1;
        return 1 + go(r + d[0], c + d[1], d, val);
    };
    let max = 0;
    for (let r = 0; r < h; ++r) {
        for (let c = 0; c < w; ++c) {
            let p = 1;
            for (const dir of [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ]) {
                p *= go(r + dir[0], c + dir[1], dir, input[r][c]);
            }
            max = Math.max(max, p);
        }
    }
    return max;
};

run({
    part1: {
        tests: [
            {
                input: `30373
25512
65332
33549
35390`,
                expected: 21,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `30373
25512
65332
33549
35390`,
                expected: 8,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
