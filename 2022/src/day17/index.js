import run from 'aocrunner';

const solve = (jets, k) => {
    const sum = (a, b) => a + b;

    const rocks = [
        { height: 1, offsets: [[0, 0], [0, 1], [0, 2], [0, 3]]},
        { height: 3, offsets: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]},
        { height: 3, offsets: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]},
        { height: 4, offsets: [[0, 0], [1, 0], [2, 0], [3, 0]]},
        { height: 2, offsets: [[0, 0], [0, 1], [1, 0], [1, 1]]}
    ]; // prettier-ignore

    const states = new Map();
    const grid = [];
    let cycleHeight = 0;

    for (let ri = 0, ji = 0; ri < k; ++ri) {
        const rock = rocks[ri % rocks.length];

        const gridState = grid
            .slice(-10)
            .map((row) => row.join(''))
            .join('');

        const state = (ri % rocks.length) + ' ' + (ji % jets.length) + ' ' + gridState;

        if (states.has(state)) {
            // we found a cycle - take as many as possible, then go back to simulating to finish out
            const { prevIdx, prevHeight } = states.get(state);
            const curHeight = grid.length + cycleHeight;
            const idxGap = ri - prevIdx;
            const heightGap = curHeight - prevHeight;
            const steps = Math.floor((k - ri - 1) / idxGap);
            cycleHeight += steps * heightGap;
            ri += steps * idxGap - 1; // adjust for increment in for loop
            states.clear(); // clear states and finish simulation from end of final cycle to end of rock count
            continue;
        } else {
            states.set(state, { prevIdx: ri, prevHeight: grid.length });
        }

        let r = grid.length + 3;
        let c = 2;

        while (grid.length < r + rock.height) grid.push(Array(7).fill(0));

        while (true) {
            const nextC = c + (jets[ji++ % jets.length] === '<' ? -1 : 1);
            // check to see if horizontal move is valid
            if (!rock.offsets.some(([or, oc]) => nextC + oc < 0 || nextC + oc === 7 || grid[r + or][nextC + oc]))
                c = nextC;
            // check to see if downward move is valid
            if (rock.offsets.some(([or, oc]) => r + or - 1 < 0 || grid[r + or - 1][c + oc])) break;
            // continue moving down if no rocks in our way
            --r;
        }

        // mark coordinates of rock on grid after it comes to rest
        for (const [or, oc] of rock.offsets) {
            grid[r + or][c + oc] = 1;
        }

        // delete blank rows on top
        // this keeps the top of our state consistent
        for (let i = grid.length - 1; i >= 0; --i) {
            if (grid[i].reduce(sum, 0) === 0) {
                grid.pop();
            } else {
                break;
            }
        }
    }

    return grid.length + cycleHeight;
};

const part1 = (jets) => {
    return solve(jets, 2022);
};

const part2 = (jets) => {
    return solve(jets, 1_000_000_000_000);
};

run({
    part1: {
        tests: [
            {
                input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
                expected: 3068,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
                expected: 1514285714288,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
