const fs = require('fs');

const input = fs
    .readFileSync('./input')
    .toString()
    .split('\n')
    .filter(line => line !== '')
    .reduce(
        (acc, cur) => {
            if (acc[acc.length - 1].length === 18) acc.push([]);
            acc[acc.length - 1].push(cur.split(' '));
            return acc;
        },
        [[]]
    );

const process = (chunk, zValue, digit) => {
    const values = { w: 0, x: 0, y: 0, z: zValue };
    for (let [inst, a, b] of chunk) {
        // convert b to either the value of the variable it refers to or convert the stringNumber to a number
        if (b !== undefined) {
            if (b.charCodeAt() > 118) b = values[b];
            else b = parseInt(b);
        }
        switch (inst) {
            case 'inp':
                values[a] = digit;
                break;
            case 'add':
                values[a] += b;
                break;
            case 'mul':
                values[a] *= b;
                break;
            case 'div':
                if (b === 0) return Infinity;
                const q = values[a] / b;
                values[a] = Math.floor(q + (q < 0 ? 1 : 0));
                break;
            // attempting to execute mod with a<0 or b<=0 will cause the program to crash
            case 'mod':
                if (values[a] < 0 || b <= 0) return Infinity;
                values[a] %= b;
                break;
            case 'eql':
                values[a] = values[a] === b ? 1 : 0;
                break;
        }
    }
    return values.z;
};

/*
    Basically we are trying all digits from 9 to 1 for each spot.
    We can cache the results by storing `idx z` in a set (not valid if in set, early pruning)
    Factor processing logic into separate function.
*/
const solve = (input, options) => {
    const cache = Array.from(Array(14), () => []);
    const digits = Array(14);
    let result;

    const helper = (idx, curZ) => {
        if (idx === digits.length) {
            result = parseInt(digits.join(''));
            return curZ === 0;
        }
        if (cache[idx][curZ]) return false;
        for (const d of options) {
            digits[idx] = d;
            const newZ = process(input[idx], curZ, d);
            if (newZ !== Infinity && helper(idx + 1, newZ)) return true;
        }
        cache[idx][curZ] = true;
        return false;
    };

    helper(0, 0);
    return result;
};

// Part 1: To enable as many submarine features as possible, find the largest valid fourteen-digit model number that
// contains no 0 digits. What is the largest model number accepted by MONAD?
const p1 = input => {
    return solve(input, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
};

// Part 2:
const p2 = input => {
    return solve(input, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.log('Expected:', 96929994293996);
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.log('Expected:', 41811761181141);
console.timeEnd('Part 2 Time');
