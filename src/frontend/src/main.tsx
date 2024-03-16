import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

import './index.css'
import Store from './Components/Redux/Store.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.tsx'
import Header from './Components/Header/Header.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/header' element={<Header />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
