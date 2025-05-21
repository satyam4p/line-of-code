// Usage: node line_counter.js <filename>
const fs = require("fs");
const path = require("path");

class Language {
  constructor(
    name,
    singleLineComment,
    multiLineCommetStart,
    multiLineCommentEnd
  ) {
    this.name = name;
    this.singleLineComment = singleLineComment;
    this.multiLineCommentStart = multiLineCommetStart;
    this.multiLineCommentEnd = multiLineCommentEnd;
    this.inMultiLineComment = false;
    this.inMultilineString = false;
    this.multilineStringStart = false;
    this.multilineStringEnd = false;
  }

  isBlank(line) {
    return line.trim() === "";
  }

  isMultiLineString(line) {
    if (line.trim().includes("`")) {
      if (this.multilineStringStart) {
        this.multilineStringEnd = true;
        this.inMultilineString = false;
        return false;
      } else {
        this.multilineStringStart = true;
        this.inMultilineString = true;
        return true;
      }
    }
    return false;
  }

  isComment(line) {
    const trimmed = line.trim();
    this.isMultiLineString(trimmed);
    trimmed;
    return (
      !this.inMultilineString &&
      trimmed.startsWith(this.singleLineComment) &&
      !this.hasCodeBeforeComment(trimmed)
    );
  }

  hasCodeBeforeComment(line) {
    const index = line.indexOf(this.singleLineComment);
    return index > 0 && line.slice(0, index).trim() !== "";
  }

  isCode(line) {
    this.isMultiLineString(line.trim());
    return (
      (!this.isBlank(line) && !this.isComment(line)) || this.inMultilineString
    );
  }

  inMultiLineCommentStart(line) {
    return line.includes(this.multiLineCommentStart);
  }

  inMultiLineCOmmentEnd(line) {
    return line.includes(this.multiLineCommentEnd);
  }

  insideMultiLineComment(line) {
    const trimmed = line.trim();

    if (
      trimmed.includes(this.inMultiLineCommentStart) &&
      trimmed.includes(this.inMultiLineCOmmentEnd) &&
      trimmed.indexOf(this.multiLineCommentStart) <
        trimmed.indexOf(this.multiLineCommentEnd)
    ) {
      return true;
    }

    if (this.inMultiLineComment) {
      if (this.inMultiLineCOmmentEnd(trimmed)) {
        this.inMultiLineComment = false;
      }
      return true;
    }

    if (this.inMultiLineCommentStart(trimmed)) {
      this.inMultiLineComment = !this.inMultiLineCOmmentEnd(trimmed);
      return true;
    }
    return false;
  }
}

// Add more languages by extending Language
const languages = {
  js: new Language("JavaScript", "//", "/*", "*/"),
  python: new Language("Python", "#"),
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
    code = 0,
    multiline = 0;
  for (const line of lines) {
    if (language.isBlank(line)) {
      blank++;
    } else if (language.insideMultiLineComment(line)) {
      multiline++;
    } else if (language.isComment(line)) {
      comment++;
    } else {
      code++;
    }
  }
  return { blank, comment, code, total: lines.length, multiline };
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
  console.log("multiline lines:", result.multiline);
}

module.exports = { Language, countLines, detectLanguage, languages };
