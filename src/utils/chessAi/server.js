import AI from './ai';

let ai = new AI();

function AIS(e) {
  let d = e;
  if (d.type === 'START') {
    ai.start(15);
  } else if (d.type === 'GO') {
    let p = ai.set(e.x, e.y);
    return p;
  } else if (d.type === 'BACK') {
    ai.back();
  }
}

export default AIS;
