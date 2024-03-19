import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

import './index.css'
import Store from './Components/Redux/Store.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Components/Header/Header.tsx'
import MainLayout from './Components/Layout/MainLayout.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout>ㅁㄴㅇㄻㄴㅇㄹ</MainLayout>} />
          {/* <Route path='/header' element={<Header />} /> */}
          <Route path='/side' element={<MainLayout>밍밍</MainLayout>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
