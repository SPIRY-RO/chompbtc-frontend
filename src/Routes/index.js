import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import LoginPage from '../Pages/Login'
import { useSelector, useDispatch } from 'react-redux'
import MainView from '../Pages/MainView'
import DashboardPage from '../Pages/Dashboard'
import OffersPage from '../Pages/History/OffersPage'
import api from '../Services/api'
import { notification } from 'antd'
import Cookie from 'js-cookie'
import TradesPage from '../Pages/History/TradesPage'
import UpdatersSettingsPage from '../Pages/Settings/UpdatersSettings'
import FeesSettingsPage from '../Pages/Settings/FeesSettings'
import WatsonSettingsPage from '../Pages/Settings/WatsonSettings'

const Routes = () => {
  const userData = useSelector(state => state.User)
  const dispatch = useDispatch()

  const changeUserData = data => {
    dispatch({ type: 'CHANGE_USER_DATA', User: data })
  }

  const checkLogged = () => {
    if (userData.loading === true)
      api
        .get('/users/me')
        .then(() => {
          if (window.location.pathname === '/') window.location.replace('/dashboard')
          notification.success({ message: 'You were already logged in!' })
          changeUserData({ ...userData, loading: false, logged: true })
        })
        .catch(() => {
          Cookie.remove('jwt-token')
          if (window.location.pathname !== '/login') window.location.replace('/login')
          changeUserData({ ...userData, loading: false, logged: false })
        })
  }

  useEffect(checkLogged, [])

  return (
    <BrowserRouter>
      <Switch>
        {userData.logged ? (
          <MainView>
            <Route exact path='/dashboard' component={DashboardPage} />
            <Route exact path='/history/offers' component={OffersPage} />
            <Route exact path='/history/trades' component={TradesPage} />
            <Route exact path='/settings/updaters' component={UpdatersSettingsPage} />
            <Route exact path='/settings/fees' component={FeesSettingsPage} />
            <Route exact path='/settings/ibm-watson' component={WatsonSettingsPage} />
          </MainView>
        ) : (
          <Route exact path='/login' component={LoginPage} />
        )}
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
