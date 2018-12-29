
// worker.js
self.onmessage = function(e) {
  console.log(e);
  postMessage({
    type: 'board',
    data: 'open'
  });
};
//
// let code = workerCode.toString();
// code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
//
// const blob = new Blob([code], { type: 'application/javascript' });
// const worker_script = URL.createObjectURL(blob);
//
// console.log(worker_script);
// console.log(ai);

// export default worker_script;
//
// export default () => {
//   self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
//     if (!e) return;
//     const ai = new AI();
//     console.log(ai);
//
//     let d = e.data;
//     console.log('get message: ', d);
//
//     if (d.type === 'START') {
//       // 开始
//       console.log(ai);
//       const open = ai.start(d.random);
//       postMessage({
//         type: 'board',
//         data: open
//       });
//     } else if (d.type === 'BEGIN') {
//       // 开始
//       let p = ai.begin();
//       postMessage({
//         type: 'put',
//         data: p
//       });
//     } else if (d.type === 'GO') {
//       // 走一步
//       let p = ai.turn(e.data.x, e.data.y);
//       postMessage({
//         type: 'put',
//         data: p
//       });
//     } else if (d.type === 'BACKWARD') {
//       // 悔棋
//       ai.backward();
//     } else if (d.type === 'FORWARD') {
//       // 返回悔棋
//       ai.forward();
//     } else if (d.type === 'CONFIG') {
//       // 配置
//       let d = e.data.config;
//       if (d.searchDeep) config.searchDeep = d.searchDeep;
//       if (d.countLimit) config.countLimit = d.countLimit;
//       if (d.vcxDeep) config.vcxDeep = d.vcxDeep;
//       if (d.timeLimit) config.timeLimit = d.timeLimit;
//       if (d.spread !== undefined) config.spreadLimit = d.spread;
//     }
//   });
// }
