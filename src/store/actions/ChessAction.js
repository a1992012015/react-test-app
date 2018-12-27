import { put, call, take, select } from 'redux-saga/effects';

import { CHANGE_CHESS } from '../actionType/ChessActionType';

import AI from '../../utils/chessAi/server';

function getChess(state) {
  return {
    chess: state.chess
  };
}

function* referee(numStr, numEnd, flag = 1, direction = 0) {
  if (flag > 4) return false;
  let count = 0; //count&&计算有几个连着的

  const { chess } = yield select(getChess);
  const chessMap = chess.chessMap[chess.chessMap.length - 1];
  for (let i = 0; i < 5; i++) {
    let [y, x] = checkDirection(numStr, numEnd, i, flag, direction);
    if (x >= 0 && x <= 14 && y >= 0 && y <= 14) {
      if (chessMap[y][x].xIsNext === !chess.xIsNext) {
        count += 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  direction = 1;
  for (let i = 1; i < 5; i++) {
    let [y, x] = checkDirection(numStr, numEnd, i, flag, direction);//获取周围的坐标
    if (x >= 0 && x <= 14 && y >= 0 && y <= 14) {//判断坐标是否合法
      if (chessMap[y][x].xIsNext === !chess.xIsNext) {//判断当前坐标是否是自己的落子
        count += 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  console.log('========计数========');
  let position = null;
  if (flag === 1) {
    position = '垂直';
  } else if (flag === 2) {
    position = '水平';
  } else if (flag === 3) {
    position = '右斜45度';
  } else if (flag === 4) {
    position = '左斜135度';
  }
  console.log('========' + position + '========');
  console.log(count);
  if (count >= 5) {
    return true;
  } else {
    return yield call(referee, numStr, numEnd, flag + 1);
  }
}

function checkDirection(numStr, numEnd, num, accelerator, direction) {
  let str = [];
  switch (accelerator) {
    case 1: //垂直=90度
      if (direction) {
        str = [numStr - num, numEnd];
      } else {
        str = [numStr + num, numEnd];
      }
      break;
    case 2: //水平=0度
      if (direction) {
        str = [numStr, numEnd - num];
      } else {
        str = [numStr, numEnd + num];
      }
      break;
    case 3: //3=45度
      if (direction) {
        str = [numStr - num, numEnd + num];
      } else {
        str = [numStr + num, numEnd - num];
      }
      break;
    case 4: //4=135度
      if (direction) {
        str = [numStr - num, numEnd - num];
      } else {
        str = [numStr + num, numEnd + num];
      }
      break;
  }
  return str;
}

function* nextStep(payload) {
  const { chess } = yield select(getChess);
  console.log(payload);
  const [index, item] = payload;
  console.log('=========获取输赢=========');

  const now = JSON.parse(JSON.stringify(chess.chessMap[chess.chessMap.length - 1]));
  const chessMap = JSON.parse(JSON.stringify(chess.chessMap));

  now[index][item].stepNumber = chess.stepNumber + 1;
  now[index][item].xIsNext = chess.xIsNext;
  chessMap.push(now);

  yield put({
    type: CHANGE_CHESS,
    payload: {
      chessMap: chessMap,
      stepNumber: chess.stepNumber + 1,
      xIsNext: !chess.xIsNext,
      flag: false
    }
  });

  const flag = yield call(referee, index, item);
  if (flag) {
    yield put({
      type: CHANGE_CHESS,
      payload: {
        flag: flag,
        king: flag ? chess.xIsNext : null
      }
    });
  }
}

function* moveLater() {
  while (true) {
    const { payload } = yield take('MOVE_LATER');
    yield call(nextStep, payload);

    const { chess } = yield select(getChess);
    if (chess.xIsNext) {
      const next = AI({
        type: 'GO',
        x: payload[0],
        y: payload[1]
      });
      yield call(nextStep, [next[0], next[1]]);
    }
  }
}

function* gameStart() {
  while (true) {
    yield take('GAME_START');

    AI({ type: 'START' });

    yield put({
      type: 'CHANGE_INIT'
    });

    yield put({
      type: 'MOVE_LATER',
      payload: [7, 7]
    });
  }
}

export default [
  moveLater(),
  gameStart()
];
