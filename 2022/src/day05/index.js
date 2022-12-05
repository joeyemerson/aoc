import run from 'aocrunner';

const parseInput = (rawInput) => {
    const [stackStrings, instructions] = rawInput.split('\n\n').map((s) => s.split('\n'));
    const stacks = [];
    stackStrings.pop(); // don't need the row with labels
    for (const row of stackStrings) {
        for (let i = 1; i < row.length; i += 4) {
            if (row[i] === ' ') continue;
            const stackIdx = (i - 1) / 4;
            if (!stacks[stackIdx]) stacks[stackIdx] = [];
            stacks[stackIdx].unshift(row[i]);
        }
    }
    return [stacks, instructions];
};

const part1 = (rawInput) => {
    const [stacks, instructions] = parseInput(rawInput);
    for (const line of instructions) {
        const [amt, from, to] = line.match(/\d+/g).map(Number);
        for (let i = 0; i < amt; ++i) {
            stacks[to - 1].push(stacks[from - 1].pop());
        }
    }
    return stacks.map((stack) => stack.pop()).join('');
};

const part2 = (rawInput) => {
    const [stacks, instructions] = parseInput(rawInput);
    for (const line of instructions) {
        const [amt, from, to] = line.match(/\d+/g).map(Number);
        const len = stacks[to - 1].length;
        for (let i = 0; i < amt; ++i) {
            stacks[to - 1].splice(len, 0, stacks[from - 1].pop());
        }
    }
    return stacks.map((stack) => stack.pop()).join('');
};

run({
    part1: {
        tests: [
            {
                input: `    [D]
[N] [C]
[Z] [M] [P]
  1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
                expected: 'CMZ',
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `    [D]
[N] [C]
[Z] [M] [P]
  1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
                expected: 'MCD',
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
