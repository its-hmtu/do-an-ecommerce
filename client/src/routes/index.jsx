import MainLayout from 'layouts/MainLayout'
import HomePage from 'pages/HomePage'
import LoginPage from 'pages/LoginPage'
import { createBrowserRouter } from 'react-router-dom'

export default createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      }
    ]
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