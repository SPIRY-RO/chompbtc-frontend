/* eslint-disable indent */

const INITIAL_STATE = {
  monthly: {
    total: 0,
    profit: 0,
    margin: 0,
    all: []
  },
  yearly: {
    total: 0,
    profit: 0,
    margin: 0,
    all: []
  },
  weekly: {
    total: 0,
    profit: 0,
    margin: 0,
    all: []
  },
  daily: {
    total: 0,
    profit: 0,
    margin: 0,
    all: []
  }
}

const Trades = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_TRADES_DATA':
      return action.Trades
    default:
      return state
  }
}

export default Trades
