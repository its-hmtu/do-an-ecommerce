import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';
import { CssVarsProvider, CssBaseline, GlobalStyles } from '@mui/joy';
import OrdersPage from 'pages/OrdersPage';
import RolesPage from 'pages/RolesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />
      },
      {
        path: '/users',
        element: <div>Users</div>
      },
      {
        path: '/profile',
        element: <div>Profile</div>
      }, 
      {
        path: '/users/roles',
        element: <RolesPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transitions
          },
          
        }}
      />
      <RouterProvider router={router}/>
    </CssVarsProvider>
  );
}

export default App;
