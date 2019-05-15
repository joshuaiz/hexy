import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBnJTTJzmXnueYM3w0Knnt3p_UnZ9iT-M4',
    authDomain: 'hexy-4fc2b.firebaseapp.com',
    databaseURL: 'https://hexy-4fc2b.firebaseio.com',
    projectId: 'hexy-4fc2b',
    storageBucket: 'hexy-4fc2b.appspot.com',
    messagingSenderId: '825648867476',
    appId: '1:825648867476:web:044519ad576de97c'
}

export default firebaseConfig

export const firebaseApp = firebase.initializeApp(firebaseConfig)

export const firebaseAppAuth = firebaseApp.auth()

export const db = firebase.firestore()

export const auth = () => firebase.auth()
