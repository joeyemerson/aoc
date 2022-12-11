import run from 'aocrunner';

class Monkey {
    constructor(items, aVal, bVal, op, testVal, trueIdx, falseIdx) {
        this.items = items;
        this.aVal = aVal;
        this.bVal = bVal;
        this.op = op;
        this.testVal = testVal;
        this.trueIdx = trueIdx;
        this.falseIdx = falseIdx;
        this.itemsHandled = 0;
    }
}

const parseInput = (rawInput) => {
    const lines = rawInput.split('\n');
    const monkeys = [];
    for (let i = 0; i < lines.length; i += 7) {
        const [_, itemString] = lines[i + 1].split(': ');
        const items = itemString.split(', ').map(Number);
        let [aVal, op, bVal] = lines[i + 2].split(' ').slice(-3);
        const testVal = parseInt(lines[i + 3].split(' ').pop());
        const trueIdx = parseInt(lines[i + 4].split(' ').pop());
        const falseIdx = parseInt(lines[i + 5].split(' ').pop());
        monkeys.push(new Monkey(items, aVal, bVal, op, testVal, trueIdx, falseIdx));
    }
    return monkeys;
};

const part1 = (rawInput) => {
    const monkeys = parseInput(rawInput);
    const rounds = 20;

    for (let i = 0; i < rounds; ++i) {
        for (const m of monkeys) {
            for (const item of m.items) {
                const aVal = m.aVal === 'old' ? item : m.aVal;
                const bVal = m.bVal === 'old' ? item : m.bVal;
                const newItem = Math.floor(eval(aVal + m.op + bVal) / 3);
                if (newItem % m.testVal === 0) monkeys[m.trueIdx].items.push(newItem);
                else monkeys[m.falseIdx].items.push(newItem);
            }
            m.itemsHandled += m.items.length;
            m.items = [];
        }
    }
    monkeys.sort((a, b) => b.itemsHandled - a.itemsHandled);

    return monkeys[0].itemsHandled * monkeys[1].itemsHandled;
};

const part2 = (rawInput) => {
    const monkeys = parseInput(rawInput);
    const rounds = 10000;

    const gcd = (a, b) => (!b ? a : gcd(b, a % b));
    const lcm = (a, b) => (a * b) / gcd(a, b);

    const mod = monkeys.reduce((acc, cur) => lcm(acc, cur.testVal), 1);

    for (let i = 0; i < rounds; ++i) {
        for (const m of monkeys) {
            for (const item of m.items) {
                const aVal = m.aVal === 'old' ? item : m.aVal;
                const bVal = m.bVal === 'old' ? item : m.bVal;
                const newItem = eval(aVal + m.op + bVal) % mod;
                if (newItem % m.testVal === 0) monkeys[m.trueIdx].items.push(newItem);
                else monkeys[m.falseIdx].items.push(newItem);
            }
            m.itemsHandled += m.items.length;
            m.items = [];
        }
    }

    monkeys.sort((a, b) => b.itemsHandled - a.itemsHandled);

    return monkeys[0].itemsHandled * monkeys[1].itemsHandled;
};

const testInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
If true: throw to monkey 2
If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
If true: throw to monkey 2
If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
If true: throw to monkey 1
If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
If true: throw to monkey 0
If false: throw to monkey 1`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 10605,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 2713310158,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
