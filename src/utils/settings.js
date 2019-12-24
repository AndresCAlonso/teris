const boardSettings = {
  cellWidth: 30,
  cellHeight: 30,
  columns: 10,
  rows: 24,
  displayedRows: 20,
}

const pieces = {
  SQUARE: {
    color: '#F0F000',
    type: 'SQUARE',
    initialPlacement: {
      a: [-1, 4],
      b: [-1, 5],
      c: [0, 4],
      d: [0, 5],
    },
    orientation: 'UP',
    rotation: (coordinates, orientation) => [coordinates, orientation],
  },
  RIGHT_L: {
    color: '#EF9F00',
    type: 'RIGHT_L',
    initialPlacement: {
      a: [-1, 6],
      b: [0, 4],
      c: [0, 5],
      d: [0, 6],
    },
    orientation: 'UP',
    rotation: (coordinates, orientation) => {
      if (orientation === 'UP') {
        const { a, b, c, d } = coordinates
        const [rb, cb] = b
        const [rc, cc] = c
        return [{ a, b: [rb - 1, cb + 1], c: [rc + 1, cc + 1], d }, 'LEFT']
      } else if (orientation === 'LEFT') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rc, cc] = c
        return [
          { a: [ra + 1, ca - 1], b: [rb + 2, cb], c: [rc - 1, cc + 1], d },
          'DOWN',
        ]
      } else if (orientation === 'DOWN') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rc, cc] = c
        return [
          { a: [ra + 1, ca + 1], b: [rb, cb + 2], c: [rc - 1, cc - 1], d },
          'RIGHT',
        ]
      } else if (orientation === 'RIGHT') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rc, cc] = c
        return [
          { a: [ra - 2, ca], b: [rb - 1, cb - 3], c: [rc + 1, cc - 1], d },
          'UP',
        ]
      } else {
        return [coordinates, orientation]
      }
    },
  },
  LEFT_L: {
    color: '#0000F0',
    type: 'LEFT_L',
    initialPlacement: {
      a: [-1, 4],
      b: [0, 4],
      c: [0, 5],
      d: [0, 6],
    },
    orientation: 'UP',
    rotation: (coordinates, orientation) => {
      if (orientation === 'UP') {
        const { a, b, c, d } = coordinates
        const [rc, cc] = c
        const [rd, cd] = d
        return [{ a, b, c: [rc, cc - 2], d: [rd - 2, cd - 2] }, 'LEFT']
      } else if (orientation === 'LEFT') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rc, cc] = c
        const [rd, cd] = d
        return [
          { a: [ra + 1, ca - 1], b, c: [rc + 1, cc + 1], d: [rd + 2, cd - 2] },
          'DOWN',
        ]
      } else if (orientation === 'DOWN') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rc, cc] = c
        const [rd, cd] = d
        return [
          { a: [ra + 1, ca + 1], b, c: [rc - 1, cc + 1], d: [rd + 2, cd + 2] },
          'RIGHT',
        ]
      } else if (orientation === 'RIGHT') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rd, cd] = d
        return [{ a: [ra - 2, ca], b, c, d: [rd - 2, cd + 2] }, 'UP']
      } else {
        return [coordinates, orientation]
      }
    },
  },
  LINE: {
    color: '#00F0F0',
    type: 'LINE',
    initialPlacement: {
      a: [-1, 4],
      b: [-1, 5],
      c: [-1, 6],
      d: [-1, 7],
    },
    orientation: 'HORIZONTAL',
    rotation: (coordinates, orientation) => {
      if (orientation === 'VERTICAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rc, cc] = c
        const [rd, cd] = d
        return [
          { a: [ra + 1, ca - 1], b, c: [rc - 1, cc + 1], d: [rd - 2, cd + 2] },
          'HORIZONTAL',
        ]
      } else if (orientation === 'HORIZONTAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rc, cc] = c
        const [rd, cd] = d
        return [
          { a: [ra - 1, ca + 1], b, c: [rc + 1, cc - 1], d: [rd + 2, cd - 2] },
          'VERTICAL',
        ]
      } else {
        return [coordinates, orientation]
      }
    },
  },
  Z: {
    color: '#007800',
    type: 'Z',
    initialPlacement: {
      a: [-1, 5],
      b: [-1, 6],
      c: [0, 4],
      d: [0, 5],
    },
    orientation: 'HORIZONTAL',
    rotation: (coordinates, orientation) => {
      if (orientation === 'HORIZONTAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rc, cc] = c
        return [
          { a: [ra + 1, ca - 1], b: [rb, cb - 2], c: [rc + 1, cc + 1], d },
          'VERTICAL',
        ]
      } else if (orientation === 'VERTICAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rc, cc] = c
        return [
          { a: [ra - 1, ca + 1], b: [rb, cb + 2], c: [rc - 1, cc - 1], d },
          'HORIZONTAL',
        ]
      } else {
        return [coordinates, orientation]
      }
    },
  },
  REV_Z: {
    color: '#780000',
    type: 'REV_Z',
    initialPlacement: {
      a: [-1, 4],
      b: [-1, 5],
      c: [0, 5],
      d: [0, 6],
    },
    orientation: 'HORIZONTAL',
    rotation: (coordinates, orientation) => {
      if (orientation === 'HORIZONTAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rd, cd] = d
        return [
          { a: [ra + 2, ca], b: [rb + 1, cb - 1], c, d: [rd - 1, cd - 1] },
          'VERTICAL',
        ]
      } else if (orientation === 'VERTICAL') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rd, cd] = d
        return [
          { a: [ra - 2, ca], b: [rb - 1, cb + 1], c, d: [rd + 1, cd + 1] },
          'HORIZONTAL',
        ]
      } else {
        return [coordinates, orientation]
      }
    },
  },
  T: {
    color: '#A000F0',
    type: 'T',
    initialPlacement: {
      a: [-1, 5],
      b: [0, 4],
      c: [0, 5],
      d: [0, 6],
    },
    orientation: 'UP',
    rotation: (coordinates, orientation) => {
      if (orientation === 'UP') {
        const [row, column] = coordinates.d
        return [{ ...coordinates, d: [row + 1, column - 1] }, 'LEFT']
      } else if (orientation === 'LEFT') {
        const [row, column] = coordinates.a
        return [{ ...coordinates, a: [row + 1, column + 1] }, 'DOWN']
      } else if (orientation === 'DOWN') {
        const [row, column] = coordinates.b
        return [{ ...coordinates, b: [row - 1, column + 1] }, 'RIGHT']
      } else if (orientation === 'RIGHT') {
        const { a, b, c, d } = coordinates
        const [ra, ca] = a
        const [rb, cb] = b
        const [rd, cd] = d
        return [
          {
            a: [ra - 1, ca - 1],
            b: [rb + 1, cb - 1],
            c,
            d: [rd - 1, cd + 1],
          },
          'UP',
        ]
      }
    },
  },
}

const BLANK = { color: 'transparent' }

export { boardSettings, pieces, BLANK }
