import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='header-login-signup'>
      <div className='header-limiter'>
        <h1>
          <a href='/'>
            Chat with <span>ME</span>
          </a>
        </h1>
        <nav>
          <Link to='/'>Home</Link>
          <a className='selected'>
            <Link to='/'>About App</Link>
          </a>
          <a className='selected'>
            <Link to='/'>Contact Us</Link>
          </a>
        </nav>
        <ul>
          <li>
            <Link to='/Login'>Login</Link>
          </li>
          <li>
            <Link to='/Signup'>Signup</Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
