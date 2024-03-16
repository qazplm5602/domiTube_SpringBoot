import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Store from './Components/Redux/Store.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
