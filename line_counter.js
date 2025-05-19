// Usage: node line_counter.js <filename>
const fs = require("fs");
const path = require("path");

class Language {
  constructor(name, singleLineComment) {
    this.name = name;
    this.singleLineComment = singleLineComment;
  }

  isBlank(line) {
    return line.trim() === "";
  }

  isComment(line) {
    const trimmed = line.trim();
    return (
      trimmed.startsWith(this.singleLineComment) &&
      !this.hasCodeBeforeComment(trimmed)
    );
  }

  hasCodeBeforeComment(line) {
    const index = line.indexOf(this.singleLineComment);
    return index > 0 && line.slice(0, index).trim() !== "";
  }

  isCode(line) {
    return !this.isBlank(line) && !this.isComment(line);
  }
}

// Add more languages by extending Language
const languages = {
  js: new Language("JavaScript", "//"),
};

function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".js") return languages.js;
  throw new Error("Unsupported file type: " + ext);
}

function countLines(filename, language) {
  const lines = fs.readFileSync(filename, "utf-8").split(/\r?\n/);
  let blank = 0,
    comment = 0,
    code = 0;
  for (const line of lines) {
    if (language.isBlank(line)) blank++;
    else if (language.isComment(line)) comment++;
    else code++;
  }
  return { blank, comment, code, total: lines.length };
}

if (require.main === module) {
  const filename = process.argv[2];
  if (!filename) {
    console.error("Usage: node line_counter.js <filename>");
    process.exit(1);
  }
  let language;
  try {
    language = detectLanguage(filename);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  const result = countLines(filename, language);
  console.log("Blank lines:", result.blank);
  console.log("Comment lines:", result.comment);
  console.log("Code lines:", result.code);
  console.log("Total lines:", result.total);
}

module.exports = { Language, countLines, detectLanguage, languages };
