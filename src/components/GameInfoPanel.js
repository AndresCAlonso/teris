import React, { useContext } from 'react'
import { StoreContext } from '../context/store'
import { pieces, BLANK } from '../utils/settings'
import { Cell } from './GameBoard'
import { produce } from 'immer'

const previewSettings = {
  columns: 7,
  rows: 6,
  cellWidth: 15,
  cellHeight: 15
}

const cellStyles = cellValue => ({
  backgroundColor: cellValue.color
})

const previewGridStyles = {
  margin: '1em',
  display: 'grid',
  gridTemplateColumns: `repeat(${previewSettings.columns}, 1fr)`,
  gridTemplateRows: `repeat(${previewSettings.rows}, 1fr)`,
  width: `${previewSettings.columns * previewSettings.cellWidth}px`,
  height: `${previewSettings.rows * previewSettings.cellHeight}px`,
  border: '1px solid gray'
}

const emptyGrid = new Array(previewSettings.rows).fill(
  new Array(previewSettings.columns).fill(BLANK)
)

const PreviewGrid = ({ piece }) => {
  const coords = previewInfo[piece.type]
  const previewGrid = produce(emptyGrid, previewGrid => {
    coords.forEach(([row, column]) => {
      previewGrid[row][column] = piece
    })
  })

  const stylesToUse = cellValue => {
    let interimStyles = cellStyles(cellValue)

    if (cellValue !== BLANK) {
      interimStyles = { ...interimStyles, border: '1px solid gray' }
    }

    return interimStyles
  }

  return (
    <div style={previewGridStyles}>
      {previewGrid.map((row, rowIndex) => {
        return row.map((cellVal, cellIndex) => {
          return (
            <Cell
              key={`preview_${rowIndex}_${cellIndex}`}
              cellStyles={stylesToUse(cellVal)}
              cellValue={cellVal}
              row={rowIndex}
              column={cellIndex}
            />
          )
        })
      })}
    </div>
  )
}
const GameInfoPanel = () => {
  const { state, dispatch } = useContext(StoreContext)
  const { score, nextPiece, isPaused } = state
  const togglePause = () => dispatch({ type: 'TOGGLE_PAUSE' })

  return (
    <div>
      <PreviewGrid piece={nextPiece} />
      <div>{score}</div>
      <div style={{ margin: '1em' }}>
        <button
          onClick={() => togglePause()}
          style={{
            backgroundColor: '#4CAF50' /* Green */,
            border: 'none',
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px'
          }}
        >
          {isPaused ? 'START' : 'PAUSE'}
        </button>
      </div>
    </div>
  )
}

const previewInfo = {
  T: [
    [2, 3],
    [3, 2],
    [3, 3],
    [3, 4]
  ],
  Z: [
    [2, 3],
    [2, 4],
    [3, 2],
    [3, 3]
  ],
  LEFT_L: [
    [2, 2],
    [3, 2],
    [3, 3],
    [3, 4]
  ],
  RIGHT_L: [
    [2, 4],
    [3, 2],
    [3, 3],
    [3, 4]
  ],
  LINE: [
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5]
  ],
  REV_Z: [
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3]
  ],
  SQUARE: [
    [2, 3],
    [2, 2],
    [3, 3],
    [3, 2]
  ]
}

export default GameInfoPanel
