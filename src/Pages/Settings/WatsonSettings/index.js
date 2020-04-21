import React, { useState, useEffect } from 'react'
import { Layout, Button, Divider, Form, Switch, notification, Typography, Input } from 'antd'
import Module from '../../../Components/Module'
import { useSelector, useDispatch } from 'react-redux'
import socket from '../../../Services/socket'
import api from '../../../Services/api'

const { Title } = Typography

const WatsonSettingsPage = () => {

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
      <Module title={<Title level={4}>IBM Watson</Title>}>
        <Divider/>
        <Form  {...formLayout}>
          <Form.Item label='Service enabled'>
            <Switch checked={getSetting('watson_enabled')} onChange={(value) => handleChange({ name: 'watson_enabled', value })}/>
          </Form.Item>
          <Form.Item label='Watson key'>
            <Input value={getSetting('watson_key')} onChange={(e) => handleChange({ name: 'watson_key', value: e.target.value })} placeholder='Insert Watson key here'/>
          </Form.Item>
          <Form.Item label='Watson URL'>
            <Input value={getSetting('watson_url')} onChange={(e) => handleChange({ name: 'watson_url', value: e.target.value })} placeholder='Insert Watson URL here'/>
          </Form.Item>
        </Form>
        <Module bordered={true} title={<Title level={4}>Prepaid</Title>}>
          <Form  {...formLayout}>
            <Form.Item label='Assistant ID'>
              <Input value={getSetting('watson_id')} onChange={(e) => handleChange({ name: 'watson_id', value: e.target.value })} placeholder='Insert Watson prepaid cards assistant ID here'/>
            </Form.Item>
          </Form>
        </Module>
        <Module bordered={true} title={<Title level={4}>Steam</Title>}>
          <Form  {...formLayout}>
            <Form.Item label='Assistant ID'>
              <Input value={getSetting('watson_steam_id')} onChange={(e) => handleChange({ name: 'watson_steam_id', value: e.target.value })} placeholder='Insert Watson Steam assistant ID here'/>
            </Form.Item>
          </Form>
        </Module>
      </Module>
    </Layout>
  )
}

export default WatsonSettingsPage