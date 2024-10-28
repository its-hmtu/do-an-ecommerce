import { CssBaseline, CssVarsProvider, GlobalStyles } from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import router from 'routes'

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange defaultMode='dark'>
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
  )
}

export default App
