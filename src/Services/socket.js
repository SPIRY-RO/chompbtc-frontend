import io from 'socket.io-client'

// eslint-disable-next-line
const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3100' : 'https://api.spiry.ro')

export default socket