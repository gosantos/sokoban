import {
  Board,
  isBox,
  BoardItem,
  upsertCache,
  cacheEvict,
  BOARD_ROWS_SIZE,
  BOARD_COLS_SIZE,
  BOX,
  PLAYER,
  EMPTY,
  TARGET,
} from './board'
import { addPositions, Position } from './position'

export const UP = { r: -1, c: 0 } as const
export const RIGHT = { r: 0, c: 1 } as const
export const DOWN = { r: 1, c: 0 } as const
export const LEFT = { r: 0, c: -1 } as const
export const IN_PLACE = { r: 0, c: 0 } as const
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT, IN_PLACE] as const

export type Direction = typeof DIRECTIONS[number]

export const move = (
  board: Board,
  currentPosition: Position,
  direction: Direction,
): Position => {
  if (
    isBox(board, addPositions(currentPosition, direction)) &&
    canMove(addPositions(currentPosition, direction, 2), board, direction)
  ) {
    const nextBoxPosition = addPositions(currentPosition, direction, 2)
    const nextPlayerPosition = addPositions(currentPosition, direction, 1)
    moveBoardItem(board, nextBoxPosition, nextPlayerPosition, BOX)
    moveBoardItem(board, nextPlayerPosition, currentPosition, PLAYER)

    return nextPlayerPosition
  } else if (
    !isBox(board, addPositions(currentPosition, direction, 1)) &&
    canMove(addPositions(currentPosition, direction, 1), board, direction)
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
const canMove = (to: Position, board: Board, direction: Direction): boolean => {
  const inBound =
    to.r >= 0 &&
    to.c >= 0 &&
    to.r <= BOARD_ROWS_SIZE - 1 &&
    to.c <= BOARD_COLS_SIZE - 1

  const notAWall = [EMPTY, TARGET].includes(board.matrix[to.r][to.c])

  return inBound && notAWall
}
