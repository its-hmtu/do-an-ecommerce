import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';
import { CssVarsProvider, CssBaseline, GlobalStyles } from '@mui/joy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
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
