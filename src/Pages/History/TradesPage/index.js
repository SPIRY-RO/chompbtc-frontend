import React, { useEffect, useState } from 'react'
import { Layout, Table, Switch, Form, Typography } from 'antd'
import { useSelector } from 'react-redux'
import Module from '../../../Components/Module'

const { Title } = Typography

const TradesPage = () => {

  const OpenTrades = useSelector(state => state.OpenTrades)
  const Trades = useSelector(state => state.Trades.monthly.all)
  const [filters, setFilters] = useState({ open: true })
  const [data, setData] = useState([])

  const filter = () => {
    let x = filters.open ? OpenTrades : Trades
    setData(x)
  }

  useEffect(filter, [filters, OpenTrades, Trades])

  const columns = [
    {
      title: 'Status',
      dataIndex: filters.open ? 'trade_status' : 'status',
      key: filters.open ? 'trade_status' : 'status'
    },
    {
      title: 'Started at',
      dataIndex: 'started_at',
      key: 'started_at',
      sorter: (a, b) => new Date(a.started_at) < new Date(b.started_at) ? 1 : -1
    },
    {
      title: 'Trade hash',
      dataIndex: 'trade_hash',
      key: 'trade_hash'
    },
    {
      title: 'Amount requested',
      dataIndex: 'fiat_amount_requested',
      key: 'fiat_amount_requested',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Number.parseFloat(a.fiat_amount_requested) < Number.parseFloat(b.fiat_amount_requested) ? -1 : 1,
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Number.parseFloat(a.margin) < Number.parseFloat(b.margin) ? -1 : 1,
    },
    {
      title: 'Fee percentage',
      dataIndex: 'fee_percentage',
      key: 'fee_percentage',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Number.parseFloat(a.fee_percentage) < Number.parseFloat(b.fee_percentage) ? -1 : 1,
    }
  ]

  if (!filters.open)
    columns.push({
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Number.parseFloat(a.profit) < Number.parseFloat(b.profit) ? -1 : 1,
    })
  
  return (
    <Layout>
      <Module title={<Title level={4}>Filters</Title>}>
        <Form layout='inline'>
          <Form.Item>
            <Switch checked={!filters.open} size='default' onChange={open => setFilters({...filters, open: !open})} checkedChildren='Completed trades' unCheckedChildren='Open trades' />
          </Form.Item>
        </Form>
      </Module>
      <Module title={<Title level={4}>Trades</Title>}>
        <Table bodyStyle={{backgroundColor: '#ececec'}} columns={columns} dataSource={data} />
      </Module>
    </Layout>
  )
}

export default TradesPage