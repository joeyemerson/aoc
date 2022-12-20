import run from 'aocrunner';

const parseInput = (rawInput) => {
    return rawInput.split('\n').map(Number);
};

const solve = (key, iter, arr) => {
    arr = arr.map((val, idx) => [val * key, idx]);
    let targetIdx = 0;
    let curIdx = 0;
    let curIter = 0;
    while (curIter < iter) {
        if (arr[curIdx][1] === targetIdx) {
            const el = arr.splice(curIdx, 1)[0];
            let newIdx = curIdx + el[0];
            newIdx = (arr.length + (newIdx % arr.length)) % arr.length;
            if (newIdx === 0 && el[0] < 0) arr.push(el);
            else arr.splice(newIdx, 0, el);
            ++targetIdx;
        }
        curIdx = (curIdx + 1) % arr.length;
        if (targetIdx === arr.length) {
            targetIdx = 0;
            ++curIter;
        }
    }
    const zeroIdx = arr.findIndex((el) => el[0] === 0);
    return (
        arr[(zeroIdx + 1000) % arr.length][0] +
        arr[(zeroIdx + 2000) % arr.length][0] +
        arr[(zeroIdx + 3000) % arr.length][0]
    );
};

const part1 = (rawInput) => {
    const arr = parseInput(rawInput);
    return solve(1, 1, arr);
};

const part2 = (rawInput) => {
    const arr = parseInput(rawInput);
    return solve(811589153, 10, arr);
};

const testInput = `1
2
-3
3
-2
0
4`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 3,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 1623178306,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
