import { CssBaseline, CssVarsProvider, GlobalStyles } from '@mui/joy'
import { RouterProvider, ScrollRestoration } from 'react-router-dom'
import router from 'routes'

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange defaultMode='light' mode='light'>
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
