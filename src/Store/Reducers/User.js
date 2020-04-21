/* eslint-disable indent */
import Cookie from 'js-cookie'

const INITIAL_STATE = {
  logged: false,
  jwt: Cookie.get('jwt-token') || null,
  userData: {},
  loading: true
}

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_USER_DATA':
      return action.User
    default:
      return state
  }
}

export default user
