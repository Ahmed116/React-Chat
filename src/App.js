import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import Chat from './Pages/Chat/Chat'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import Profile from './Pages/Profile/Profile'

import { toast, ToastContainer } from 'react-toastify'

class App extends Component {
  showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message)
        break
      case 1:
        toast.success(message)
        break
      default:
    }
  }

  render() {
   
    return (
      <Router>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position={toast.POSITION.TOP_CENTER}
        />
        <Routes>
          <Route exact path='/' element={<Home showToast={this.showToast} />} />
          <Route path='/login' element={<Login showToast={this.showToast} />} />
          <Route
            path='/profile'
            element={<Profile showToast={this.showToast} />}
          />
          <Route
            path='/signup'
            element={<Signup showToast={this.showToast} />}
          />
          <Route path='/chat' element={<Chat showToast={this.showToast} />} />
        </Routes>
      </Router>
    )
  }
}

export default App
