import axios from 'axios'
import Cookie from 'js-cookie'
import { notification } from 'antd'

const api = axios.create({
  // eslint-disable-next-line
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3100' : (process.env.API_URL ? process.env.API_URL : 'https://api.spiry.ro'),
  headers: {
    'Authorization': 'Bearer ' + Cookie.get('jwt-token')
  },
  responseType: 'json',
  transformResponse: (response) => {
    if (response)
      if (response.error) notification.error({ message: response.error })

    return response ? response : null
  }
})

export default api