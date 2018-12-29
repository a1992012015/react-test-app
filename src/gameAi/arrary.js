export default {
  create: function(w, h) {
    let r = [];
    for (let i = 0; i < w; i++) {
      let row = [];
      for (let j = 0; j < h; j++) {
        row.push(0);
      }
      r.push(row);
    }
    return r;
  }
};
