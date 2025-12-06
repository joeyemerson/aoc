import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const rows = input.split("\n");
    const ops = rows.pop().match(/[*+]/g);
    const results = Array.from(Array(ops.length), (_, i) =>
        ops[i] === "+" ? 0 : 1,
    );
    for (const row of rows) {
        const vals = row.match(/\d+/g).map(Number);
        for (let i = 0; i < vals.length; ++i) {
            if (ops[i] === "+") results[i] += vals[i];
            else results[i] *= vals[i];
        }
    }
    return results.reduce((acc, cur) => acc + cur, 0).toString();
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const rows = input.split("\n");
    const ops = rows.pop().match(/[*+]/g);
    const cols = Array(rows[0].length).fill("");
    for (const row of rows) {
        for (let i = 0; i < row.length; ++i) {
            if (row[i] !== " ") cols[i] += row[i];
        }
    }
    const cur = [];
    let result = 0;
    for (let i = cols.length - 1, flag = false; i >= 0; --i) {
        if (cols[i]) {
            flag = true;
            cur.push(cols[i]);
        } else if (flag) {
            flag = false;
            result += eval(cur.join(ops.pop()));
            cur.length = 0;
        }
    }
    if (cur.length) result += eval(cur.join(ops.pop()));
    return result.toString();
};

run({
    part1: {
        tests: [
            {
                input: `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `,
                expected: "4277556",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `123 328  51 64 \n 45 64  387 23 \n  6 98  215 314 \n*   +   *   +  `,
                expected: "3263827",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
