#include "../aoc.h"

std::vector<std::string> splitString(std::string &str, const std::string &delimiter) {
  std::vector<std::string> tokens;
  std::string token;
  int pos = 0;

  while ((pos = str.find(delimiter)) != std::string::npos) {
    token = str.substr(0, pos);
    tokens.push_back(token);
    str.erase(0, pos + delimiter.length());
  }

  tokens.push_back(str);
  return tokens;
}

struct Bag {
  std::vector<std::pair<std::string, int>> containedItems;

  Bag(std::string &contents) {
    if (contents != "no other bags") {
      std::vector<std::string> items = splitString(contents, ", ");

      for (std::string &item : items) {
        std::vector<std::string> parts = splitString(item, " ");
        int qty = std::stoi(parts[0]);
        std::string color = parts[1] + " " + parts[2];
        containedItems.emplace_back(std::pair<std::string, int>(color, qty));
      }
    }
  }
};

bool isValidOuterBag(
  const std::string &color,
  const std::string &target,
  const std::unordered_map<std::string, Bag> &bags,
  std::unordered_map<std::string, bool> &memo
) {
  if (memo.find(color) != memo.end()) return memo.at(color);

  for (const auto &it : bags.at(color).containedItems) {
    bool targetFound = (it.first == target) || isValidOuterBag(it.first, target, bags, memo);
    memo.emplace(it.first, targetFound);
    if (targetFound) return true;
  }

  return false;
}

int countBagContents(const std::string &color, const std::unordered_map<std::string, Bag> &bags) {
  int totalBags = 1;

  for (const auto &it : bags.at(color).containedItems) {
    totalBags += it.second * countBagContents(it.first, bags);
  }

  return totalBags;
}

int main() {
  std::string myBag = "shiny gold";
  std::unordered_map<std::string, Bag> bags;

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string line;

    while(getline(input, line)) {
      std::vector<std::string> parts = splitString(line, " bags contain ");
      parts[1].pop_back(); // remove the trailing period
      bags.emplace(parts[0], Bag(parts[1]));
    }

    input.close();
  }

  int validOuterBags = 0;
  std::unordered_map<std::string, bool> memo;
  for (auto &it : bags) {
    if (isValidOuterBag(it.first, myBag, bags, memo)) ++validOuterBags;
  }

  std::cout << "Part 1: " << validOuterBags - 1 << std::endl;
  std::cout << "Part 2: " << countBagContents(myBag, bags) - 1 << std::endl;

  return 0;
}
