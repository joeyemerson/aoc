#include "../aoc.h"

int main() {
  std::vector<std::string> matrix;
  int treeCount;
  int width;

  std::ifstream file("input.txt", std::ios::in);

  if (file.is_open()) {
    std::string line;

    while(getline(file, line)) {
      matrix.push_back(line);
    }

    file.close();
  }

  width = matrix[0].length();
  int x = 0, y = 0;

  while (y < matrix.size()) {
    if (matrix[y][x%width] == '#') ++treeCount;
    x += 3;
    ++y;
  }

  std::cout << "Tree Count: " << treeCount << std::endl;

  return 0;
}
