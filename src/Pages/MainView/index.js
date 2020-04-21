import React, { useState } from 'react'
import { Layout, Menu, Icon, notification } from 'antd'
import logo from '../../Assets/img/logo-menu.png'
import { Link } from 'react-router-dom'
import api from '../../Services/api'
import Cookie from 'js-cookie'

const { Sider, Content, Header } = Layout

const { SubMenu } = Menu

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
})

const MainView = ({ children }) => {
  const handleLogout = () => {
    api.post('/logoutall', {}, {
      headers: {
        Authorization: `Bearer ${Cookie.get('jwt-token')}`
      }
    })
      .then(() => {
        Cookie.remove('jwt-token')
        window.location.href = '/login'
      })
      .catch(() => {
        notification.error({ message: 'Cannot log-out.' })
      })
  }

  const [collapsed, setCollapsed] = useState(true)

  const toggleCollapsed = () => setCollapsed(!collapsed)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={192}
        collapsible
        onCollapse={toggleCollapsed}
      >
        <Header>
          <img src={logo} className='nav-logo' alt='logo' />
        </Header>
        <Menu
          mode='inline'
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['']}
          theme='dark'
        >
          <Menu.Item key='dashboard'>
            <Link to='/dashboard'>
              <span>
                <Icon type='pie-chart' />
                <h1>Dashboard</h1>
              </span>
            </Link>
          </Menu.Item>
          <SubMenu
            key='history'
            title={
              <span>
                <Icon type='history' />
                <h1>History</h1>
              </span>
            }
          >
            <Menu.Item key='history-offers'>
              <Link to='/history/offers'>Offers</Link>
            </Menu.Item>
            <Menu.Item key='history-trafes'>
              <Link to='/history/trades'>Trades</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key='settings'
            title={
              <span>
                <Icon type='setting' />
                <h1>Settings</h1>
              </span>
            }
          >
            <Menu.Item key='settings-updaters'>
              <Link to='/settings/updaters'>Updaters</Link>
            </Menu.Item>
            <Menu.Item key='settings-fees'>
              <Link to='/settings/fees'>Processing fees</Link>
            </Menu.Item>
            <Menu.Item key='settings-ibm'>
              <Link to='/settings/ibm-watson'>IBM Watson</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item onClick={handleLogout}>
            <span>
              <IconFont type='icon-tuichu' />
              <h1>Log-out</h1>
            </span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{  }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainView
