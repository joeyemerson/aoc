import run from 'aocrunner';

const parseInput = (rawInput) => {
    const monkeys = {};
    rawInput.split('\n').forEach((line) => {
        const [name, value] = line.split(': ');
        const num = parseInt(value);
        if (isNaN(num)) monkeys[name] = value;
        else monkeys[name] = num;
    });
    return monkeys;
};

const solve = (name, monkeys, part, humanVal) => {
    if (part === 2 && name === 'humn') return humanVal;
    if (typeof monkeys[name] === 'number') return monkeys[name];
    const [left, op, right] = monkeys[name].split(' ');
    const leftVal = solve(left, monkeys, part, humanVal);
    const rightVal = solve(right, monkeys, part, humanVal);
    const result = eval(leftVal + op + rightVal);
    monkeys[name] = result;
    if (part === 2 && name === 'root') return [leftVal, rightVal];
    return result;
};

const part1 = (rawInput) => {
    const monkeys = parseInput(rawInput);
    return solve('root', monkeys, 1);
};

const part2 = (rawInput) => {
    const monkeys = parseInput(rawInput);
    const [a, b] = solve('root', { ...monkeys }, 2, 0); // get direction with initial human value of 0
    const dir = a < b ? 'up' : 'down';
    let lo = 0;
    let hi = 1e13;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const [a, b] = solve('root', { ...monkeys }, 2, mid);
        if ((dir === 'up' && a < b) || (dir === 'down' && a > b)) lo = mid + 1;
        else hi = mid;
    }
    return lo;
};

const testInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 152,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 301,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
