import { Outlet, useNavigate } from 'react-router-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import DashboardIcon from './assets/icons/dashboard_icon.svg';
import OrdersIcon from './assets/icons/orders_icon.svg'
import AnalyticsIcon from './assets/icons/analytics_icon.svg'
import InventoryIcon from './assets/icons/inventory.svg'

import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import Inventory from './pages/inventory/Inventory';

import Active from './pages/orders/Active';
import Processed from './pages/orders/Processed';
import Cutting from './pages/orders/Cutting';
import Finished from './pages/orders/Finished';

import Locations from './pages/inventory/Locations';
import Products from './pages/inventory/Products';
import Movements from './pages/inventory/Movements';
import Stock from './pages/inventory/Stock';

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

  const handleinventory = () => {
    navigate('inventory')
  }


  return (
    <>
      <div className='flex flex-wrap justify-center py-8 space-x-4 md:space-x-10 ' >
        <button 
          className="flex flex-col items-center space-y-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl w-40 md:w-48 lg:w-56 xl:w-60" 
          onClick={handleOrders}
        >
          Orders
          <img src={OrdersIcon} alt="orders" className="w-60 h-60 filter-white"/>
        </button> 

        <button 
          className="flex flex-col items-center space-y-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl w-40 md:w-48 lg:w-56 xl:w-60"
          onClick={handleDashboard}
        >
          Dashboard
          <img src={DashboardIcon} alt="dashboard" className="w-60 h-60 filter-white"/>
        </button>

        <button 
          className="flex flex-col items-center space-y-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl w-40 md:w-48 lg:w-56 xl:w-60"
          onClick={handleAnalytics}
        >
          Finances
          <img src={AnalyticsIcon} alt="nce" className="w-60 h-60 filter-white"/>
        </button>
        <button 
          className="flex flex-col items-center space-y-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-2xl w-40 md:w-48 lg:w-56 xl:w-60"
          onClick={handleinventory}
        >
          Inventory
          <img src={InventoryIcon} alt="nce" className="w-60 h-60 filter-white"/>
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
            <Route  path='active' element={<Active/>} />
            <Route  path='processed' element={<Processed/>} />
            <Route  path='cutting' element={<Cutting/>}/>   
            <Route  path='finished' element={<Finished/>}/>    
          </Route>
          <Route  path='/dashboard' element={<DashboardPage/>}/>
          <Route  path='/analytics' element={<AnalyticsPage/>}/>
          <Route  path='/inventory' element={<Inventory/>}>
            <Route path='locations' element={<Locations/>}/>
            <Route path='products' element={<Products/>}/>
            <Route path='movements' element={<Movements/>}/>
            <Route path='stock' element={<Stock/>}/>
          </Route>

        </Routes>
      </HashRouter>
    </>
  )
}

export default App