/* eslint-disable indent */

const INITIAL_STATE = [
  { currency: 'USD', value: 1 },
  { currency: 'EUR', value: 0.9 },
  { currency: 'CAD', value: 1.3 },
]

const Currencies = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENCIES_RATE':
      return action.Currencies
    default:
      return state
  }
}

export default Currencies
