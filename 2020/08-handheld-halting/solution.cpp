#include "../aoc.h"

struct Instruction {
  std::string op;
  int arg;

  Instruction(std::string &input) {
    op = input.substr(0, 3);
    arg = std::stoi(input.substr(4));
  }
};

class Program {
private:
  std::vector<Instruction> instructions;
  std::unordered_set<int> seen;
  int lastChangeIdx = -1;

  bool hasInfiniteLoop() {
    int ptr = 0;

    while (ptr < instructions.size() && seen.find(ptr) == seen.end()) {
      seen.emplace(ptr);
      if (instructions[ptr].op == "jmp") { ptr += instructions[ptr].arg - 1; }
      ++ptr;
    }

    seen.clear();
    return ptr != instructions.size();
  }

  void changeNextOp() {
    // revert back previous change if exists
    if (lastChangeIdx > -1) {
      instructions[lastChangeIdx].op = instructions[lastChangeIdx].op == "jmp" ? "nop" : "jmp";
    }

    // find next qualifying op and change that value
    int idx = lastChangeIdx < 0 ? 0 : lastChangeIdx + 1;
    while (idx < instructions.size()) {
      if (instructions[idx].op == "jmp" || instructions[idx].op == "nop") break;
      ++idx;
    }

    instructions[idx].op = instructions[idx].op == "jmp" ? "nop" : "jmp";
    lastChangeIdx = idx;
  }

public:
  Program(std::ifstream input) {
    if (input.is_open()) {
      std::string line;
      while(getline(input, line)) { instructions.emplace_back(Instruction(line)); }
      input.close();
    }
  }

  int execute() {
    int acc = 0;
    int ptr = 0;
    int curArg;
    std::string curOp;

    while (seen.find(ptr) == seen.end() && ptr < instructions.size()) {
      seen.emplace(ptr);
      curOp = instructions[ptr].op;
      curArg = instructions[ptr].arg;
      if (curOp == "acc") { acc += curArg; }
      if (curOp == "jmp") { ptr += curArg - 1; }
      ++ptr;
    }

    seen.clear();
    return acc;
  }

  void fix() {
    while (this->hasInfiniteLoop()) {
      this->changeNextOp();
    }
  }
};

int main() {
  Program program(std::ifstream("input.txt", std::ios::in));
  std::cout << "Part 1: " << program.execute() << std::endl;
  program.fix();
  std::cout << "Part 2: " << program.execute() << std::endl;

  return 0;
}
