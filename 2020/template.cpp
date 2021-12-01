#include "../aoc.h"

int main() {
  std::ifstream input("input.txt", std::ios::in);

  if (input.is_open()) {
    std::string line;

    while(getline(input, line)) {
      // do something here
    }

    input.close();
  }

  return 0;
}
