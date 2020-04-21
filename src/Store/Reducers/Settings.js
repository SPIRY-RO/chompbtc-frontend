/* eslint-disable indent */

const INITIAL_STATE = [ ]

const Settings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_SETTINGS_DATA':
      return action.Settings
    default:
      return state
  }
}

export default Settings
