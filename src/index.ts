const mapKeyToDirection = (key: string): Direction => {
  switch (key) {
    case '\x1B[A':
      return UP
    case '\x1B[C':
      return RIGHT
    case '\x1B[B':
      return DOWN
    case '\x1B[D':
      return LEFT
    default:
      return IN_PLACE
  }
}

export type Position = {
  r: number
  c: number
}

export const UP = { r: -1, c: 0 } as const
export const RIGHT = { r: 0, c: 1 } as const
export const DOWN = { r: 1, c: 0 } as const
export const LEFT = { r: 0, c: -1 } as const
export const IN_PLACE = { r: 0, c: 0 } as const

const direction = [UP, RIGHT, DOWN, LEFT, IN_PLACE] as const

export type Direction = typeof direction[number]

export const move = (
  board: Board,
  currentPosition: Position,
  direction: Direction,
) => {
  const nextPosition = addPositions(currentPosition, direction)

  if (!canMove(nextPosition, board)) return currentPosition

  movePlayer(board, nextPosition, currentPosition)

  return nextPosition
}

const movePlayer = (
  board: Board,
  nextPosition: Position,
  currentPosition: Position,
) => {
  board.cache.push(board.matrix[nextPosition.r][nextPosition.c])
  const lastBoardItem = board.cache.shift()
  board.matrix[currentPosition.r][currentPosition.c] = lastBoardItem!
  board.matrix[nextPosition.r][nextPosition.c] = PLAYER
}

export const addPositions = (c1: Position, c2: Position): Position => {
  return {
    r: c1.r + c2.r,
    c: c1.c + c2.c,
  }
}

const canMove = (to: Position, board: Board): boolean => {
  const inBound =
    to.r >= 0 &&
    to.c >= 0 &&
    to.r <= BOARD_ROWS_SIZE - 1 &&
    to.c <= BOARD_COLS_SIZE - 1

  const notAWall = [EMPTY, TARGET].includes(board.matrix[to.r][to.c])

  return inBound && notAWall
}

export const BOARD_ROWS_SIZE = 10
export const BOARD_COLS_SIZE = 40

export const WALL = '#'
export const BOX = '*'
export const TARGET = 'X'
export const PLAYER = 'O'
export const EMPTY = ' '

const boardItems = [WALL, BOX, TARGET, PLAYER, EMPTY] as const

export type BoardItem = typeof boardItems[number]

export type Board = {
  matrix: BoardItem[][]
  cache: BoardItem[]
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
    cache: [EMPTY],
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

// SNEARIO DEFINITIONS

let playerPosition = {
  r: 5,
  c: 5,
}

let boxes = [
  {
    r: 3,
    c: 3,
  },
  {
    r: 7,
    c: 9,
  },
]
let targets = [
  {
    r: 1,
    c: 1,
  },
  {
    r: 8,
    c: 19,
  },
]

// PROGRAM
const board = createBoard(playerPosition, boxes, targets)
printBoard(board)

const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit()
  } else {
    const direction = mapKeyToDirection(key.sequence)

    printBoard(board)
    playerPosition = move(board, playerPosition, direction)
    printBoard(board)
  }
})
