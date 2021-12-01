#include "../aoc.h"

uint64_t part1(const std::vector<uint64_t> &adapters) {
  uint64_t v1 = 0, v3 = 1;

  for (size_t i = 1; i < adapters.size(); ++i) {
    uint64_t diff = adapters[i] - adapters[i - 1];
    if (diff == 1) ++v1;
    if (diff == 3) ++v3;
  }

  return v1 * v3;
}

// Exploits fact that gaps in input are only 1 and 3 - no 2 gaps.
// Possible combinations of consecutive subsequences:
  // Length 3: 2
  // Length 4: 4
  // Length 5: 7
// Don't need to worry about subsequences of 1 or 2 length - only 1 possible path.
// Input doesn't contain any consecutive subsequences of length greater than 5.
uint64_t part2a(const std::vector<uint64_t> &adapters) {
  uint64_t possiblePaths = 1;
  size_t longestPossibleSubsequence = 5;
  std::vector<uint64_t> bases =   { 1, 1, 1, 2, 4, 7 };
  std::vector<uint64_t> lengths = { 0, 0, 0, 0, 0, 0 };

  uint64_t curLen = 1;
  for (size_t i = 0; i < adapters.size() - 1; ++i) {
    if (adapters[i+1] - adapters[i] == 1) {
      ++curLen;
    } else {
      ++lengths[curLen];
      curLen = 1;
    }
  }

  ++lengths[curLen]; // have to account for final subsequence

  for (size_t i = 0; i <= longestPossibleSubsequence; ++i) {
    possiblePaths *= pow(bases[i], lengths[i]);
  }

  return possiblePaths;
}

// Moves through list in reverse and tablulates every possible move for each adapter
// from current position + 1 to end.
uint64_t part2b(const std::vector<uint64_t> &adapters) {
  std::vector<uint64_t> pathTabulation(adapters.size(), 0);
  pathTabulation.reserve(adapters.size());
  pathTabulation.at(pathTabulation.size() - 1) = 1;

  for(int i = pathTabulation.size() - 1; i >= 0; --i){
    for (size_t j = i + 1; j < adapters.size() && adapters[j] - adapters[i] <= 3; ++j) {
      pathTabulation[i] += pathTabulation[j];
    }
  }

  return pathTabulation[0];
}

int main() {
  std::vector<uint64_t> adapters = { 0 }; // initialize with wall outlet

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string line;
    while(getline(input, line)) { adapters.emplace_back(std::stoull(line)); }
    input.close();
  }

  std::sort(adapters.begin(), adapters.end());

  uint64_t p1 = part1(adapters);
  uint64_t p2a = part2a(adapters);
  uint64_t p2b = part2b(adapters);

  std::cout << "Part 1:  " << p1 << std::endl;
  std::cout << "Part 2a: " << p2a << std::endl;
  std::cout << "Part 2b: " << p2b << std::endl;

  return 0;
}
