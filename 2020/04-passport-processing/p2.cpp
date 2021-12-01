#include "../aoc.h"

std::vector<std::string> splitString(std::string str, std::string delimiter) {
  std::vector<std::string> tokens;
  tokens.reserve(8);
  std::string token;
  size_t pos = 0;

  while ((pos = str.find(delimiter)) != std::string::npos) {
      token = str.substr(0, pos);
      tokens.push_back(token);
      str.erase(0, pos + delimiter.length());
  }

  tokens.push_back(str);
  return tokens;
}

// regex matching fields
std::regex hcl("^#[0-9a-f]{6}$");
std::regex ecl("^(?:amb|blu|brn|gry|grn|hzl|oth)$");
std::regex pid("^[0-9]{9}$");

bool isValidPassportField(const std::string &key, const std::string &val) {
  if (key == "byr") { return val.length() == 4 && std::stoi(val) >= 1920 && std::stoi(val) <= 2002; }
  if (key == "iyr") { return val.length() == 4 && std::stoi(val) >= 2010 && std::stoi(val) <= 2020; }
  if (key == "eyr") { return val.length() == 4 && std::stoi(val) >= 2020 && std::stoi(val) <= 2030; }

  if (key == "hgt") {
    int min, max;

    if (val.find("cm") != std::string::npos) { min = 150; max = 193; }
    else if (val.find("in") != std::string::npos) { min = 59; max = 76; }
    else return false;

    int unitVal = std::stoi(val.substr(0, val.size() - 2));
    return unitVal >= min && unitVal <= max;
  }

  if (key == "hcl") { return std::regex_match(val, hcl); }
  if (key == "ecl") { return std::regex_match(val, ecl); }
  if (key == "pid") { return std::regex_match(val, pid); }

  // not a field we care about at this point
  return false;
}

int main() {
  int validPassportCount = 0;
  std::ifstream newfile("input.txt", std::ios::in);

  if (newfile.is_open()) {
    std::string passportText;
    std::string line;

    while(getline(newfile, line)) {
      if (!line.size()) {
        int validFields = 0;

        for (std::string str : splitString(passportText, " ")) {
          std::vector<std::string> parts = splitString(str, ":");
          if (isValidPassportField(parts[0], parts[1])) ++validFields;
        }

        if (validFields == 7) ++validPassportCount;
        std::cout << "Valid Fields: " << validFields << ", Passport: " << passportText << "\n\n";
        passportText.clear();
      } else {
        passportText += " " + line;
      }
    }

    newfile.close();
  }

  std::cout << "Total Valid Passports: " << validPassportCount << std::endl;

  return 0;
}
