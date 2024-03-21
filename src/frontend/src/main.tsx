import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

import './index.css'
import Store from './Components/Redux/Store.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './Components/Layout/MainLayout.tsx'
import Home from './Components/Home/Home.tsx'
import Watch from './Components/Watch/Watch.tsx'
import Channel from './Components/Channel/Channel.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/watch/:id' element={<Watch />} />
          <Route path='/channel/:id/:menu?' element={<Channel />} />
          {/* <Route path='/header' element={<Header />} /> */}
          <Route path='/side' element={<MainLayout>밍밍</MainLayout>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
