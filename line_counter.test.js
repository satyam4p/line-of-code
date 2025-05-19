const {
  Language,
  countLines,
  detectLanguage,
  languages,
} = require("./line_counter");
const fs = require("fs");

// Test data
const testFiles = {
  "test.js": `// This is a comment
const x = 5; // Inline comment
// Another comment

function test() {
    return x;
}

// Last comment`,

  "empty.js": "",

  "only_comments.js": `// Comment 1
// Comment 2
// Comment 3`,

  "mixed.js": `// Header comment
const x = 5;
// Middle comment
function test() {
    return x;
}
// Footer comment`,
};

beforeAll(() => {
  for (const [filename, content] of Object.entries(testFiles)) {
    fs.writeFileSync(filename, content);
  }
});

afterAll(() => {
  for (const filename of Object.keys(testFiles)) {
    fs.unlinkSync(filename);
  }
});

describe("Language class", () => {
  const jsLanguage = new Language("JavaScript", "//");

  test("isBlank should detect empty lines", () => {
    expect(jsLanguage.isBlank("")).toBe(true);
    expect(jsLanguage.isBlank("   ")).toBe(true);
    expect(jsLanguage.isBlank("  \t  ")).toBe(true);
    expect(jsLanguage.isBlank("code")).toBe(false);
  });

  test("isComment should detect comment lines", () => {
    expect(jsLanguage.isComment("// comment")).toBe(true);
    expect(jsLanguage.isComment("  // comment")).toBe(true);
    expect(jsLanguage.isComment("code // comment")).toBe(false);
    expect(jsLanguage.isComment("code")).toBe(false);
  });

  test("isCode should detect code lines", () => {
    expect(jsLanguage.isCode("const x = 5;")).toBe(true);
    expect(jsLanguage.isCode("function test() {}")).toBe(true);
    expect(jsLanguage.isCode("// comment")).toBe(false);
    expect(jsLanguage.isCode("")).toBe(false);
  });
});

describe("countLines function", () => {
  test("should handle files with only comments", () => {
    const result = countLines("only_comments.js", languages.js);
    expect(result).toEqual({
      blank: 0,
      comment: 3,
      code: 0,
      total: 3,
    });
  });

  test("should handle files with mixed content and multiple blank lines", () => {
    const result = countLines("mixed.js", languages.js);
    expect(result).toEqual({
      blank: 0,
      comment: 3,
      code: 4,
      total: 7,
    });
  });
});

describe("detectLanguage function", () => {
  test("should detect JavaScript files", () => {
    const language = detectLanguage("test.js");
    expect(language).toBe(languages.js);
  });

  test("should throw error for unsupported file types", () => {
    expect(() => detectLanguage("test.py")).toThrow(
      "Unsupported file type: .py"
    );
  });
});
