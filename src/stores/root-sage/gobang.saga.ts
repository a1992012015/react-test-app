import { call, put, select, take } from 'redux-saga/effects';
import { CallEffect, PutEffect, SelectEffect, TakeEffect } from '@redux-saga/core/effects';
import { SagaIterator } from 'redux-saga';

import { changeWorkerPost } from '../actions/worker.action';
import { IWorkerRequest } from '../../services/gobang-worker/interfaces/gobang-worker.interface';
import {
  gameChangeState,
  gameInit,
  gamePut,
  gameSagaChangeBackward,
  gameSagaChangeBoard,
  gameSagaChangeConfig,
  gameSagaChangeForward,
  gameSagaInit,
  gameSagaPut
} from '../actions/gobang.action';
import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import {
  GameType,
  IGamePut,
  IGameStart,
  IGameStatus,
  SagaAction
} from '../interfaces/gobang.interface';
import { IWRBackward, IWRForward, WorkerType } from '../interfaces/worker.interface';
import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { SCORE } from '../../services/gobang-worker/configs/score.config';
import { evaluatePoint } from '../../services/gobang-worker/services/evaluate-point.service';
import { IScorePoint } from '../../services/gobang-worker/interfaces/evaluate-point.interface';
import { commons } from '../../services/gobang-worker/services/commons.service';

/**
 * 落子的预检测
 * @constructor
 */
function* gobangGoOnWatch(): Generator<
  TakeEffect | PutEffect | SelectEffect | CallEffect,
  void,
  SagaAction<IGamePut> | IGameStatus | IPiece[]
> {
  while (true) {
    const action = yield take([gameSagaPut]);

    const { payload } = action as SagaAction<IGamePut>;

    const gobang = yield select((store) => store.gobang);

    const { board, gameType } = gobang as IGameStatus;

    const { piece } = payload;

    if (!checkPieceRepeat(board, piece)) {
      yield put(gamePut(payload));

      const winMap = yield call(gobangWinCheckWork, piece);

      if (!(winMap as IPiece[]).length && gameType === GameType.DUEL_HUM) {
        const post: IWorkerRequest = {
          type: WorkerType.GO,
          payload: { piece }
        };

        yield put(changeWorkerPost(post));
      } else if ((winMap as IPiece[]).length) {
        const statePayload = {
          gameType: GameType.DUEL_FINISH,
          winning: piece.role,
          winMap: winMap as IPiece[]
        };
        yield put(gameChangeState(statePayload));
      }
    }
  }
}

/**
 * 输赢的检测
 * @constructor
 */
function* gobangWinCheckWork(piece: IPiece): SagaIterator<IPiece[]> {
  const gobang: IGameStatus = yield select((store) => store.gobang);
  const scoreCache: number[][][][] = [
    [], // placeholder
    [
      // for role 1
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ],
    [
      // for role 2
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ]
  ];
  const scorePoint: IScorePoint = {
    x: piece.x,
    y: piece.y,
    role: piece.role,
    pieces: gobang.board,
    scoreCache
  };

  for (let i = 0; i < 4; i++) {
    const result = evaluatePoint.scorePoint({ ...scorePoint, dir: i });
    console.log('result', result);
    console.log(result >= SCORE.FIVE);
    if (result >= SCORE.FIVE) {
      return gobangGetWinMapWork(piece, gobang.board, i);
    }
  }

  return [];
}

function gobangGetWinMapWork(piece: IPiece, board: IPiece[][], dir: number): IPiece[] {
  const len = board.length;
  let winMap: IPiece[] = [];

  console.log('dir', dir);
  console.log('piece', piece);

  // 因为后面循环都是自增
  // 所有起点始终是最小的，结束是最大的
  if (dir === 0) {
    // 从上往下
    for (let y = piece.y - 4; y < len && y >= 0 && y <= y + 4; y++) {
      const p = board[y][piece.x];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else if (dir === 1) {
    // 从左到右
    for (let x = piece.x - 4; x < len && x >= 0 && x <= x + 4; x++) {
      const p = board[piece.y][x];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else if (dir === 2) {
    // 从左上到右下
    for (let yx = piece.y - 4; yx < len && yx >= 0 && yx <= piece.y + 4; yx++) {
      const p = board[yx][yx];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else {
    // 从左下到右上
    for (let i = -4; i <= 4; i++) {
      const py = piece.y - i;
      const px = piece.x + i;
      if (py >= 0 && py < len && px >= 0 && px < len) {
        const p = board[py][px];
        winMap = gobangAddWinMapWork(winMap, piece, p);
      }
    }
  }
  console.log('winMap', winMap);

  return winMap;
}

function gobangAddWinMapWork(winMap: IPiece[], piece: IPiece, p: IPiece): IPiece[] {
  if (p.role === piece.role) {
    return [...winMap, p];
  } else if (winMap.length >= 5) {
    return winMap;
  } else {
    return [];
  }
}

/**
 * 检查是否是重复落子
 * @param board
 * @param piece
 */
function checkPieceRepeat(board: IPiece[][], piece: IPiece): boolean {
  return board.some((r) => {
    return r.some((p) => p.x === piece.x && p.y === piece.y && p.role !== ERole.empty);
  });
}

/**
 * 初始化游戏所有的状态，重新开始游戏
 * @constructor
 */
function* gobangInitWatch(): Generator<TakeEffect | PutEffect> {
  while (true) {
    yield take([gameSagaInit]);

    yield put(gameInit());
  }
}

/**
 * 修改现在游戏的状态到准备状态，并且通知AI修改状态
 * @constructor
 */
function* gobangChangeBoardWatch(): Generator<
  TakeEffect | PutEffect,
  void,
  SagaAction<IWorkerRequest>
> {
  while (true) {
    const { payload } = yield take([gameSagaChangeBoard]);

    yield put(gameChangeState({ gameType: GameType.DUEL_READY }));

    yield put(changeWorkerPost(payload));
  }
}

/**
 * 修改现在游戏的状态到落子状态，根据AI返回的状态给出通知
 * @constructor
 */
function* gobangChangeGameWatch(): Generator<
  TakeEffect | PutEffect,
  void,
  SagaAction<IWRBackward | IWRForward | undefined>
> {
  while (true) {
    const { type, payload } = yield take([
      gameSagaChangeConfig,
      gameSagaChangeForward,
      gameSagaChangeBackward
    ]);

    const statePayload: IGameStart = {
      gameType: GameType.DUEL_HUM
    };

    if (type === gameSagaChangeForward.type) {
      const payloadForward = payload as IWRForward;
      console.log('payload', payload);
      if (payloadForward.forward) {
        statePayload.board = payloadForward.pieces;
      } else {
        // TODO 创建一个message通知回退失败
      }
    } else if (type === gameSagaChangeBackward.type) {
      const payloadBackward = payload as IWRBackward;
      console.log('payload', payload);
      if (payloadBackward.backward) {
        statePayload.board = payloadBackward.pieces;
      } else {
        // TODO 创建一个message通知悔棋失败
      }
    } else {
      console.log('payload', payload);
      // TODO 创建一个message通知设置config的成功还是失败
    }

    yield put(gameChangeState(statePayload));
  }
}

export const gobangSaga = [
  gobangGoOnWatch(),
  gobangInitWatch(),
  gobangChangeBoardWatch(),
  gobangChangeGameWatch()
];
