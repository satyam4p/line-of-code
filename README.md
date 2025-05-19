# Line Of Code Module

This module allows you to count the number of blank lines, comment lines, and code lines in a given file.

## Getting Started

Install dependencies:

```bash
npm i
```
## Usage
```
node line_counter.js <file_name>
```

This will log the results to the console/terminal, including:

Number of blank lines

Number of comment lines

Number of code lines

Total number of lines

###supported language: JS


## usage as a Module:

```code
const { countLines, detectLanguage, languages } = require('./line_counter');

const filename = 'example.js';
const language = detectLanguage(filename);
const result = countLines(filename, language);

console.log('Blank lines:', result.blank);
console.log('Comment lines:', result.comment);
console.log('Code lines:', result.code);
console.log('Total lines:', result.total);

```
