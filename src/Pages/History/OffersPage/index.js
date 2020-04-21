import React, { useEffect, useState } from 'react'
import { Layout, Table, Switch, Form, Typography } from 'antd'
import { useSelector } from 'react-redux'
import Module from '../../../Components/Module'

const { Title } = Typography

const OffersPage = () => {

  const Offers = useSelector(state => state.Offers)
  const [filters, setFilters] = useState({ active: true, offer_type: 'sell' })
  const [offers, setOffers] = useState([])

  const filter = () => {
    let x = Offers.all
    x = x.filter(offer => offer.active === filters.active)
    x = x.filter(offer => offer.offer_type === filters.offer_type)
    setOffers(x)
  }

  useEffect(filter, [filters])
  useEffect(filter, [Offers])

  const columns = [
    {
      title: 'Offer type',
      dataIndex: 'offer_type',
      key: 'offer_type'
    },
    {
      title: 'Offer hash',
      dataIndex: 'offer_hash',
      key: 'offer_hash'
    },
    {
      title: 'Payment method',
      dataIndex: 'payment_method_name',
      key: 'payment_method_name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.payment_method_slug < b.payment_method_slug ? -1 : 1,
    },
    {
      title: 'Currency code',
      dataIndex: 'fiat_currency_code',
      key: 'fiat_currency_code',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.fiat_currency_code < b.fiat_currency_code ? -1 : 1,
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Number.parseFloat(a.margin) < Number.parseFloat(b.margin) ? -1 : 1,
    }
  ]
  
  return (
    <Layout>
      <Module title={<Title level={4}>Filters</Title>}>
        <Form layout='inline'>
          <Form.Item>
            <Switch checked={filters.active} size='default' onChange={active => setFilters({...filters, active})} checkedChildren='Active' unCheckedChildren='Active' />
          </Form.Item>
          <Form.Item>
            <Switch checked={filters.offer_type === 'sell'} size='default' onChange={active => setFilters({...filters, offer_type: active ? 'sell' : 'buy'})} checkedChildren='Sell' unCheckedChildren='Buy' />
          </Form.Item>
        </Form>
      </Module>
      <Module title={<Title level={4}>Offers</Title>}>
        <Table bodyStyle={{backgroundColor: '#ececec'}} columns={columns} dataSource={offers} loading={Offers.all.length === 0} />
      </Module>
    </Layout>
  )
}

export default OffersPage