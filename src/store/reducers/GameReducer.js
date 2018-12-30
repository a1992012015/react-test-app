import { GAME_CHANGES, GAME_INIT } from '../actionType/GameActionType';

const chessMap = [];
for (let i = 0; i < 15; i++) {
  const chessRow = [];
  for (let g = 0; g < 15; g++) {
    chessRow.push({
      stepNumber: null,
      xIsNext: null
    });
  }
  chessMap.push(chessRow);
}

const chessInit = {
  chessMap: [chessMap],
  stepNumber: 0, //步数
  xIsNext: 'ai', //me | ai
  earlyOrLate: false, //先攻||后攻
  flag: true, //true为完成对局||还未开始 false为游戏进行中
  king: '' //最后的赢家是
};

export default function GameReducer(state = chessInit, action) {
  switch (action.type) {
    case GAME_CHANGES:
      return { ...state, ...action.payload };
    case GAME_INIT:
      return { ...chessInit, flag: false };
    default:
      return state;
  }
}
