import React from 'react'
import LoginString from '../Login/LoginStrings'
import firebase from '../../Services/firebase'
import { useNavigate } from 'react-router-dom'
import './Chat.css'
// import ReactLoading from  'react-loading';
import ChatBox from '../ChatBox/ChatBox'
import WelcomeBoard from '../Welcome/Welcome'
import Images from '../../ProjectImages/ProjectImages'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate()

    return <Component navigate={navigate} {...props} />
  }

  return Wrapper
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      displayedContacts: [],
      displayedContactswithNotification: [],
      unReadMessages: 0,
    }
    this.currentUserDocumentId = localStorage.getItem(
      LoginString.FirebaseDocumentId
    )

    this.currentUserId = localStorage.getItem(LoginString.ID)

    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)

    this.currentUserName = localStorage.getItem(LoginString.Name)

    this.currentUserMessages = []

    this.searchUsers = []
    this.displayedContacts = []
    this.currentUserMessages = []
    this.notificationMessagesErase = []
    this.getListUsers = this.getListUsers.bind(this)

    this.renderListUser = this.renderListUser.bind(this)

    this.notificationErase = this.notificationErase.bind(this)

    this.onProfileClick = this.onProfileClick.bind(this)

    this.getClassnameforUserandNotification =
      this.getClassnameforUserandNotification.bind(this)

    this.updaterenderlist = this.updaterenderlist.bind(this)
  }

  logout = () => {
    firebase.auth().signOut()
    this.props.navigate('/')
    localStorage.clear()
  }

  onProfileClick = () => {
    this.props.navigate('/profile')
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.currentUserDocumentId)
      .onSnapshot((snpashot) => {
        console.log(snpashot.data(), 'snpashot.docs')
        this.currentUserMessages = snpashot.data().messages.map((item) => ({
          notificationId: item.notificationId,
          number: item.number,
        }))
        // console.log(this.currentUserMessages, 'this.currentUserMessages')
        this.setState({
          displayedContactswithNotification: this.currentUserMessages,
          unReadMessages: snpashot.data().unReadMessages,
        })
        this.getListUsers()
      })
  }

  getListUsers = async () => {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs[0].data(), 'snapshot')
        if (snapshot.docs.length > 0) {
          this.searchUsers = snapshot.docs.map((item, index) => ({
            key: index,
            documentkey: item.id,
            id: item.data().id,
            name: item.data().name,
            messages: item.data().messages,
            URL: item.data().URL,
            description: item.data().description,
            unReadMessages: item.data().unReadMessages,
          }))
          console.log(this.searchUsers, 'this.searchUsers')
        }
        this.renderListUser()
      })
    this.setState({ isLoading: false })
  }

  getClassnameforUserandNotification = (itemId) => {
    let number = 0
    let className = ''
    let check = false

    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = 'viewWrapItemFocused'
    } else {
      console.log(
        this.state.displayedContactswithNotification,
        'this.state.displayedContactswithNotification'
      )
      const notification = this.state.displayedContactswithNotification.reduce(
        (acc, curr) => {
          console.log(curr, 'curr')
          if (
            curr.notificationId.length > 0 &&
            curr.notificationId === itemId
          ) {
            acc.check = true
            acc.number = item.number
          }
          return acc
        },
        { check: false, number: 0 }
      )

      // console.log(notification, 'notification')
      if (notification.check === true) {
        className = 'viewWrapItemNotification'
      } else {
        className = 'viewWrapItem'
      }
    }
    return className
  }

  notificationErase = (itemId) => {
    this.notificationMessagesErase =
      this.state.displayedContactswithNotification.map((item) => {
        if (item.notificationId.length > 0 && item.notificationId !== itemId) {
          return {
            notificationId: item.notificationId,
            number: item.number,
          }
        }
      })

    this.updaterenderlist()
  }

  updaterenderlist = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(this.currentUserDocumentId)
      .update({ messages: this.notificationMessagesErase, unReadMessages: 0 })
    this.setState({
      displayedContactswithNotification: this.notificationMessagesErase,
    })
  }

  renderListUser = () => {
    console.log(this.searchUsers, 'renderListUser')
    if (this.searchUsers.length > 0) {
      let classname = ''
      // console.log(this.searchUsers, 'searchUsers')
      const viewListUser = this.searchUsers.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id)
          return (
            <button
              key={`btn-${item.key}`}
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id)
                this.setState({
                  currentPeerUser: item,
                  displayedContactswithNotification:
                    this.notificationMessagesErase,
                })
                document.getElementById(item.key).style.backgroundColor = '#fff'
                if (document.getElementById(item.key)) {
                  document.getElementById(item.key).style.color = '#fff'
                }
              }}
            >
              <img
                className='viewAvatarItem'
                src={item.URL}
                alt=''
                placeholder={Images.emptyphoto}
              />

              <div className='viewWrapContentItem'>
                <span className='textItem'>{`${item.name}`}</span>
              </div>
              {this.state.unReadMessages > 0 &&
              item.ID !== this.currentUserId ? (
                <div className='notificationpragraph'>
                  <p id={item.key} className='newmessages'>
                    {`New messages ${this.state.unReadMessages}`}
                  </p>
                </div>
              ) : null}
            </button>
          )
        }
      })
      this.setState({
        displayedContacts: viewListUser,
      })
    } else {
      console.log('No user is present')
    }
  }

  // Search event

  searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((el) => {
        let SearchValue = el.name.toLowerCase()
        return SearchValue.indexOf(searchQuery) !== -1
      })
    this.displayedContacts = displayedContacts
    this.displaySearchedContacts()
  }

  displaySearchedContacts = () => {
    if (this.searchUsers.length > 0) {
      let classname = ''
      const viewListUser = this.displayedContacts.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id)
          return (
            <button
              key={`btn-${item.key}`}
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id)
                this.setState({
                  currentPeerUser: item,
                  displayedContactswithNotification:
                    this.notificationMessagesErase,
                })
                document.getElementById(item.key).style.backgroundColor = '#fff'
                if (document.getElementById(item.key)) {
                  document.getElementById(item.key).style.color = '#fff'
                }
              }}
            >
              <img
                className='viewAvatarItem'
                src={item.URL}
                alt=''
                placeholder={Images.emptyphoto}
              />

              <div className='viewWrapContentItem'>
                <span className='textItem'>{` ${item.name}`}</span>
              </div>
              {classname === 'viewWrapItemNotification' ? (
                <div className='notificationpragraph'>
                  <p id={item.key} className='newmessages'>
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          )
        }
      })
      this.setState({
        displayedContacts: viewListUser,
      })
    } else {
      console.log('No user is present')
    }
  }

  render() {
    console.log(this.state.unReadMessages, 'this.state.unReadMessages')
    return (
      <div className='root'>
        <div className='body'>
          <div className='viewListUser'>
            <div className='profileviewleftside'>
              <img
                className='ProfilePicture'
                alt=''
                src={this.currentUserPhoto}
                onClick={this.onProfileClick}
              />
              <button className='Logout' onClick={this.logout}>
                Logout
              </button>
            </div>
            <div className='rootsearchbar'>
              <div className='input-container'>
                <i className='fa fa-search icon'></i>
                <input
                  className='input-field'
                  type='text'
                  onChange={this.searchHandler}
                  placeholder='Search'
                />
              </div>
            </div>
            {this.state.displayedContacts}
          </div>
          <div className='viewBoard'>
            {this.state.currentPeerUser ? (
              <ChatBox
                currentPeerUser={this.state.currentPeerUser}
                showToast={this.props.showToast}
              />
            ) : (
              <WelcomeBoard
                currentUserName={this.currentUserName}
                currentUserPhoto={this.currentUserPhoto}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Chat)
