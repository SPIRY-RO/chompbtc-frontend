import React, { useState, useEffect } from 'react'
import { Layout, Button, Divider, Form, notification, Typography, Input } from 'antd'
import Module from '../../../Components/Module'
import { useSelector, useDispatch } from 'react-redux'
import socket from '../../../Services/socket'
import api from '../../../Services/api'

const { Title } = Typography

const FeesSettingsPage = () => {

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
      <Module title={<Title level={4}>Processing fees</Title>}>
        <Divider/>
        <Form  {...formLayout}>
          <Form.Item label='Google Play'>
            <Input type='number' value={getSetting('gplay_fee')} onChange={(e) => handleChange({ name: 'gplay_fee', value: e.target.value })} placeholder='Insert Google Play fee here'/>
          </Form.Item>
          <Form.Item label='Steam'>
            <Input type='number' value={getSetting('steam_fee')} onChange={(e) => handleChange({ name: 'steam_fee', value: e.target.value })} placeholder='Insert Steam fee here'/>
          </Form.Item>
          <Form.Item label='Amazon'>
            <Input type='number' value={getSetting('amazon_fee')} onChange={(e) => handleChange({ name: 'amazon_fee', value: e.target.value })} placeholder='Insert Amazon fee here'/>
          </Form.Item>
          <Form.Item label='Prepaid cards'>
            <Input type='number' value={getSetting('prepaid_fee')} onChange={(e) => handleChange({ name: 'prepaid_fee', value: e.target.value })} placeholder='Insert prepaid cards fee here'/>
          </Form.Item>
        </Form>
      </Module>
    </Layout>
  )
}

export default FeesSettingsPage