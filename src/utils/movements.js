import { useState, useEffect } from 'react'
import { boardSettings, pieces, BLANK } from './settings'
import produce from 'immer'
import debounce from 'lodash/debounce'

const invalidMove = ({ board, moveCoordinates, allPieceCoordinates }) => {
  const [row, column] = moveCoordinates
  if (
    row < 0 ||
    row >= boardSettings.rows ||
    column < 0 ||
    column >= boardSettings.columns
  )
    return true

  if (
    board[row][column] !== BLANK &&
    !allPieceCoordinates.some(([r, c]) => row === r && column === c)
  )
    return true

  return false
}

const useKeyPress = targetKey => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)
  const match = event => targetKey === event.code

  // If pressed key is our target key then set to true
  const downHandler = debounce(event => {
    // console.log(event.code)
    if (match(event)) {
      setKeyPressed(true)
    }
  })

  // If released key is our target key then set to false
  const upHandler = debounce(event => {
    if (match(event)) {
      setKeyPressed(false)
    }
  })

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

const movePiece = ({
  board,
  setBoard,
  activePiece,
  setActivePiece,
  lastKeypress,
  setLastKeypress,
  isDropping,
  direction,
}) => {
  let currentPiece = activePiece
  let pieceCoordinates =
    currentPiece.currentPosition || currentPiece.initialPosition

  const addToColumn = direction === 'left' ? -1 : 1

  const nextPosition = Object.fromEntries(
    Object.entries(pieceCoordinates).map(([key, [row, column]]) => [
      key,
      [row, column + addToColumn],
    ]),
  )

  if (
    !isDropping &&
    !Object.values(nextPosition).some(moveCoordinates =>
      invalidMove({
        board,
        moveCoordinates,
        allPieceCoordinates: Object.values(pieceCoordinates),
      }),
    ) &&
    Date.now() - lastKeypress >= 100
  ) {
    setLastKeypress(Date.now())
    const nextBoard = produce(board, newBoard => {
      // The piece can move down so clear it's current spaces
      Object.values(pieceCoordinates).forEach(([row, column]) => {
        if (row >= 0) {
          newBoard[row][column] = BLANK
        }
      })

      Object.values(nextPosition).forEach(([row, column]) => {
        newBoard[row][column] = currentPiece
      })
    })

    const nextActive = produce(currentPiece, afterMoving => {
      afterMoving.currentPosition = nextPosition
    })

    setActivePiece(nextActive)
    setBoard(nextBoard)
  }
}

const clearLines = board => {
  const firstVisibleRow = boardSettings.rows - boardSettings.displayedRows
  let allRows = []

  for (let i = firstVisibleRow; i < boardSettings.rows; i++) {
    const row = board[i]
    if (row.every(cellValue => cellValue !== BLANK)) {
      allRows.push(i)
    }

    if (allRows.length === 4) break
  }

  if (allRows.length > 0) {
    const rowsToDelete = allRows.length
    const startingRow = allRows[0] - 1

    let currentRowIndex = startingRow
    let currentRow = board[startingRow]

    const nextBoard = produce(board, newBoard => {
      while (!currentRow.every(cellValue => cellValue === BLANK)) {
        currentRow.forEach((cellValue, columnIndex) => {
          newBoard[currentRowIndex][columnIndex] = BLANK
          newBoard[currentRowIndex + rowsToDelete][columnIndex] = cellValue
        })
        --currentRowIndex
        currentRow = board[currentRowIndex]
      }
    })

    return [nextBoard, rowsToDelete]
  }

  return [board, 0]
}

const dropPiece = ({
  board,
  setBoard,
  activePiece,
  setActivePiece,
  lastKeypress,
  setLastKeypress,
  nextPiece,
  setNextPiece,
}) => {
  let currentPiece = activePiece
  let pieceCoordinates =
    currentPiece.currentPosition || currentPiece.initialPlacement

  const getNextDropPosition = pieceCoordinates =>
    Object.fromEntries(
      Object.entries(pieceCoordinates).map(([key, [row, column]]) => [
        key,
        [row + 1, column],
      ]),
    )

  let currentPosition = pieceCoordinates
  let nextPosition = getNextDropPosition(pieceCoordinates)

  if (Date.now() - lastKeypress < 150) {
    return
  }

  setLastKeypress(Date.now())

  while (
    !Object.values(nextPosition).some(moveCoordinates =>
      invalidMove({
        board,
        moveCoordinates,
        allPieceCoordinates: Object.values(pieceCoordinates),
      }),
    )
  ) {
    currentPosition = nextPosition
    nextPosition = getNextDropPosition(nextPosition)
  }

  const newActivePiece = nextPiece

  const nextBoard = produce(board, newBoard => {
    // The piece can move down so clear it's current spaces
    Object.values(pieceCoordinates).forEach(([row, column]) => {
      if (row >= 0) {
        newBoard[row][column] = BLANK
      }
    })

    Object.values(currentPosition).forEach(([row, column]) => {
      if (row >= 0) {
        newBoard[row][column] = currentPiece
      }
    })

    Object.values(newActivePiece.initialPlacement).forEach(([row, column]) => {
      if (row >= 0) {
        newBoard[row][column] = nextPiece
      }
    })
  })

  const [newBoard, linesDeleted] = clearLines(nextBoard)

  setActivePiece(newActivePiece)
  setNextPiece(generateRandomPiece())
  setBoard(newBoard)
}

const rotatePiece = ({
  board,
  setBoard,
  activePiece,
  setActivePiece,
  lastKeypress,
  setLastKeypress,
  isDropping,
}) => {
  let currentPiece = activePiece
  let pieceCoordinates =
    currentPiece.currentPosition || currentPiece.initialPosition

  let [nextPosition, nextOrientation] = currentPiece.rotation(
    pieceCoordinates,
    currentPiece.orientation,
  )

  if (
    !isDropping &&
    !Object.values(nextPosition).some(moveCoordinates =>
      invalidMove({
        board,
        moveCoordinates,
        allPieceCoordinates: Object.values(pieceCoordinates),
      }),
    ) &&
    Date.now() - lastKeypress >= 100
  ) {
    setLastKeypress(Date.now())
    const nextBoard = produce(board, newBoard => {
      // The piece can move down so clear it's current spaces
      Object.values(pieceCoordinates).forEach(([row, column]) => {
        if (row >= 0) {
          newBoard[row][column] = BLANK
        }
      })

      Object.values(nextPosition).forEach(([row, column]) => {
        newBoard[row][column] = currentPiece
      })
    })

    const nextActive = produce(currentPiece, afterMoving => {
      afterMoving.currentPosition = nextPosition
      afterMoving.orientation = nextOrientation
    })

    setActivePiece(nextActive)
    setBoard(nextBoard)
  }
}

const generateRandomPiece = () => {
  const pieceType = Math.floor(Math.random() * Math.floor(7))
  return pieces[Object.keys(pieces)[pieceType]]
}

export {
  clearLines,
  useKeyPress,
  invalidMove,
  dropPiece,
  boardSettings,
  generateRandomPiece,
  movePiece,
  rotatePiece,
}
