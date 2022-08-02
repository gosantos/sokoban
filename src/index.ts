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
): Position => {
  if (
    isBox(board, addPositions(currentPosition, direction)) &&
    canMove(addPositions(currentPosition, direction, 2), board)
  ) {
    const nextBoxPosition = addPositions(currentPosition, direction, 2)
    const nextPlayerPosition = addPositions(currentPosition, direction, 1)
    moveBoardItem(board, nextBoxPosition, nextPlayerPosition, BOX)
    moveBoardItem(board, nextPlayerPosition, currentPosition, PLAYER)

    return nextPlayerPosition
  } else if (
    !isBox(board, addPositions(currentPosition, direction, 1)) &&
    canMove(addPositions(currentPosition, direction, 1), board)
  ) {
    moveBoardItem(
      board,
      addPositions(currentPosition, direction, 1),
      addPositions(currentPosition, direction, 0),
      PLAYER,
    )
    return addPositions(currentPosition, direction, 1)
  } else {
    return currentPosition
  }
}

const moveBoardItem = (
  board: Board,
  nextPosition: Position,
  previousPosition: Position,
  boardItem: BoardItem,
) => {
  upsertCache(board, nextPosition.r, nextPosition.c)
  const previousBoardItem = cacheEvict(
    board,
    previousPosition.r,
    previousPosition.c,
  )
  board.matrix[previousPosition.r][previousPosition.c] = previousBoardItem!
  board.matrix[nextPosition.r][nextPosition.c] = boardItem
}

export const addPositions = (c1: Position, c2: Position, n = 1): Position => {
  return {
    r: c1.r + c2.r * n,
    c: c1.c + c2.c * n,
  }
}

const canMove = (to: Position, board: Board): boolean => {
  const inBound =
    to.r >= 0 &&
    to.c >= 0 &&
    to.r <= BOARD_ROWS_SIZE - 1 &&
    to.c <= BOARD_COLS_SIZE - 1

  const notAWall = [EMPTY, TARGET, BOX].includes(board.matrix[to.r][to.c])

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

const isBox = (board: Board, position: Position) =>
  board.matrix[position.r][position.c] === BOX

export type BoardItem = typeof boardItems[number]

export type Board = {
  matrix: BoardItem[][]
  cache: { [key: string]: BoardItem }
}

const upsertCache = (board: Board, row: number, col: number) => {
  const key = `${row}-${col}`
  board.cache[key] = board.matrix[row][col]
}

const cacheEvict = (board: Board, row: number, col: number): BoardItem => {
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

if (!process.env.TEST) {
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
}
