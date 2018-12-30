import { put, call, take, select } from 'redux-saga/effects';

import { GAME_INIT, GAME_CHANGES, GAME_END } from '../actionType/GameActionType';

function getChess({ game }) {
  return { game };
}

// 检查是否胜利
function* referee(numStr, numEnd, flag = 1, direction = 0) {
  if (flag > 4) return false;
  let count = 0; //count&&计算有几个连着的
  const winMap = [];

  const { game } = yield select(getChess);
  const chessMap = game.chessMap[game.chessMap.length - 1];
  for (let i = 0; i < 5; i++) {
    let [y, x] = checkDirection(numStr, numEnd, i, flag, direction);
    if (x >= 0 && x <= 14 && y >= 0 && y <= 14) {
      if (chessMap[y][x].xIsNext && chessMap[y][x].xIsNext === game.xIsNext) {
        winMap.push({ x, y });
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
      if (chessMap[y][x].xIsNext && chessMap[y][x].xIsNext === game.xIsNext) {//判断当前坐标是否是自己的落子
        winMap.push({ x, y });
        count += 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  // console.log('========计数========');
  // let position = null;
  // if (flag === 1) {
  //   position = '垂直';
  // } else if (flag === 2) {
  //   position = '水平';
  // } else if (flag === 3) {
  //   position = '右斜45度';
  // } else if (flag === 4) {
  //   position = '左斜135度';
  // }
  // console.log('========' + position + '========');
  // console.log(count);
  if (count >= 5) {
    return winMap;
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
    default:
      return str;
  }
  return str;
}

// 走下一步
function* nextStep(payload) {
  const { game } = yield select(getChess);
  const [index, item] = payload;
  // console.log('=========获取输赢=========');

  const now = JSON.parse(JSON.stringify(game.chessMap[game.chessMap.length - 1]));
  const chessMap = JSON.parse(JSON.stringify(game.chessMap));

  now[index][item].stepNumber = game.stepNumber + 1;
  now[index][item].xIsNext = game.xIsNext === 'me' ? 'ai' : 'me';
  chessMap.push(now);

  yield put({
    type: GAME_CHANGES,
    payload: {
      chessMap: chessMap,
      worldMap: chessMap,
      stepNumber: game.stepNumber + 1,
      xIsNext: game.xIsNext === 'me' ? 'ai' : 'me',
      flag: false
    }
  });

  const winMap = yield call(referee, index, item);
  if (winMap) {
    yield put({
      type: GAME_CHANGES,
      payload: {
        flag: true,
        king: game.xIsNext === 'me' ? 'ai' : 'me',
        winMap: winMap
      }
    });

    yield put({
      type: 'START_NOTIFICATION',
      payload: {
        message: `${game.xIsNext === 'me' ? '您输了！圆环之理' : '您居然'}赢得了胜利！！！`,
        time: 2000
      }
    });
  }
}

// 监听下一步的action
function* moveLater() {
  while (true) {
    const { payload } = yield take('GAME_NEXT');
    yield call(nextStep, payload);
  }
}

// 开启游戏
function* gameStart() {
  while (true) {
    yield take('GAME_START');

    yield put({ type: GAME_INIT });
  }
}

// 关闭游戏
function* gameEnd() {
  while (true) {
    yield take('GAME_FINISH');

    yield put({ type: GAME_END });
  }
}

// 后退一步
function* retreat() {
  while (true) {
    yield take('GAME_RETREAT');
    const { game } = yield select(getChess);
    yield put({
      type: GAME_CHANGES,
      payload: {
        chessMap: game.chessMap.slice(0, game.chessMap.length - 2),
        stepNumber: game.stepNumber - 2
      }
    });
    console.log('后退一步');

  }
}

// 前进一步
function* advance() {
  while (true) {
    yield take('GAME_ADVANCE');
    const { game } = yield select(getChess);
    yield put({
      type: GAME_CHANGES,
      payload: {
        chessMap: game.worldMap.slice(0, game.stepNumber + 3),
        stepNumber: game.stepNumber + 2
      }
    });
    console.log('前进一步');
  }
}

export default [
  moveLater(),
  gameStart(),
  gameEnd(),
  retreat(),
  advance()
];
