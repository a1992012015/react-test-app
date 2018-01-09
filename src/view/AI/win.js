import R from "role";

/*var R = require("./role.js");*/

let isFive = function(board, p, role) {
    let len = board.length;
    let count = 1;

    let reset = function() {
        count = 1;
    }

    for(let i = p[1] + 1; true; i++) {
        if(i >= len) break;
        let t = board[p[0]][i];
        if(t !== role) break;
        count++;
    }

    for(let i = p[1] - 1; true; i--) {
        if(i < 0) break;
        let t = board[p[0]][i];
        if(t !== role) break;
        count++;
    }

    if(count >= 5) return true;

    //纵向
    reset();

    for(let i = p[0] + 1; true; i++) {
        if(i >= len) {
            break;
        }
        let t = board[i][p[1]];
        if(t !== role) break;
        count++;
    }

    for(let i = p[0] - 1; true; i--) {
        if(i < 0) {
            break;
        }
        let t = board[i][p[1]];
        if(t !== role) break;
        count++;
    }

    if(count >= 5) return true;
    // \\
    reset();

    for(let i = 1; true; i++) {
        let x = p[0] + i,
            y = p[1] + i;
        if(x >= len || y >= len) {
            break;
        }
        let t = board[x][y];
        if(t !== role) break;

        count++;
    }

    for(let i = 1; true; i++) {
        let x = p[0] - i,
            y = p[1] - i;
        if(x < 0 || y < 0) {
            break;
        }
        let t = board[x][y];
        if(t !== role) break;
        count++;
    }

    if(count >= 5) return true;

    // \/
    reset();

    for(let i = 1; true; i++) {
        let x = p[0] + i,
            y = p[1] - i;
        if(x < 0 || y < 0 || x >= len || y >= len) {
            break;
        }
        let t = board[x][y];
        if(t !== role) break;
        count++;
    }

    for(let i = 1; true; i++) {
        let x = p[0] - i,
            y = p[1] + i;
        if(x < 0 || y < 0 || x >= len || y >= len) {
            break;
        }
        let t = board[x][y];
        if(t !== role) break;
        count++;
    }

    if(count >= 5) return true;

    return false;

};

let w = function(board) {
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            let t = board[i][j];
            if(t !== R.empty) {
                let r = isFive(board, [i, j], t);
                if(r) return t;
            }
        }
    }
    return false;
};

//module.exports = w;
export default w;