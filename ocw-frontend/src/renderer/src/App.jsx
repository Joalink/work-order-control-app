import { Outlet, useNavigate } from 'react-router-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import TopBar from './components/TopBar'
import Header from './components/Header';
import DashboardIcon from './assets/icons/dashboard_icon.svg';
import OrdersIcon from './assets/icons/orders_icon.svg'
import AnalyticsIcon from './assets/icons/analytics_icon.svg'

import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

import NewOrderPage from './pages/orders/NewOrderPage';
import ProcessOrderPage from './pages/orders/ProcessOrderPage';
import CutOrderPage from './pages/orders/CutOrderPage';
import FinishedOrderPage from './pages/orders/FinishedOrderPage';

import DateTimeZone from './utils/DateTimeZone';



function AppContent() {
  const navigate = useNavigate();

  const handleOrders = () => {
    navigate('orders')
  }

  const handleDashboard = () => {
    navigate('dashboard')
  }

  const handleAnalytics = () => {
    navigate('analytics')
  }

  return (
    <>
      <TopBar></TopBar>
      <DateTimeZone/>
      <Header></Header>
      
      <div className='flex justify-center py-8 space-x-10 ' >
        <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl" onClick={handleOrders}>
          Ordenes
          <img src={OrdersIcon} alt="orders" className="w-60 h-60 filter-white"/>
        </button> 

        <button 
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl" onClick={handleDashboard}>
          Graficos
          <img src={DashboardIcon} alt="dashboard" className="w-60 h-60 filter-white"/>
        </button>

        <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl" onClick={handleAnalytics}>
          Finanzas
          <img src={AnalyticsIcon} alt="dashboard" className="w-60 h-60 filter-white"/>
        </button>
      </div>
    </>
  )
}

function App() {
  return (
    <>
      <Outlet/>
      <HashRouter>
        <Routes>
          <Route  path='/' element={<AppContent/>}/>
          <Route path='/orders' element={<OrdersPage/>} >
              <Route  path='neworder' element={<NewOrderPage/>} />
              <Route  path='processorder' element={<ProcessOrderPage/>} />
              <Route  path='cutorder' element={<CutOrderPage/>}/>   
              <Route  path='finishedorder' element={<FinishedOrderPage/>}/>    
          </Route>
          <Route  path='/dashboard' element={<DashboardPage/>}/>
          <Route  path='/analytics' element={<AnalyticsPage/>}/>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App