import run from 'aocrunner';

const ELF = '#';
const EMPTY = '.';
const DIRS = [1, 0, -1];

const parseInput = (rawInput) => {
    const lines = rawInput.split('\n');
    const elves = new Set();
    for (let r = 0; r < lines.length; ++r) {
        for (let c = 0; c < lines[0].length; ++c) {
            if (lines[r][c] === ELF) {
                elves.add(r + ' ' + c);
            }
        }
    }
    return elves;
};

const isStable = (r, c, elves) => {
    for (const rr of DIRS) {
        for (const cc of DIRS) {
            if (rr === 0 && cc === 0) continue;
            const nr = r + rr;
            const nc = c + cc;
            if (elves.has(nr + ' ' + nc)) return false;
        }
    }
    return true;
};

const canMove = (r, c, elves, dirSet) => {
    for (const [rr, cc] of dirSet) {
        const destR = r + rr;
        const destC = c + cc;
        if (elves.has(destR + ' ' + destC)) return false;
    }
    return true;
};

const solve = (elves, maxRounds = Infinity) => {
    const DIR_SETS = [
        [[-1, -1], [-1, 0], [-1, 1]], // [NW, N, NE]
        [[1, -1], [1, 0], [1, 1]],    // [SW, S, SE]
        [[-1, -1], [0, -1], [1, -1]], // [NW, W, SW]
        [[-1, 1], [0, 1], [1, 1]]     // [NE, E, SE]
    ]; //prettier-ignore

    let rounds = 0;

    while (rounds < maxRounds) {
        ++rounds;
        const proposals = {};
        let madeMove = false;

        for (const elf of elves) {
            const [r, c] = elf.split(' ').map(Number);
            if (isStable(r, c, elves)) continue;
            for (const dirSet of DIR_SETS) {
                if (canMove(r, c, elves, dirSet)) {
                    const destR = r + dirSet[1][0];
                    const destC = c + dirSet[1][1];
                    const dest = destR + ' ' + destC;
                    if (!proposals[dest]) proposals[dest] = [];
                    proposals[dest].push(elf);
                    break;
                }
            }
        }

        for (const dest in proposals) {
            if (proposals[dest].length === 1) {
                madeMove = true;
                elves.delete(proposals[dest][0]);
                elves.add(dest);
            }
        }

        if (!madeMove) break;

        DIR_SETS.push(DIR_SETS.shift());
    }

    let minR = Infinity;
    let maxR = -Infinity;
    let minC = Infinity;
    let maxC = -Infinity;

    for (const elf of elves) {
        const [r, c] = elf.split(' ').map(Number);
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
    }

    return [rounds, minR, maxR, minC, maxC];
};

const part1 = (rawInput) => {
    const elves = parseInput(rawInput);
    const [rounds, minR, maxR, minC, maxC] = solve(elves, 10);
    return (maxR - minR + 1) * (maxC - minC + 1) - elves.size;
};

const part2 = (rawInput) => {
    const elves = parseInput(rawInput);
    const [rounds, minR, maxR, minC, maxC] = solve(elves);
    return rounds;
};

const testInput = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 110,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 20,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
