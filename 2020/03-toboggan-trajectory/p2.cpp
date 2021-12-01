#include "../aoc.h"

int main() {
  std::vector<std::string> matrix;
  matrix.reserve(323);

  std::ifstream file("input.txt", std::ios::in);
  if (file.is_open()) {
    std::string line;
    while(getline(file, line)) {
      matrix.push_back(line);
    }
    file.close();
  }

  std::vector<uint32_t> treeCounts = { 0, 0, 0, 0, 0 };
  uint32_t width = matrix[0].length();
  uint32_t i = 0, j = 0;

  while (i < matrix.size()) {
    if (matrix[i][j%width] == '#') ++treeCounts[0];
    if (matrix[i][(j*3)%width] == '#') ++treeCounts[1];
    if (matrix[i][(j*5)%width] == '#') ++treeCounts[2];
    if (matrix[i][(j*7)%width] == '#') ++treeCounts[3];
    if (i*2 < matrix.size() && matrix[i*2][j%width] == '#') ++treeCounts[4];
    ++i, ++j;
  }

  u_int32_t productOfTreeCounts = std::accumulate(
    treeCounts.begin(), treeCounts.end(), 1, std::multiplies<u_int32_t>()
  );

  std::cout << "Product of tree counts: " << productOfTreeCounts << std::endl;

  return 0;
}
