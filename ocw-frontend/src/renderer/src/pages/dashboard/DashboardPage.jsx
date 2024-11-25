import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar';
import { BarChart, PieChart, LineChart } from '@mui/x-charts'
import { ScatterChart } from '@mui/x-charts/ScatterChart'
import apiService from '../../services/apiService'

export default function DashboardPage() {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState(null)
    const [orderServiceData, setOrderServiceData] = useState([])
    const [ordersByDate, setOrdersByDate] = useState({ dates: [], counts: [] })
    const [orderData, setOrderData] = useState([])
    const [barChartData, setBarChartData] = useState([])
    const [scatterChartData, setScatterChartData] = useState([])
    const [dates, setDates] = useState([])
    const [areas, setAreas] = useState([])

    useEffect(() => {
      fetchOrders()
    }, [])

    const fetchOrders = async () => {
      try {
        const data = await apiService.get('orders/api/finished_orders')
        setOrders(data)
        const serviceCount = data.reduce((acc, order) => {
          acc[order.service] = (acc[order.service] || 0) + 1
          return acc
        }, {})
        const pieData = Object.entries(serviceCount).map(([service, count], index) => ({
          id: index,
          label: service,
          value: count
        }))
        setOrderServiceData(pieData)

        const ordersByDate = data.reduce((acc, order) => {
          const date = new Date(order.delivery_date).toISOString().split('T')[0] 
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
        const sortedDates = Object.keys(ordersByDate).sort()
        const dateCounts = sortedDates.map((date) => ordersByDate[date])
        setOrdersByDate({ dates: sortedDates, counts: dateCounts })

        const areaCount = data.reduce((acc, order) => {
          acc[order.area] = (acc[order.area] || 0) + 1
          return acc
        }, {})
        const barData = Object.entries(areaCount).map(([area, count]) => ({
          label: area,
          value: count
        }))
        setOrderData(barData)

        //Calculate orders by area / end date
        const groupedData = data.reduce((acc, order) => {
          const area = order.area
          const date = new Date(order.delivery_date).toISOString().split('T')[0]
          if (!acc[area]) acc[area] = {}
          acc[area][date] = (acc[area][date] || 0) + 1
          return acc
        }, {})
        const uniqueDates = [
          ...new Set(data.map((order) => new Date(order.delivery_date).toISOString().split('T')[0]))
        ].sort()
        const uniqueAreas = Object.keys(groupedData)
        setDates(uniqueDates)
        setAreas(uniqueAreas)
        const scatterData = uniqueAreas.flatMap((area) =>
          uniqueDates.map((date) => ({
            x: date,
            y: area,
            value: groupedData[area][date] || 0
          }))
        )
        setScatterChartData(scatterData)
        const groupedDataByDate = data.reduce((acc, order) => {
          const date = new Date(order.delivery_date).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1 // Incrementa el conteo por fecha
          return acc
        }, {})
        const bar2Data = uniqueDates.map((date) => ({
          label: date,
          value: groupedDataByDate[date]
        }))
        setBarChartData(bar2Data)

      } catch (err) {
        setError(err.message)
        console.error('failed to load orders:', err)
      }
    }

  return (
    <>
      <Navbar tittle={'Dashboard'}></Navbar>
      <div className="h-screen flex flex-col">
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 p-4">
          <h1 className="text-center text font-bold text-2xl">Orders by Service</h1>
          <div className="flex mb-4">
            <BarChart
              width={500}
              height={300}
              xAxis={[{ scaleType: 'band', data: orderServiceData.map((d) => d.label) }]}
              series={[{ data: orderServiceData.map((d) => d.value) }]}
            />
            <PieChart
              series={[
                {
                  data: orderServiceData
                }
              ]}
              width={400}
              height={200}
            />
          </div>
          <h1 className="text-center text font-bold text-2xl">Orders by Date</h1>
          <div className="flex mb-4">
            <LineChart
              xAxis={[{ data: ordersByDate.dates }]}
              series={[
                {
                  data: ordersByDate.counts,
                  label: 'Complete orders'
                }
              ]}
              width={500}
              height={300}
            />
            <BarChart
              xAxis={[{ scaleType: 'band', data: ordersByDate.dates }]}
              series={[{ data: ordersByDate.counts }]}
              width={500}
              height={300}
            />
          </div>
          <h1 className="text-center text font-bold text-2xl">Orders by Area</h1>
          <div className="flex mb-4">
            <BarChart
              xAxis={[{ scaleType: 'band', data: orderData.map((d) => d.label) }]}
              series={[{ data: orderData.map((d) => d.value) }]}
              width={500}
              height={300}
            />
            <BarChart
              yAxis={[{ scaleType: 'band', data: orderData.map((d) => d.label) }]}
              series={[{ data: orderData.map((d) => d.value) }]}
              layout="horizontal"
              width={500}
              height={300}
            />
          </div>
          <h1 className="text-center text font-bold text-2xl">Orders by Area / Date</h1>
          <div className="flex mb-4">
            <BarChart
              xAxis={[{ scaleType: 'band', data: dates }]} // Eje X con las fechas
              yAxis={[
                { scaleType: 'linear', data: [0, Math.max(...barChartData.map((d) => d.value))] }
              ]} // Eje Y con las cantidades
              series={[{ data: barChartData.map((d) => d.value) }]} // Los valores para el gráfico
              layout="vertical"
              width={500}
              height={300}
            />
            <ScatterChart
              width={600}
              height={300}
              series={[{ label: 'Órdenes por Área', data: scatterChartData }]}
              xAxis={[{ scaleType: 'band', data: dates }]}
              yAxis={[{ scaleType: 'band', data: areas }]}
            />
          </div>
          <div className="h-[300px]"></div>
        </div>
      </div>
    </>
  )
}
