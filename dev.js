const { spawn } = require("child_process");

const BackendChild = spawn("yarn.cmd", ["dev"],{
  cwd: "backend"
});
function formatOutput(output,color) {
  const regex = new RegExp(`(\n)(?!.*\n)`);
  output = output.replace(regex, "");
  // if(output.startsWith("\n")) output = output.replace("\n","")
  output = output.replace(/(?<=\|)\s.*?➜|\s.*?➜/g,"\n ➜").replaceAll("\n","\n           "+color+"⊢| \x1b[0m")
  // console.log(output.match(/(?<=\|)\s.*?➜|\s.*?➜/g));
  return output
}
BackendChild.stdout.on("data", (data) => {
  const output = data.toString();

  if (
    !output.includes(
      "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten"
    )
  ) {
    console.log('\x1b[31m%s\x1b[0m %s',"[backend]  +| ", formatOutput(output, "\x1b[31m")); // Output in green color
  }
});

BackendChild.stderr.on("data", (data) => {
  const output = data.toString();

  if (
    !output.includes(
      "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten"
    )
  ) {
    console.log('\x1b[31m%s\x1b[0m %s', "[backend]  +| ", formatOutput(output, "\x1b[31m")); // log output in red color
  } 
});
const FrontendChild = spawn("yarn.cmd", ["dev"],{
  cwd: "frontend"
});
FrontendChild.stdout.on("data", (data) => {
  const output = data.toString();

  if (
    !output.includes(
      "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten"
    )
  ) {
    // console.log(replaceLastMatch(output)); // Output in green color
    console.log('\x1b[32m%s\x1b[0m %s', "[frontend] +| ", formatOutput(output, "\x1b[32m")); // Output in green color
  }
});

FrontendChild.stderr.on("data", (data) => {
  const output = data.toString();

  if (
    !output.includes(
      "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten"
    )
  ) {
    // console.log(replaceLastMatch(output)); // log output in red color
    console.log('\x1b[32m%s\x1b[0m %s', "[frontend] +| ", formatOutput(output, "\x1b[32m")); // log output in red color
  } 
});

FrontendChild.on("close", (code) => {
  // console.log(`Child process exited with code ${code}`);
});
