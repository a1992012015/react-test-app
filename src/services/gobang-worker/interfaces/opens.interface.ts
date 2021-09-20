import { IPiece } from './piece.interface';

export interface IOpen {
  name: string;
  pieces: IPiece[][];
}

export interface IStartOpen extends IOpen {
  piece?: IPiece;
}
