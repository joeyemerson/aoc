const fs = require('fs');

const input = fs
    .readFileSync('./input')
    .toString()
    .split('\n')
    .filter(line => line !== '');

const EMPTY = '.';
const COSTS = { A: 1, B: 10, C: 100, D: 1000 };
const ROOM_MAP = { A: 1, B: 2, C: 3, D: 4 };
const ROOM_INDICES = { 1: 2, 2: 4, 3: 6, 4: 8 };

const isAmphipod = char => {
    return char === 'A' || char === 'B' || char === 'C' || char === 'D';
};

const isSolved = state => {
    if (state[0].some(isAmphipod)) return false; // top row has no amphipods
    // all rooms have correct amphipods
    for (let r = 1; r < state.length; ++r) {
        for (let c = 0; c < state[r].length; ++c) {
            if (!isInPlace(state, r, c)) return false;
        }
    }
    return true;
};

const isInPlace = (state, r, c) => {
    if (!isAmphipod(state[r][c])) return true;
    const amphipod = state[r][c];
    if (r !== ROOM_MAP[amphipod]) return false;
    return state[r].slice(c + 1).every(x => x === amphipod);
};

const getMoveToRoom = (state, row, col) => {
    const amphipod = state[row][col];
    const targetRoom = ROOM_MAP[amphipod];
    const noop = [-1, -1, 0];
    if (state[targetRoom].some(c => c !== EMPTY && c !== amphipod)) return noop;
    let distance = 0;
    // first move up to hallway if not already there
    while (row > 0 && col > 0) {
        --col;
        ++distance;
        if (isAmphipod(state[row][col])) return noop;
    }
    // next move to room column
    if (row > 0) {
        col = ROOM_INDICES[row]; // reset col to current room idx
        ++distance; // move from top cell of room to hallway
        if (isAmphipod(state[0][col])) return noop;
    }
    while (col !== ROOM_INDICES[targetRoom]) {
        if (col < ROOM_INDICES[targetRoom]) ++col;
        else --col;
        ++distance;
        if (isAmphipod(state[0][col])) return noop;
    }
    // lastly move down into room
    let newPosition = state[targetRoom].indexOf(amphipod) - 1;
    if (newPosition < 0) newPosition = state[targetRoom].length - 1;
    distance += newPosition + 1;
    return [targetRoom, newPosition, distance];
};

const getMoveToHallway = (state, r, c, hallIdx) => {
    let distance = 0;
    // move up to hallway
    let rr = c;
    while (rr > 0) {
        --rr;
        ++distance;
        if (isAmphipod(state[r][rr])) return 0;
    }
    c = ROOM_INDICES[r];
    ++distance; // move into hallway
    // move to location in hallway
    while (c !== hallIdx) {
        if (isAmphipod(state[0][c])) return 0;
        if (c < hallIdx) ++c;
        else --c;
        ++distance;
    }
    return distance;
};

const solve = input => {
    const initialState = [[...'..#.#.#.#..']];
    initialState.push(...Array.from(Array(4), () => []));

    for (let i = 2; i < input.length - 1; ++i) {
        const amphipods = [...input[i]].filter(isAmphipod);
        for (let j = 0; j < amphipods.length; ++j) {
            initialState[j + 1].push(amphipods[j]);
        }
    }

    const solveHelper = (state, cache) => {
        // check if our state is in the cached results. if so, return it.
        const stateString = state.toString();
        if (cache.has(stateString)) return cache.get(stateString);
        if (isSolved(state)) return 0;
        // the optimal move is always to move an amphipod directly to its destination/room
        // if it is available and nothing is blocking the path
        // check this first to see if you can move. if so return cost of that path + solve(new state)
        for (let r = 0; r < state.length; ++r) {
            for (let c = 0; c < state[r].length; ++c) {
                if (!isInPlace(state, r, c)) {
                    const [newRow, newCol, distance] = getMoveToRoom(state, r, c);
                    if (distance > 0) {
                        const amphipod = state[r][c];
                        state[r][c] = EMPTY;
                        state[newRow][newCol] = amphipod;
                        return distance * COSTS[amphipod] + solveHelper(state, cache);
                    }
                }
            }
        }
        // if nobody can move directly to their destination, try all possible moves to a location
        // in the "hallway" or top row
        // amphipods can go to any spot except for those located directly above the rooms
        // find the minimum of all such next moves
        let minCost = Infinity;
        for (let r = 1; r < state.length; ++r) {
            for (let c = 0; c < state[r].length; ++c) {
                // for each amphipod in a room, try each available location in the hallway
                if (isInPlace(state, r, c)) continue;
                const amphipod = state[r][c];
                for (let hallIdx = 0; hallIdx < state[0].length; ++hallIdx) {
                    if (state[0][hallIdx] !== EMPTY) continue;
                    const dist = getMoveToHallway(state, r, c, hallIdx);
                    if (dist > 0) {
                        const newState = state.map(row => [...row]);
                        newState[r][c] = EMPTY;
                        newState[0][hallIdx] = amphipod;
                        minCost = Math.min(minCost, dist * COSTS[amphipod] + solveHelper(newState, cache));
                    }
                }
            }
        }
        // cache the result and return it
        cache.set(stateString, minCost);
        return minCost;
    };

    return solveHelper(initialState, new Map());
};

// Part 1: What is the least energy required to organize the amphipods?
const p1 = input => {
    return solve(input);
};

// Part 2: Add lines to the input
// #D#C#B#A#
// #D#B#A#C#
const p2 = input => {
    const expandedInput = [...input.slice(0, 3), '  #D#C#B#A#  ', '  #D#B#A#C#  ', ...input.slice(3)];
    return solve(expandedInput);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
