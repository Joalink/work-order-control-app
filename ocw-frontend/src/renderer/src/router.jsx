import { Outlet, useNavigate } from 'react-router-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import DashboardPage from "./pages/dashboardPage";
import Orders from "./pages/orders";



const AppRouter = () => {
      <>
      <Outlet/>
      <BrowserRouter>
        <Routes>
          <Route
              exact
              path='/'
              element={<AppContent/>}
              />
          <Route
              path='/orders'
              element={<Orders/>}
              >
              <Route
                exact
                path='neworder'
                element={<NewOrder/>}
                />
              <Route
                exact
                path='process'
                element={<Process/>}
                />
              <Route
                exact
                path='cutmaterial'
                element={<MaterialCut/>}
                />
                
          </Route>
          <Route
              exact
              path='/dashboard'
              element={<DashboardPage/>}
              />
        </Routes>
      </BrowserRouter>
    </>
  };


export default AppRouter;