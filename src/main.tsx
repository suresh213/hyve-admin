/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import '@/global.css'
import router from '@/router'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from './store'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <RouterProvider
          router={router.router}
          fallbackElement={<div>Loading...</div>}
        />
        <Toaster />
      </ThemeProvider>
    </Provider>
  )
}

export default App

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
