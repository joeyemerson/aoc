#include "../aoc.h"

class PasswordValidator {
private:
  int lowIndex;
  int highIndex;
  char targetChar;
  std::string password;

public:
  static std::vector<std::string> parse(const std::string &input) {
    std::vector<std::string> parts;
    std::string curPart;

    for (char c : input) {
      if ((c == ' ' || c == '-' || c == ':') && curPart.length()) {
        parts.push_back(curPart);
        curPart.clear();
      } else {
        curPart += c;
      }
    }

    parts.push_back(curPart);
    return parts;
  }

  // Is valid if only one of the index positions has the targetChar.
  bool isValid() {
    return (password[lowIndex] == targetChar) != (password[highIndex] == targetChar);
  }

  PasswordValidator(const std::string &input) {
    std::vector<std::string> parts = PasswordValidator::parse(input);
    lowIndex = std::stoi(parts[0]);
    highIndex = std::stoi(parts[1]);
    targetChar = parts[2][0]; // always a single char
    password = parts[3];
  }
};

int main() {
  std::ifstream newfile("input.txt", std::ios::in);
  int validPasswordCount = 0;

  if (newfile.is_open()) {
    std::string line;

    while(getline(newfile, line)) {
      PasswordValidator pw(line);
      if (pw.isValid()) ++validPasswordCount;
    }

    newfile.close();
  }

  std::cout << validPasswordCount << std::endl;

  return 0;
}