import { Position } from './position'

export const BOARD_ROWS_SIZE = 10
export const BOARD_COLS_SIZE = 40

export const WALL = '#'
export const BOX = '*'
export const TARGET = 'X'
export const PLAYER = 'O'
export const EMPTY = ' '
export const BOARD_ITEMS = [WALL, BOX, TARGET, PLAYER, EMPTY] as const

export const isBox = (board: Board, position: Position) =>
  board.matrix[position.r][position.c] === BOX

export type BoardItem = typeof BOARD_ITEMS[number]

export type Board = {
  matrix: BoardItem[][]
  cache: { [key: string]: BoardItem }
}
export const upsertCache = (board: Board, row: number, col: number) => {
  const key = `${row}-${col}`
  board.cache[key] = board.matrix[row][col]
}
export const cacheEvict = (
  board: Board,
  row: number,
  col: number,
): BoardItem => {
  const key = `${row}-${col}`
  const item = board.cache[key]
  delete board.cache[key]
  return item || EMPTY
}

export const createBoard = (
  playerStartPosition: Position,
  boxes: Position[],
  targets: Position[],
): Board => {
  const matrix = Array(BOARD_ROWS_SIZE)
    .fill(null)
    .map(() => new Array(BOARD_COLS_SIZE).fill(EMPTY))

  buildWalls(matrix)
  matrix[playerStartPosition.r][playerStartPosition.c] = PLAYER

  for (const { r, c } of boxes) matrix[r][c] = BOX
  for (const { r, c } of targets) matrix[r][c] = TARGET

  return {
    matrix,
    cache: {},
  }
}

export const printBoard = (board: Board) => {
  console.clear()
  board.matrix.forEach((row) => console.log(row.join('')))
}
const buildWalls = (matrix: string[][]) => {
  for (let col = 0; col < BOARD_COLS_SIZE; col++) {
    matrix[0][col] = WALL
  }

  for (let col = 0; col < BOARD_COLS_SIZE; col++) {
    matrix[BOARD_ROWS_SIZE - 1][col] = WALL
  }

  for (let row = 0; row < BOARD_ROWS_SIZE; row++) {
    matrix[row][0] = WALL
  }

  for (let row = 0; row < BOARD_ROWS_SIZE; row++) {
    matrix[row][BOARD_COLS_SIZE - 1] = WALL
  }
}
