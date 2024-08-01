module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?",
  // testRegex: "ShiftPosition\\.test\\.ts",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
  // moduleNameMapper: {
  //   "^@src(.*)": "<rootDir>/src$1"
  // }
  // transformIgnorePatterns: [
  //   "/node_modules/"
  // ],
};
