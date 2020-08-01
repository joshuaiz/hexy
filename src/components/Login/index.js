import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { format } from 'date-fns'
import { setLocalStorage } from '../../utils/helpers'
import { login, signup } from '../../utils/user'
import Modali, { useModali } from 'modali'
import ScrollToTop from '../ScrollToTop'

const Login = ({ setProfileUpdated, history, location }) => {
    const { user } = useAuthState(firebase.auth())
    const [tab1Active, setTab1Active] = useState(
        location.search === '?action=signup' ? false : true
    )
    const [error, setError] = useState()
    const [modalContent, setModalContent] = useState()
    const [loginErrorModal, toggleLoginErrorModal] = useModali()

    // console.log('Login location', location.search)

    const handleLogin = async (event) => {
        console.log('handleLogin called')
        event.preventDefault()
        const { email, password } = event.target.elements
        login(email.value, password.value).catch((error) => {
            console.log(error)
            setError(error)
            setModalContent(() => {
                return <div className="error-message">{error.message}</div>
            })
            toggleLoginErrorModal(true)
        })
    }

    const handleTabs = () => {
        setTab1Active(!tab1Active)
    }

    const handleSignUp = async (event) => {
        toggleLoginErrorModal(false)
        event.preventDefault()
        const { email, password, username } = event.target.elements

        const date = format(Date.now(), 'yyyy-MM-dd', {
            awareOfUnicodeTokens: true,
        })

        signup({
            email: email.value,
            password: password.value,
            displayName: username.value,
            startDate: date,
        })
            .then(
                setTimeout(() => {
                    setProfileUpdated(true)
                }, 2000),
                setLocalStorage('hexy_user', null),
                toggleLoginErrorModal(false)
            )
            .catch((error) => {
                // console.log(error)
                setError(error)
                setModalContent(() => {
                    return <div className="error-message">{error.message}</div>
                })
                toggleLoginErrorModal(true)
            })
    }

    return (
        <div className="login-tabs">
            <ScrollToTop />
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
                                <Link to="/reset-password">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <div
                            className={`tab2 tab ${
                                tab1Active ? 'inactive' : 'active'
                            }`}
                        >
                            <div className="login-form">
                                <div className="tab-content">
                                    {history.location.pathname !==
                                        '/checkout' && (
                                        <p>
                                            A Standard Hexy Account is free and
                                            allows you to save up to 5 colors at
                                            a time and up to 5 palettes to your
                                            profile. To unlock more colors,
                                            palettes, and additional saving and
                                            sharing features, get a{' '}
                                            <Link to="/pro">Hexy Pro</Link>{' '}
                                            account.
                                        </p>
                                    )}

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
                                    {history.location.pathname !==
                                        '/checkout' && (
                                        <p className="more-link">
                                            Need more than 5 colors at a
                                            time?&nbsp;
                                            <Link to="/pro">Go Pro &rarr;</Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <Modali.Modal
                    animated={true}
                    centered={true}
                    {...loginErrorModal}
                >
                    {modalContent}
                </Modali.Modal>
            )}
        </div>
    )
}

export default withRouter(Login)
