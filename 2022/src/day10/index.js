import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n').map((line) => line.split(' '));

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const values = [];
    let result = 0;
    let x = 1;

    for (const [inst, val] of input) {
        values.push(x);
        if (inst === 'addx') {
            values.push(x);
            x += parseInt(val);
        }
    }

    //20th, 60th, 100th, 140th, 180th, and 220th cycles
    for (let i = 20; i <= 220; i += 40) {
        result += values[i - 1] * i;
    }

    return result;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const grid = Array.from(Array(6), () => Array(40).fill('.'));

    const fillPixel = (idx) => {
        const row = Math.floor(idx / 40);
        grid[row][idx % 40] = '#';
    };

    let cycle = 0;
    let x = 0;

    for (const [inst, val] of input) {
        let mod = cycle % 40;
        if (mod === x || mod === x + 1 || mod === x + 2) {
            fillPixel(cycle);
        }
        if (inst === 'addx') {
            ++cycle;
            mod = cycle % 40;
            if (mod === x || mod === x + 1 || mod === x + 2) {
                fillPixel(cycle);
            }
            x += parseInt(val);
        }
        ++cycle;
    }

    // I generated hashes for the letters in my solution. I would expand for the full alphabet,
    // but I don't know exactly how the other characters are formed...
    const lookup = new Map([
        [15803535, 'Z'],
        [6920601, 'U'],
        [1145239, 'P'],
        [9795991, 'R'],
        [1120031, 'F'],
        [15800095, 'E'],
        [6885782, 'C'],
        [15798545, 'L'],
    ]);

    const getHashes = (grid) => {
        const hashes = Array(8).fill(0);
        for (let row = 0; row < 6; ++row) {
            for (let col = 0; col < grid[row].length; col += 5) {
                for (let i = col; i < col + 4; ++i) {
                    if (grid[row][i] === '#') hashes[col / 5] |= 1 << (row * 4 + (i % 5));
                }
            }
        }
        return hashes;
    };

    const hashes = getHashes(grid);

    return hashes.map((hash) => lookup.get(hash) || '.').join('');
};

const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 13140,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: '........',
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
