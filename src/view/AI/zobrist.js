import R from "./role";

let Zobrist = function(size) {
    this.size = size || 15;
};

Zobrist.prototype.init = function() {
    this.com = [];
    this.hum = [];
    for(let i = 0; i < this.size * this.size; i++) {
        this.com.push(this._rand());
        this.hum.push(this._rand());
    }

    this.code = this._rand();
};

Zobrist.prototype._rand = function() {
    return Math.floor(Math.random() * 1000000000); //再多一位就溢出了。。
};

Zobrist.prototype.go = function(x, y, role) {
    let index = this.size * x + y;
    this.code ^= (role == R.com ? this.com[index] : this.hum[index]);
    return this.code;
};

let z = new Zobrist();
z.init();

export default z;