/*
import AI from "ai";

/!*var AI = require("./ai.js");*!/
let ai = new AI();

onmessage = function(e) {
    let d = e.data;
    console.log(d);
    if(d.type == "START") {
        ai.start(15);
    } else if(d.type == "GO") {
        let p = ai.set(e.data.x, e.data.y);
        console.log(p);
        postMessage(p);
    } else if(d.type == "BACK") {
        ai.back();
    }
};
*/
onmessage =function(e){
    let d = e.data;
    console.log(d);
    postMessage(d);
};
/*
let a =3;
export default a;*/
