import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'
import firebase from '../../Services/firebase'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Card } from 'react-bootstrap'
import LoginString from '../Login/LoginStrings'
import { useNavigate } from 'react-router-dom'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate()

    return <Component navigate={navigate} {...props} />
  }

  return Wrapper
}

class SignUp extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      name: '',
      error: null,
    }
    this.handlechange = this.handlechange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handlechange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  async handleSubmit(event) {
    const { name, password, email } = this.state
    event.preventDefault()
    this.setState({ error: '' })
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          firebase
            .firestore()
            .collection('users')
            .add({
              name,
              id: result.user.uid,
              email,
              password,
              URL: '',
              description: '',
              messages: [],

              unReadMessages: 0,
            })
            .then((docRef) => {
              localStorage.setItem(LoginString.ID, result.user.uid)
              localStorage.setItem(LoginString.Name, name)
              localStorage.setItem(LoginString.Email, email)
              localStorage.setItem(LoginString.Password, password)
              localStorage.setItem(LoginString.PhotoURL, '')
              localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed')
              localStorage.setItem(LoginString.Description, '')
              localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id)
              localStorage.setItem(LoginString.Description, '')
              this.setState({
                name: '',
                password: '',
                url: '',
              })
              this.props.navigate('/chat')
            })
            .catch((error) => {
              console.error('Error adding document', error)
            })
        })
    } catch (error) {
      document.getElementById('1').innerHTML =
        'Error in signing up please try again'
    }
  }

  render() {
    const Signinsee = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'White',
      backgroundColor: '#d4d4d4',
      width: '100%',
      boxShadow: ' 0 5px 5px #808888',
      height: '10rem',
      paddingTop: '48px',
    }

    return (
      <div>
        <CssBaseline />
        <Card style={Signinsee}>
          <div>
            <Typography component='h1' variant='h5'>
              Sign Up To
            </Typography>
          </div>
          <div>
            <Link to='/'>
              <button className='btn'>
                <i class='fa fa-home'></i> Chat With Me
              </button>
            </Link>
          </div>
        </Card>
        <Card className='formacontrooutside'>
          <form className='customform' noValidate onSubmit={this.handleSubmit}>
            {/* Email  */}

            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address-example:abc@gmail.com'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={this.handlechange}
              value={this.state.email}
            />
            <div>
              <p style={{ color: 'grey', fontSize: '15px', marginLeft: '0' }}>
                Password :length Greater than 6 (alphabet,number,special
                character)
              </p>
            </div>

            {/* Password */}

            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type='password'
              autoComplete='current-password'
              autoFocus
              onChange={this.handlechange}
              value={this.state.password}
            />

            {/* Name */}

            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='name'
              label='Your Name'
              name='name'
              autoComplete='name'
              autoFocus
              onChange={this.handlechange}
              value={this.state.name}
            />
            <div>
              <p style={{ color: 'grey', fontSize: '15px' }}>
                Please fill all fields and password should be greater than 6
              </p>
            </div>

            {/* Signup button */}

            <div className='CenterAliningItems'>
              <button className='button1' type='submit'>
                <span>Sign Up</span>
              </button>
            </div>

            <div>
              <p style={{ color: 'grey' }}>Already have and account?</p>
              <Link to='/login'>Login In</Link>
            </div>

            <div className='error'>
              <p id='1' style={{ color: 'red' }}></p>
            </div>
          </form>
        </Card>
      </div>
    )
  }
}

export default withRouter(SignUp)
