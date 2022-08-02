import { createBoard, printBoard } from './board'
import { mapKeyToDirection } from './interface'
import { move } from './move'

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
  process.stdin.on('keypress', (_, key) => {
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
