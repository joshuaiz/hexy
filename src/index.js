import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
// import 'firebase/firestore'
import { firebaseAppAuth } from './config/firebaseconfig'
import { compose } from 'recompose'
import './index.css'
import App from './App'
// import * as serviceWorker from './serviceWorker'


const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider()
}

const RouterApp = () => {
    return (
        <Router>
            <App />
        </Router>
    )
}

// export default withRouter(RouterApp)

export default compose(
    withRouter,
    withFirebaseAuth({
        providers,
        firebaseAppAuth
    })
)(RouterApp)

ReactDOM.render(<RouterApp />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
