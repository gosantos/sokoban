const BOARD_ROWS_SIZE = 10
const BOARD_COLS_SIZE = 40

export type Board = string[][]

export const createBoard = (): Board => {
  const board = Array(BOARD_ROWS_SIZE)
    .fill(null)
    .map(() => new Array(BOARD_COLS_SIZE).fill(' '))

  buildWalls(board)
  return board
}

export const printBoard = (board: string[][]) => {
  board.forEach((row) => console.log(row.join('')))
}

const buildWalls = (board: string[][]) => {
  for (let col = 0; col < BOARD_COLS_SIZE; col++) {
    board[0][col] = '#'
  }

  for (let col = 0; col < BOARD_COLS_SIZE; col++) {
    board[BOARD_ROWS_SIZE - 1][col] = '#'
  }

  for (let row = 0; row < BOARD_ROWS_SIZE; row++) {
    board[row][0] = '#'
  }

  for (let row = 0; row < BOARD_ROWS_SIZE; row++) {
    board[row][BOARD_COLS_SIZE - 1] = '#'
  }
}
