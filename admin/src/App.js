import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';
import { CssVarsProvider, CssBaseline, GlobalStyles } from '@mui/joy';
import OrdersPage from 'pages/OrdersPage';
import RolesPage from 'pages/RolesPage';
import { useEffect } from 'react';
import ProductPage from 'pages/ProductPage';
import ProductTable from 'pages/ProductPage/components/ProductTable';
import ProductDetailsPage from 'pages/ProductDetailsPage';

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
        path: '/products',
        element: <ProductPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailsPage />
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
        path: '/roles',
        element: <RolesPage />,
        children: [
          {
            path: 'roles/create-new-role',
            element: <div>Role</div>
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])

function App() {
  // useEffect(() => {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     router.navigate('/login');
  //   }
  // }, [])

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
