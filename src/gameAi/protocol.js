const AI = require("./ai");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const ai = new AI();

let boardMode = false;

rl.on('line', function(line) {
  let args = line.split(' ');
  if (args[0] === 'BEGIN') {
    let r = ai.begin();
    console.log(r.join(','));
  } else if (args[0] === 'START') {
    let size = args[1] ? parseInt(args[1]) : 20;
    ai.start(size);
    console.log('OK');
  } else if (args[0] === 'TURN') {
    let p = args[1].split(',');
    let r = ai.turn(parseInt(p[0]), parseInt(p[1]));
    console.log(r.join(','));
  } else if (line === 'BOARD') {
    boardMode = true;
  } else if (line === 'DONE') {
    boardMode = false;
    let r = ai.begin();
    console.log(r.join(','));
  } else if (boardMode) {
    let t = line.split(',');
    ai.set(parseInt(t[0]), parseInt(t[1]), parseInt(t[2]));
  }
});
