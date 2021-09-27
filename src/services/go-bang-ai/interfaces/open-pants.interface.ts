export interface OpenPantsInterface {
  name: string;
  checkerboard: Piece[][];
}

export interface Piece {
  x: number;
  y: number;
  role: Role;
  v?: Score;
  steps?: Piece[];
  vct?: number;
  vcf?: number;
  min?: number;
  step?: number;
  score?: number;
  scoreHum?: number;
  scoreCom?: number;
}

export enum Role {
  empty = 0, // 空位
  com = 1, // 电脑
  hum = 2 // 我
}

export interface CacheBoard {
  deep: number;
  score: Score;
  board: string;
}

export interface Score {
  score: number;
  step: number;
  abcut?: number;
  vct?: number;
  vcf?: number;
  steps: Piece[];
  c?: CacheBoard;
}

export interface test {
  test(): number;
}
