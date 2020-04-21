import React, { useState, useEffect } from 'react'
import { Row, Col, Layout, Typography, Divider, notification } from 'antd'
import Module from '../../Components/Module'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'

const { Title } = Typography

Number.prototype.toCurrencyString = function () {
  return this.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

String.prototype.toCurrencyString = function () {
  return Number.parseFloat(this).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const DashboardPage = () => {
  const trades = useSelector(state => state.Trades)

  const [earned, setEarned] = useState({
    monthly: 0,
    daily: 0,
    yearly: 0,
    weekly: 0,
  })

  const [amounts, setAmounts] = useState({ averages: { yearly: 0, monthly: 0, weekly: 0, daily: 0 } })
  const [profits, setProfits] = useState({ averages: { yearly: 0, monthly: 0, weekly: 0, daily: 0 } })
  // const [amounts, setAmounts] = useState([])
  const [monthlyStats, setMonthlyStats] = useState([[],[]])
  const [heatmapStats, setHeatmapStats] = useState([{name: '00:00', data: [{ x: '0000-00-00', y: 0 }]}])
  const [heatmapDates, setHeatmapDates] = useState(['0000-00-00'])
  
  useEffect(() => {

    let x = 0
    let _earned = earned
    for (const period in trades) {
      const elem = trades[period]
      x = 0
      elem.all.map(trade => {
        try {
          let amount = Number.parseFloat(trade.fiat_amount_requested)
          x += amount
        } catch (e) {
          notification.error({message: e})
        }
      })
      _earned[period] = Number.parseFloat(x.toFixed(2)).toCurrencyString()
    }
    setEarned(_earned)

  }, [trades.daily])

  useEffect(() => {

    if (Array.isArray(trades.yearly.all)) {

      let dates = {}
      let _trades = trades.yearly.all

      _trades = _trades.filter(trade => {
        let today = new Date()
        let start_date = new Date(trade.started_at)
        let min_date = new Date().setDate(today.getDate() - 30)

        if (start_date >= min_date) return true
        else return false
      })

      _trades.map(trade => {
        let value = Number.parseFloat(trade.fiat_amount_requested)
        let profit = Number.parseFloat(trade.profit)

        if (dates[trade.started_at.split('T')[0]]) {
          dates[trade.started_at.split('T')[0]]['value'] += Number.parseFloat(value.toFixed(2))
          dates[trade.started_at.split('T')[0]]['profit'] += Number.parseFloat(profit.toFixed(2))
        } else {
          dates[trade.started_at.split('T')[0]] = { value: 0, profit: 0 }
          dates[trade.started_at.split('T')[0]]['value'] = Number.parseFloat(value.toFixed(2))
          dates[trade.started_at.split('T')[0]]['profit'] = Number.parseFloat(profit.toFixed(2))
        } 
      })

      let x = [[],[],[]]
      
      for (const date in dates) {
        if (isNaN(dates[date]['value'])) continue
        dates[date]['value'] = dates[date]['value'].toFixed(2)
        dates[date]['profit'] = dates[date]['profit'].toFixed(2)
        x[0].push(date)
        x[1].push(dates[date]['value'])
        x[2].push(dates[date]['profit'])
      }

      if (!x[0].length == 0)
        setMonthlyStats(x)

      let min_date = new Date()
      min_date.setDate(min_date.getDate() - 30)
      
      x = []
      const y = []

      
      for (let i = 0; i < 30; i++) {
        const date = new Date(min_date)
        date.setDate(min_date.getDate() + i)

        y.push(date.toISOString().split('T')[0])
      }

      for (let j = 0; j < 24; j++) {
        x[j] = {
          name: `${j < 10 ? `0${j}` : j}:00`,
          data: []
        }

        for (let i = 0; i < 30; i++) {
          const date = new Date(min_date)
          date.setDate(min_date.getDate() + i)

          const matchingTrades = _trades.filter(trade => {
            const started_at = new Date(trade.started_at)

            if (started_at.getDate() === date.getDate() && started_at.getMonth() === date.getMonth()) {
              if (started_at.getHours() === j) {
                return true
              }
            }
          })
  
          x[j].data.push({
            x: date.toISOString().split('T')[0],
            y: matchingTrades.length
          })
        }
      }

      setHeatmapDates(y)
      setHeatmapStats(x)

      // Profit insights
      _trades = trades.yearly.all
      const _yearly = _trades.map(x => x.profit)
      
      const _monthly = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => x.profit)

      min_date.setDate(min_date.getDate() + 23)
      const _weekly = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => x.profit)

      min_date.setDate(min_date.getDate() + 6)
      const _daily = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => x.profit)

      const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

      const _yearlyAverage = arrAvg(_yearly)
      const _monthlyAverage = arrAvg(_monthly)
      const _weeklyAverage = arrAvg(_weekly)
      const _dailyAverage = arrAvg(_daily)

      const _profits = {
        yearly: [..._yearly],
        monthly: [..._monthly],
        weekly: [..._weekly],
        daily: [..._daily],
        averages: {
          yearly: _yearlyAverage,
          monthly: _monthlyAverage,
          weekly: _weeklyAverage,
          daily: _dailyAverage,
        }
      }

      setProfits(_profits)

      min_date = new Date()
      min_date.setDate(min_date.getDate() - 30)

      // Amount insights
      _trades = trades.yearly.all
      const yearly = _trades.map(x => Number.parseFloat(x.fiat_amount_requested))
      
      const monthly = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => Number.parseFloat(x.fiat_amount_requested))

      min_date.setDate(min_date.getDate() + 23)
      const weekly = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => Number.parseFloat(x.fiat_amount_requested))

      min_date.setDate(min_date.getDate() + 6)
      const daily = _trades.filter(x => {
        const started_at = new Date(x.started_at)
        if (started_at >= min_date) return true
      }).map(x => Number.parseFloat(x.fiat_amount_requested))

      const yearlyAverage = arrAvg(yearly)
      const monthlyAverage = arrAvg(monthly)
      const weeklyAverage = arrAvg(weekly)
      const dailyAverage = arrAvg(daily)

      const _amounts = {
        yearly: [...yearly],
        monthly: [...monthly],
        weekly: [...weekly],
        daily: [...daily],
        averages: {
          yearly: yearlyAverage,
          monthly: monthlyAverage,
          weekly: weeklyAverage,
          daily: dailyAverage,
        }
      }

      setAmounts(_amounts)

      console.log(_amounts)

    }

  }, [trades.daily])

  return (
    <Layout>
      <Row>
        <Col md={6}>
          <Module loading={earned.yearly === 0} title='Completed trades' >
            <Title className='green' level={2}>
              $ {earned.yearly}
            </Title>
            <p>Profit {trades.yearly.profit.toFixed(2).toCurrencyString()}</p>
            <p>Margin {trades.yearly.margin.toFixed(2)}%</p>
            <p>Total {trades.yearly.all.length}</p>
            <Divider />
            <span>Yearly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={earned.monthly === 0} title='Completed trades' >
            <Title className='green' level={2}>
              $ {earned.monthly}
            </Title>
            <p>Profit {trades.monthly.profit.toFixed(2).toCurrencyString()}</p>
            <p>Margin {trades.monthly.margin.toFixed(2)}%</p>
            <p>Total {trades.monthly.all.length}</p>
            <Divider />
            <span>Monthly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={earned.weekly === 0} title='Completed trades' >
            <Title className='green' level={2}>
              $ {earned.weekly}
            </Title>
            <p>Profit {trades.weekly.profit.toFixed(2).toCurrencyString()}</p>
            <p>Margin {trades.weekly.margin.toFixed(2)}%</p>
            <p>Total {trades.weekly.all.length}</p>
            <Divider />
            <span>Weekly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={earned.daily === 0} title='Completed trades' >
            <Title className='green' level={2}>
              $ {earned.daily}
            </Title>
            <p>Profit {trades.daily.profit.toFixed(2).toCurrencyString()}</p>
            <p>Margin {trades.daily.margin.toFixed(2)}%</p>
            <p>Total {trades.daily.all.length}</p>
            <Divider />
            <span>Daily</span>
          </Module>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <Module title='Monthly overview' loading={monthlyStats[0].length == 0}>
            <Chart
              options={{
                chart: {
                  id: 'basic-bar'
                },
                xaxis: {
                  categories: monthlyStats[0]
                },
                colors: ['#53c93b', '#b93690']
              }}
              series={[{
                name: 'Volume (USD)',
                data: monthlyStats[1]
              }, {
                name: 'Profit (USD)',
                data: monthlyStats[2]
              }]}
              type="line"
              height={300}
            />
          </Module>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Module loading={!profits.averages.yearly} title='Average profit' >
            <Title className='green' level={2}>
              $ {profits.averages.yearly.toFixed(2).toCurrencyString()}
            </Title>
            Average amount
            <Title className='green' level={2}>
              $ {amounts.averages.yearly.toFixed(2).toCurrencyString()}
            </Title>
            <Divider />
            <span>Yearly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={!profits.averages.monthly} title='Average profit' >
            <Title className='green' level={2}>
              $ {profits.averages.monthly.toFixed(2).toCurrencyString()}
            </Title>
            Average amount
            <Title className='green' level={2}>
              $ {amounts.averages.monthly.toFixed(2).toCurrencyString()}
            </Title>
            <Divider />
            <span>Monthly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={!profits.averages.weekly} title='Average profit' >
            <Title className='green' level={2}>
              $ {profits.averages.weekly.toFixed(2).toCurrencyString()}
            </Title>
            Average amount
            <Title className='green' level={2}>
              $ {amounts.averages.weekly.toFixed(2).toCurrencyString()}
            </Title>
            <Divider />
            <span>Weekly</span>
          </Module>
        </Col>
        <Col md={6}>
          <Module loading={!profits.averages.daily} title='Average profit' >
            <Title className='green' level={2}>
              $ {profits.averages.daily.toFixed(2).toCurrencyString()}
            </Title>
            Average amount
            <Title className='green' level={2}>
              $ {amounts.averages.daily.toFixed(2).toCurrencyString()}
            </Title>
            <Divider />
            <span>Daily</span>
          </Module>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <Module title='Activity heatmap' loading={monthlyStats[0].length == 0}>
            <Chart
              options={{
                chart: {
                  id: 'heatmap'
                },
                plotOptions: {
                  heatmap: {
                    colorScale: {
                      ranges: [{
                        from: -1,
                        to: 5,
                        color: '#1c7ed6',
                        name: 'Low'
                      }, {
                        from: 6,
                        to: 12,
                        color: '#53c93b',
                        name: 'High'
                      }, {
                        from: 13,
                        to: 25,
                        color: '#b93690',
                        name: 'Extreme'
                      }]
                    }
                  }
                },
                xaxis: {
                  categories: heatmapDates
                },
                dataLabels: {
                  enabled: false
                }
              }}
              type="heatmap"
              height={600}
              series={heatmapStats}
            />
          </Module>
        </Col>
      </Row>
    </Layout>
  )
}

export default DashboardPage
