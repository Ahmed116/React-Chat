import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCC3_cqGhqDLvjqu5y48CKKxUE-dyfNnG8',
  authDomain: 'chat-app-715e6.firebaseapp.com',
  projectId: 'chat-app-715e6',
  storageBucket: 'gs://chat-app-715e6.appspot.com',
  messagingSenderId: '887368351657',
  appId: '1:887368351657:web:000cfc2d0d8cbcd4160eb8',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase
