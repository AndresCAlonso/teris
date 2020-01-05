import React from 'react'
import { GameBoard } from './GameBoard'
import GameInfoPanel from './GameInfoPanel'
import { StoreProvider } from '../context/store'

const layoutStyles = {
  width: '500px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '4fr 2fr',
  gridTemplateRows: 'auto',
  justifyContent: 'space-around'
}

const GameLayout = () => {
  return (
    <StoreProvider>
      <div className="gameLayout" style={layoutStyles}>
        <GameBoard />
        <GameInfoPanel />
      </div>
    </StoreProvider>
  )
}

export default GameLayout
