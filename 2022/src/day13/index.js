import run from 'aocrunner';

const parseInput = (rawInput) => {
    const pairs = rawInput.split('\n\n');
    return pairs.map((pair) => {
        const [a, b] = pair.split('\n');
        return [eval(a), eval(b)];
    });
};

const evaluate = (a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); ++i) {
        if (typeof a[i] === 'number' && typeof b[i] === 'number') {
            if (a[i] < b[i]) return true;
            if (a[i] > b[i]) return false;
            continue;
        }
        if (typeof a[i] === 'number') a[i] = [a[i]];
        else if (typeof b[i] === 'number') b[i] = [b[i]];
        const res = evaluate(a[i], b[i]);
        if (typeof res === 'boolean') return res;
    }
    return a.length < b.length ? true : a.length > b.length ? false : undefined;
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let result = 0;
    for (let i = 0; i < input.length; ++i) {
        if (evaluate(input[i][0], input[i][1])) {
            result += i + 1;
        }
    }
    return result;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const packets = [];
    for (const [a, b] of input) {
        packets.push({ arr: a }, { arr: b });
    }
    packets.push({ arr: [[2]], isDivider: true }, { arr: [[6]], isDivider: true });
    packets.sort((a, b) => (evaluate(a.arr, b.arr) ? -1 : 1));
    let result = 1;
    for (let i = 0; i < packets.length; ++i) {
        if (packets[i].isDivider) result *= i + 1;
    }
    return result;
};

const testInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 13,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 140,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
