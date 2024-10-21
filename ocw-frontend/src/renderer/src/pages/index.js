import OrdersPage from "./orders/OrdersPage";
import CutOrderPage from "./orders/CutOrderPage";
import ProcessOrderPage from "./orders/ProcessOrderPage";
import NewOrderPage from "./orders/NewOrderPage";
import DashboardPage from "./dashboard/DashboardPage"
import AnalyticsPage from "./analytics/AnalyticsPage";
import FinishedOrderPage from "./orders/FinishedOrderPage"; 

export default [
    {
        path: '/orders',
        name: 'Orders',
        element: <OrdersPage/>, 
        Children: [
            {
                path: '/neworder',
                name: 'NewOrder',
                element: <NewOrderPage/>
            },
            {
                path: '/cutorder',
                name: 'CutOrder',
                element: <CutOrderPage/>
            },
            {
                path: '/processorder',
                name: 'ProcessOrder',
                element: <ProcessOrderPage/>
            },
            {
                path: '/finishedorder',
                name: 'FinishedOrder',
                element: <FinishedOrderPage/>
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        element: <DashboardPage />,
        Children: [
          
        ]
    },
    {
        path: '/analytics',
        name: 'Analytics',
        element: <AnalyticsPage />,
        Children: [
          
        ]
    },
]