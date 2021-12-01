#include "../aoc.h"

int main() {
  int sum = 0;

  std::ifstream input("input.txt", std::ios::in);

  if (input.is_open()) {
    std::unordered_set<char> answers;
    std::string line;

    while(getline(input, line)) {
      if (line.length()) {
        for (char c : line) {
          answers.emplace(c);
        }
      } else {
        sum += answers.size();
        answers.clear();
      }
    }

    input.close();
  }

  std::cout << sum << std::endl;

  return 0;
}
