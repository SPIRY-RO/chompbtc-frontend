import React, { useState, useEffect } from 'react'
import { Layout, Card, Form, Icon, Input, Button, notification } from 'antd'
import logo from '../../Assets/img/logo-green.png'
import login_background from '../../Assets/img/1.png'
import api from '../../Services/api'
import { useDispatch, useSelector } from 'react-redux'
import Cookie from 'js-cookie'

const { Content } = Layout
const background_style = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundImage: `url(${login_background})`
};
const LoginPage = ({ history }) => {
  const [formValue, setFormValue] = useState({})
  const [isLogging, setIsLogging] = useState(false)

  const userData = useSelector(state => state.User)
  const dispatch = useDispatch()

  const changeUserData = data => {
    dispatch({ type: 'CHANGE_USER_DATA', User: data })
  }
  useEffect(() => {
    if (userData.jwt) {
      api.get('/users/me')
        .then(() => {
          notification.success({ message: 'You were already logged in!' })
          changeUserData({ ...userData, loading: false, logged: true })
          history.push('/dashboard')
        })
        .catch(() => {
          notification.error({ message: 'Log-in credentials expired. Please log-in again!' })
          Cookie.remove('jwt-token')
          changeUserData({ ...userData, loading: false })
        })
        .finally(() => {
          setIsLogging(false)
        })
    } else {
      changeUserData({ ...userData, loading: false })
    }

    return function cleanup () {
      setFormValue({})
      setIsLogging(false)
    }
    // eslint-disable-next-line
  }, [])

  const handleChange = (e) => {
    let x = formValue
    x[e.target.name] = e.target.value
    setFormValue(x)
  }

  const handleSubmit = () => {
    setIsLogging(true)
    api.post('/login', formValue)
      .then(response => response.data)
      .then(response => {
        changeUserData({ ...userData, userData: response.user, logged: true, jwt: response.user.tokens[response.user.tokens.length - 1].token})
        
        notification.success({
          message: 'Successfuly logged in!'
        })

        Cookie.set('jwt-token', response.user.tokens[response.user.tokens.length - 1].token)

        // window.location.replace('/dashboard')
        history.push('/dashboard')

      })
      .catch(() => {
        notification.error({
          message: 'Invalid login credentials!'
        })
      })
      .finally(() => {
        setTimeout(() => setIsLogging(false), 1000)
      })
  }

  return (
    <Layout style={ background_style }>
      <Content className='full-height vertical-center container'>
        <Card bordered={false}>
          <img src={logo} alt='Logo' className='logo center' />
          <div className={'container animated' + (userData.loading ? ' hidden' : '')}>
            <Form onSubmit={handleSubmit}>
              <Form.Item >
                <Input 
                  size={'large'}
                  prefix={
                    <Icon type='user' />
                  }
                  name='username'
                  onChange={handleChange}
                  placeholder='Username'
                />
              </Form.Item>
              <Form.Item >
                <Input
                  size={'large'}
                  prefix={
                    <Icon type='key' />
                  }
                  name='password'
                  onChange={handleChange}
                  placeholder='Password'
                  type='password'
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' size='large' loading={isLogging} onClick={handleSubmit}>
                <Icon type="login" />Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </Content>
      <p className='text-center'><Icon type="rocket" />BATTLESTATION • v. 1.0.1 </p>
    </Layout>
  )
}

export default LoginPage
