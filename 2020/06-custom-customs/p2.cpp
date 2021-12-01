#include "../aoc.h"

int frequenciesMatchingTarget(int target, const std::unordered_map<char, int> &frequencies) {
  int result = 0;
  for (const auto &iter : frequencies) {
    if (iter.second  == target) ++result;
  }
  return result;
}

int main() {
  int sum = 0;
  std::ifstream input("input.txt", std::ios::in);

  if (input.is_open()) {
    std::unordered_map<char, int> answers;
    std::string line;
    int curGroupSize = 0;

    while(getline(input, line)) {
      if (line.length()) {
        for (char c : line) ++answers[c];
        ++curGroupSize;
      } else {
        sum += frequenciesMatchingTarget(curGroupSize, answers);
        curGroupSize = 0;
        answers.clear();
      }
    }

    input.close();
  }

  std::cout << "Sum of unanimous answers: " << sum << std::endl;

  return 0;
}
