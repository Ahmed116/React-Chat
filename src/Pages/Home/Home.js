import React, { Component } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import './Home.css'
import Images from '../../ProjectImages/ProjectImages'
import { Link } from 'react-router-dom'

export default class HomePage extends Component {
  render() {
    console.log(this.props)
    return (
      <>
        <Header />
        <div className='splash-container'>
          <div className='splash'>
            <h1 className='splash-head'>Chat With Me</h1>
            <p className='splash-subhead'>
              A place to chat with your friends and family.
            </p>
            <div id='custom-button-wrapper'>
              <Link to='/login'>
                <a className='my-super-cool-btn'>
                  <div className='dots-container'>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                  <span className='buttoncooltext'>Get Started</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className='content-wrapper'>
          <div className='content'>
            <h2 className='content-head is-center'>
              Features That Make Chatting Easy
            </h2>
            <div className='Appfeatures'>
              <div className='contenthead'>
                <h3 className='content-subhead'>
                  <i className='fa fa-rocket'></i>
                  Get Started Quickly
                </h3>
                <p>
                  Just register yourself with this app and start chating with
                  your loved ones
                </p>
              </div>
              <div className='l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4'>
                <h3 className='content-subhead'>
                <i className="fa-solid fa-user-lock"></i>
                  Firebase Authentication
                </h3>
                <p>Firebase Authentication has been implemented in this app</p>
              </div>
              <div className='l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4'>
                <h3 className='content-subhead'>
                <i className="fa-solid fa-photo-film"></i>
                  Media
                </h3>
                <p>
                  You can share images with your friends for better experience
                </p>
              </div>
              <div className='l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4'>
                <h3 className='content-subhead'>
                <i className="fa-solid fa-arrows-spin"></i>
                  Updates
                </h3>
                <p>
                  We will working with new features for this app for better
                  experience in future
                </p>
              </div>
            </div>
          </div>
          <div className='AppfeaturesFounder'>
            <div className='l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5'>
              <img
                width='300'
                alt='File Icons'
                className='pure-img-responsive'
                src={Images.ahmed}
              />
            </div>
            <div className='pure-u-1 pure-u-md-1-2 pure-u-lg-3-5'>
              <h2 className='content-head content-head-ribbon'>Ahmed Hilles</h2>

              <p style={{ color: 'white' }}>The Founder of Chat With Me.</p>
              <p style={{ color: 'white' }}>
                Currently working at Chat With Me and busy to explore new ideas
                with new technologies being developed
              </p>
            </div>
          </div>

          <div className='content'>
            <h2 className='content-head is-center'>Who We Are?</h2>

            <div className='Appfeatures'>
              <div className='l-box-lrg pure-u-1 pure-u-md-2-5'>
                <form className='pure-form pure-form-stacked'>
                  <fieldset>
                    <label htmlFor='name'>Your Name</label>
                    <input id='name' type='text' placeholder='Your Name' />

                    <label htmlFor='email'>Your Email</label>
                    <input id='email' type='email' placeholder='Your Email' />

                    <label htmlFor='password'>Your Password</label>
                    <input
                      id='password'
                      type='password'
                      placeholder='Your Password'
                    />

                    <button type='submit' className='pure-button'>
                      Sign Up
                    </button>
                  </fieldset>
                </form>
              </div>

              <div className='l-box-lrg pure-u-1 pure-u-md-3-5'>
                <h4>Contact Us</h4>
                <p>
                  For any question or suggestion you can directly contact us on
                  our Facebook Page:
                  <a href=' https://web.facebook.com/programming438/'>
                    {' '}
                    https://web.facebook.com/programming438/
                  </a>
                </p>
                <p>
                  Twitter:
                  <a href='https://twitter.com/alizeb438'>
                    https://twitter.com/alizeb438
                  </a>
                </p>
                <p>
                  Facebook:{' '}
                  <a href='https://web.facebook.com/alizeb438 '>
                    https://web.facebook.com/alizeb438{' '}
                  </a>
                </p>
                <p>
                  Instagram:
                  <a href=' https://www.instagram.com/alizeb438/'>
                    {' '}
                    https://www.instagram.com/alizeb438/
                  </a>
                </p>

                <h4>More Information</h4>
                <p>To whom it may concern</p>
                <p>This App is developed by Ahmed Hilles</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}
