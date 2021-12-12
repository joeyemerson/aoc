const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const buildUndirectedGraph = input => {
  const graph = {};

  for (const line of input) {
    const [u, v] = line.split('-');
    graph[u] = graph[u] || [];
    graph[v] = graph[v] || [];
    graph[u].push(v);
    graph[v].push(u);
  }

  return graph;
};

const isSmallCave = cave => /[a-z]/.test(cave);

// Part 1: How many paths through this cave system are there that visit small caves at most once?
const p1 = input => {
  const caves = buildUndirectedGraph(input);

  const dfs = (cave, visited = new Set()) => {
    if (cave === 'end') return 1;
    if (visited.has(cave) && isSmallCave(cave)) return 0;

    let result = 0;

    visited.add(cave);

    for (const nextCave of caves[cave]) {
      result += dfs(nextCave, visited);
    }

    visited.delete(cave);

    return result;
  };

  return dfs('start');
};

// Part 2: After reviewing the available paths, you realize you might have time to visit a single small cave twice.
// Given these new rules, how many paths through this cave system are there?
const p2 = input => {
  const caves = buildUndirectedGraph(input);

  const dfs = (cave, visited = {}, doubleSmallFlag = false) => {
    if (cave === 'end') return 1;

    if (visited[cave] && isSmallCave(cave)) {
      if (doubleSmallFlag) return 0;
      else doubleSmallFlag = true;
    }

    let result = 0;

    visited[cave] = visited[cave] + 1 || 1;

    for (const nextCave of caves[cave]) {
      if (nextCave !== 'start') {
        result += dfs(nextCave, visited, doubleSmallFlag);
      }
    }

    --visited[cave];

    return result;
  };

  return dfs('start');
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
