const fs = require('fs');

const logPath = 'C:\\Users\\anime\\.gemini\\antigravity\\brain\\a9c391dc-4494-4fdc-bf95-0b8f464a6472\\.system_generated\\logs\\overview.txt';
const log = fs.readFileSync(logPath, 'utf8');

// The original index.css should be the first write_to_file call for index.css
const parts = log.split('"TargetFile":"c:\\\\Users\\\\anime\\\\OneDrive\\\\Desktop\\\\tradence assignment\\\\src\\\\index.css"');
if (parts.length > 1) {
  // Look backwards for CodeContent
  const block = parts[1];
  const match = block.match(/"CodeContent":"(.*?)","Description"/);
  if (match) {
    let css = match[1];
    // Unescape the JSON string
    css = css.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    
    fs.writeFileSync('c:\\Users\\anime\\OneDrive\\Desktop\\tradence assignment\\src\\index.css', css);
    console.log('Successfully restored original index.css!');
  } else {
    // Try looking before TargetFile
    const prevBlock = parts[0];
    const match2 = prevBlock.match(/"CodeContent":"(.*?)",/g);
    if (match2) {
      const lastMatch = match2[match2.length - 1];
      const extracted = lastMatch.replace('"CodeContent":"', '').slice(0, -2);
      let css = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      fs.writeFileSync('c:\\Users\\anime\\OneDrive\\Desktop\\tradence assignment\\src\\index.css', css);
      console.log('Successfully restored original index.css (alt)!');
    } else {
      console.log('Could not parse CodeContent.');
    }
  }
} else {
  console.log('Could not find TargetFile for index.css');
}
