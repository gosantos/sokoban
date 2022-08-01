import { Board, createBoard } from '../src/board'

let board: Board
beforeEach(() => {
  board = createBoard()
})

test('draw the board', () => {
  expect(board).toBeTruthy()
})
