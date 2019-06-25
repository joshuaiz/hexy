import React, { useState, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import './ResetPassword.scss'

const ResetPassword = ({ history }) => {
    const { user } = useAuthState(firebase.auth())
    const [input, setInput] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [error, setError] = useState(false)

    const checkEmail = (e) => {
        e.preventDefault()
        const email = input
        // console.log(email)
        firebase.auth().fetchSignInMethodsForEmail(email).then((methods) => {
            if (methods && methods.length) {
                console.log('checkEmail: email exists')
                setIsValid(true)
                updatePassword(input)
            } else {
                console.log('checkEmail: email does not exist')
            }
       });

    }

    const updatePassword = (input) => {
        let auth = firebase.auth();
        let emailAddress = input;

        auth.sendPasswordResetEmail(emailAddress).then(function() {
            // Email sent.
            console.log('email sent')
            setEmailSent(true)
            setTimeout(() => {
                history.push('/account')
            }, 5000);
            
        }).catch(function(error) {
            setError(true)
        });
    }

    return (
        <div className="reset-password">
            <div className="reset-password-inner">
                <h1 className="page-title">Reset Password</h1>
                {!emailSent && 
                <Fragment>
                <form
                    className="reset-password-form"
                    onSubmit={checkEmail}
                >
                    <label>
                        <div className="input-label">
                            Enter your account email:
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@youremail.com"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                    </label>
                    <button
                        className="button"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <div className="alt-actions">
                    <Link to="/account">Log in/Sign Up</Link>
                </div>
                </Fragment>
                }
                {emailSent && (
                    <div className="email-sent">
                        <h3>Password reset email sent to: {input}.</h3>
                        <p>You will be redirected to the <Link to="/account">Account</Link> page.</p>
                    </div>
                )}
                {error && (
                    <div className="email-error">
                        <h3>Sorry, an error occurred when sending to: {input}.</h3>
                        <p>Please try again.</p>
                    </div>
                )}
            </div>
        </div>
    )
}


export default withRouter(ResetPassword)
