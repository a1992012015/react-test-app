import AI from "./ai";

let ai = new AI();

/*onmessage = function(e) {
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
self.onmessage = function (e) {
    let d = e.data;
    console.log(d);
    postMessage(d);
};*/

function AIS(e) {
    let d = e;
    console.log(d);
    if(d.type == "START") {
        ai.start(15);
    } else if(d.type == "GO") {
        let p = ai.set(e.x, e.y);
        console.log(p);
        return p;
    } else if(d.type == "BACK") {
        ai.back();
    }
}

export default AIS;