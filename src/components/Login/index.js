import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { format } from 'date-fns'
import { login, signup } from '../../utils/user'
import Modal from '../Modal'

const Login = () => {
    const { user } = useAuthState(firebase.auth())
    const [tab1Active, setTab1Active] = useState(true)
    const [error, setError] = useState()
    const [modalContent, setModalContent] = useState()


    const handleLogin = async event => {
        event.preventDefault()
        const { email, password } = event.target.elements
        login(email.value, password.value).catch(error => {
            // console.log(error)
            setError(error)
            setModalContent(() => {
                return <div className="error-message">{error.message}</div>
            })
        })
    }

    const handleTabs = () => {
        setTab1Active(!tab1Active)
    }

    const handleSignUp = async event => {
        event.preventDefault()
        const { email, password, username } = event.target.elements

        const date = format(Date.now(), 'yyyy-MM-dd', {
            awareOfUnicodeTokens: true
        })

        signup({
            email: email.value,
            password: password.value,
            displayName: username.value,
            startDate: date
        }).catch(error => {
            // console.log(error)
            setError(error)
            setModalContent(() => {
                return <div className="error-message">{error.message}</div>
            })
        })
    }

    const forgotPassword = () => {

    }

    // const updatePassword = () => {
    //     // var auth = firebase.auth();
    //     thisUser = firebase.auth().currentUser;
    //     let emailAddress;

    //     if (thisUser != null) {
    //     thisUser.providerData.forEach(function (profile) {
    //       emailAddress = profile.email
    //     });

    //     thisUser.sendPasswordResetEmail(emailAddress).then(function() {
    //       console.log('Email sent!')
    //     }).catch(function(error) {
    //       console.log('something went wrong - email not sent')
    //     });
    // }

    return (
        <div className="login-tabs">
            {!user && (
                <div className="tabs">
                    <div className="tab-triggers">
                        <div
                            className={`tab-title tab-title-1 ${
                                tab1Active ? 'tab-active' : ''
                            }`}
                            onClick={handleTabs}
                        >
                            <h2>Log In</h2>
                        </div>
                        <div
                            className={`tab-title tab-title-2 ${
                                !tab1Active ? 'tab-active' : ''
                            }`}
                            onClick={handleTabs}
                        >
                            <h2>Sign Up</h2>
                        </div>
                    </div>
                    <div className="tabs-inner">
                        <div
                            className={`tab1 tab ${
                                tab1Active ? 'active' : 'inactive'
                            }`}
                        >
                            <div className="login-form">
                                <div className="tab-content">
                                    <form
                                        className="tab-form"
                                        onSubmit={handleLogin}
                                    >
                                        <label>
                                            <div className="input-label">
                                                Email
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="you@youremail.com"
                                            />
                                        </label>
                                        <label>
                                            <div className="input-label">
                                                Password
                                            </div>
                                            <input
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </label>
                                        <button
                                            className="button"
                                            type="submit"
                                        >
                                            Log In
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="forgot-password-link">
                                <Link to="/reset-password">Forgot your password?</Link>
                            </div>
                        </div>
                        <div
                            className={`tab2 tab ${
                                tab1Active ? 'inactive' : 'active'
                            }`}
                        >
                            <div className="login-form">
                                <div className="tab-content">
                                    <form
                                        className="tab-form"
                                        onSubmit={handleSignUp}
                                    >
                                        <label>
                                            <div className="input-label">
                                                Username
                                            </div>
                                            <input
                                                name="username"
                                                type="text"
                                                placeholder="Username (no spaces or special characters)"
                                            />
                                        </label>
                                        <label>
                                            <div className="input-label">
                                                Email
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="you@youremail.com"
                                            />
                                        </label>
                                        <label>
                                            <div className="input-label">
                                                Password
                                            </div>
                                            <input
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </label>
                                        <button
                                            className="button"
                                            type="submit"
                                        >
                                            Sign Up
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && <Modal content={modalContent} />}
        </div>
    )
}

export default Login
