import MainLayout from 'layouts/MainLayout'
import LoginPage from 'pages/LoginPage'
import { createBrowserRouter } from 'react-router-dom'

export default createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
  }, 
  {
    path: '/account/login',
    element: <LoginPage />,
  },
  {
    path: '/account/register',
    element: <LoginPage register />,
  }
])