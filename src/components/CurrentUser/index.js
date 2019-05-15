import React from 'react'
// import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
// import 'firebase/auth'
import { withRouter } from 'react-router-dom'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { compose } from 'recompose'

import { useAuthState } from 'react-firebase-hooks/auth'

const CurrentUser = () => {
    const { initialising, user } = useAuthState(firebase.auth())
    const login = () => {
        firebase.auth().signInWithEmailAndPassword('test@test.com', 'password')
    }
    const logout = () => {
        firebase.auth().signOut()
    }

    if (initialising) {
        return (
            <div>
                <p>Initialising User...</p>
            </div>
        )
    }
    if (user) {
        return (
            <div>
                <p>Current User: {user.email}</p>
                <button onClick={logout}>Log out</button>
            </div>
        )
    }
    return <button onClick={login}>Log in</button>
}

export default withRouter(CurrentUser)
