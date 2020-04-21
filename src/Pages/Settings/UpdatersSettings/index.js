import React, { useState, useEffect } from 'react'
import { Layout, Button, Divider, Form, Switch, notification, Typography } from 'antd'
import Module from '../../../Components/Module'
import { useSelector, useDispatch } from 'react-redux'
import socket from '../../../Services/socket'
import api from '../../../Services/api'

const { Title } = Typography

const UpdatersSettingsPage = () => {

  const [loading, setLoading] = useState(false)

  const settings = useSelector(state => state.Settings)
  const dispatch = useDispatch()

  const changeSettings = data => {
    dispatch({ type: 'CHANGE_SETTINGS_DATA', Settings: data })
  }

  const getData = async () => {
    socket.emit('settings')

    socket.on('settings', changeSettings)
  }

  const getSetting = (name) => {
    let setting = settings.find(v => v.name === name)
    return setting ? setting.value : null
  }

  const handleChange = ({ name, value }) => {
    let x = settings.filter(v => v.name !== name)

    x.push({name, value})

    changeSettings(x)
  }

  const handleSubmit = () => {
    setLoading(true)

    settings.forEach(async ({ name, value }) => {
      try {
        await api.post('/setting', { name,value })
      } catch (e) {
        notification.error({ message: `Failed to save setting ${name} with value ${value}!` })
      }
    })

    notification.success({ message: 'Settings updated successfully!' })
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 }
  }

  return (
    <Layout>
      <Module>
        <Button onClick={handleSubmit} loading={loading} type='primary'>Save settings</Button>
      </Module>
      <Module title={<Title level={4}>Auto updates</Title>}>
        <Divider/>
        <Form {...formLayout}>
          <Form.Item label='Open trades'>
            <Switch checked={getSetting('sync_open_trades')} onChange={(value) => handleChange({ name: 'sync_open_trades', value })}/>
          </Form.Item>
          <Form.Item label='Completed trades'>
            <Switch checked={getSetting('sync_completed_trades')} onChange={(value) => handleChange({ name: 'sync_completed_trades', value })}/>
          </Form.Item>
          <Form.Item label='Offers'>
            <Switch checked={getSetting('sync_offers')} onChange={(value) => handleChange({ name: 'sync_offers', value })}/>
          </Form.Item>
          <Form.Item label='Currencies'>
            <Switch checked={getSetting('sync_currencies')} onChange={(value) => handleChange({ name: 'sync_currencies', value })}/>
          </Form.Item>
          <Form.Item label='PayPal invoicing'>
            <Switch checked={getSetting('paypal_enabled')} onChange={(value) => handleChange({ name: 'paypal_enabled', value })}/>
          </Form.Item>
        </Form>
      </Module>
    </Layout>
  )
}

export default UpdatersSettingsPage