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
import Login from './Components/Login/Login.tsx'
import AccountSys from './Components/System/AccountSys.tsx'
import StudioLayout from './Components/Layout/StudioLayout.tsx'
import Search from './Components/Search/Search.tsx'
import Logout from './Components/Login/Logout.tsx'
import SubscribeChannel from './Components/SubscribeChannel/SubscribeChannel.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={Store}>
      <AccountSys />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/watch/:id' element={<Watch />} />
          <Route path='/channel/:id/:menu?' element={<Channel />} />
          <Route path='/search' element={<Search />} />
          <Route path='/subscribes' element={<SubscribeChannel />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          {/* <Route path='/header' element={<Header />} /> */}
          <Route path='/side' element={<MainLayout>밍밍</MainLayout>} />
          <Route path='/studio/*' element={<StudioLayout />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>,
)
