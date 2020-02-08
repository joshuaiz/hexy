import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import ScrollToTop from '../ScrollToTop'
import { getParameterByName } from '../../utils/helpers'
import './AccountHandler.scss'

const AccountHandler = ({ location, history }) => {
    const [emailVerified, setEmailVerified] = useState(false)
    const [verificationError, setVerificationError] = useState()
    const [updatedPassword, setUpdatedPassword] = useState('')
    const [passwordReset, setPasswordReset] = useState(false)
    const { user } = useAuthState(firebase.auth())

    var auth = firebase.auth()

    let accountEmail

    if (!location.search || location.search === '') {
        history.push('/account')
    }

    // Get the action to complete.
    var mode = getParameterByName('mode')
    // Get the one-time code from the query parameter.
    var actionCode = getParameterByName('oobCode')
    // (Optional) Get the continue URL from the query parameter if available.
    var continueUrl = getParameterByName('continueUrl')
    // (Optional) Get the language code if available.
    var lang = getParameterByName('lang') || 'en'

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://www.gstatic.com/firebasejs/6.4.0/firebase.js'
        script.async = true
        script.onload = () => scriptLoaded()

        document.body.appendChild(script)
    }, [])

    const scriptLoaded = () => {
        // Configure the Firebase SDK.
        // This is the minimum configuration required for the API to be used.
        // var config = {
        //     apiKey: process.env.API_KEY
        // }

        // Handle the user management action.
        switch (mode) {
            case 'resetPassword':
                // Display reset password handler and UI.
                handleResetPassword(auth, actionCode, continueUrl, lang)
                break
            case 'recoverEmail':
                // Display email recovery handler and UI.
                handleRecoverEmail(auth, actionCode, lang)
                break
            case 'verifyEmail':
                // Display email verification handler and UI.
                handleVerifyEmail(auth, actionCode, continueUrl, lang)
                break
            default:
            // Error: invalid mode.
        }
    }

    function handleResetPassword(auth, actionCode, continueUrl, lang) {
        // Localize the UI to the selected language as determined by the lang
        // parameter.

        // Verify the password reset code is valid.
        auth.verifyPasswordResetCode(actionCode)
            .then(function(email) {
                accountEmail = email

                // TODO: Show the reset screen with the user's email and ask the user for
                // the new password.

                // // Save the new password.
                // auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
                //   // Password reset has been confirmed and new password updated.

                //   // TODO: Display a link back to the app, or sign-in the user directly
                //   // if the page belongs to the same domain as the app:
                //   auth.signInWithEmailAndPassword(accountEmail, newPassword);

                //   // TODO: If a continue URL is available, display a button which on
                //   // click redirects the user back to the app via continueUrl with
                //   // additional state determined from that URL's parameters.
                // }).catch(function(error) {
                //   // Error occurred during confirmation. The code might have expired or the
                //   // password is too weak.
                // });
            })
            .catch(function(error) {
                // Invalid or expired action code. Ask user to try to reset the password
                // again.
                console.log('Password could not be reset.', error)
            })
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (!updatedPassword) {
            alert('Please enter a new password.')
            return
        }

        auth.verifyPasswordResetCode(actionCode)
            .then(function(email) {
                accountEmail = email

                // TODO: Show the reset screen with the user's email and ask the user for
                // the new password.

                // // Save the new password.
                auth.confirmPasswordReset(actionCode, updatedPassword)
                    .then(function(resp) {
                        // Password reset has been confirmed and new password updated.
                        setPasswordReset(true)
                        // TODO: Display a link back to the app, or sign-in the user directly
                        // if the page belongs to the same domain as the app:
                        auth.signInWithEmailAndPassword(
                            accountEmail,
                            updatedPassword
                        )
                            .then(function(resp) {})
                            .catch(function(error) {})

                        // TODO: If a continue URL is available, display a button which on
                        // click redirects the user back to the app via continueUrl with
                        // additional state determined from that URL's parameters.
                    })
                    .catch(function(error) {
                        // Error occurred during confirmation. The code might have expired or the
                        // password is too weak.
                    })
            })
            .catch(function(error) {
                // Invalid or expired action code. Ask user to try to reset the password
                // again.
                console.log('Password could not be reset.', error)
            })

        // // Save the new password.
        // auth.confirmPasswordReset(actionCode, updatedPassword).then(function(resp) {
        //     // Password reset has been confirmed and new password updated.

        //     // TODO: Display a link back to the app, or sign-in the user directly
        //     // if the page belongs to the same domain as the app:
        //     auth.signInWithEmailAndPassword(accountEmail, updatedPassword);

        //     // TODO: If a continue URL is available, display a button which on
        //     // click redirects the user back to the app via continueUrl with
        //     // additional state determined from that URL's parameters.
        //   }).catch(function(error) {
        //     // Error occurred during confirmation. The code might have expired or the
        //     // password is too weak.
        //   });
    }

    function handleRecoverEmail(auth, actionCode, lang) {
        //   // Localize the UI to the selected language as determined by the lang
        //   // parameter.
        //   var restoredEmail = null;
        //   // Confirm the action code is valid.
        //   auth.checkActionCode(actionCode).then(function(info) {
        //     // Get the restored email address.
        //     restoredEmail = info['data']['email'];
        //     // Revert to the old email.
        //     return auth.applyActionCode(actionCode);
        //   }).then(function() {
        //     // Account email reverted to restoredEmail
        //     // TODO: Display a confirmation message to the user.
        //     // You might also want to give the user the option to reset their password
        //     // in case the account was compromised:
        //     auth.sendPasswordResetEmail(restoredEmail).then(function() {
        //       // Password reset confirmation sent. Ask user to check their email.
        //     }).catch(function(error) {
        //       // Error encountered while sending password reset code.
        //     });
        //   }).catch(function(error) {
        //     // Invalid code.
        //   });
    }

    function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
        // Localize the UI to the selected language as determined by the lang
        // parameter.
        // Try to apply the email verification code.
        auth.applyActionCode(actionCode)
            .then(function(resp) {
                // Email address has been verified.
                console.log('Email has been verified')

                setEmailVerified(true)

                // TODO: Display a confirmation message to the user.
                // You could also provide the user with a link back to the app.

                // TODO: If a continue URL is available, display a button which on
                // click redirects the user back to the app via continueUrl with
                // additional state determined from that URL's parameters.
            })
            .catch(function(error) {
                // Code is invalid or expired. Ask the user to verify their email address
                // again.
                console.log(error)
                setVerificationError(true)
            })
    }

    const resendVerificationEmail = () => {
        var thisUser = firebase.auth().currentUser

        thisUser
            .sendEmailVerification()
            .then(function() {
                // Email sent.
                console.log('Verification email sent')
            })
            .catch(function(error) {
                // An error happened.
                console.log('Could not send verification email')
            })
    }

    return (
        <div className="account-handler">
            <ScrollToTop />
            <h1>Hexy Accounts</h1>
            {mode === 'verifyEmail' && (
                <div className="verify-email account-section">
                    {emailVerified ? (
                        <div className="email-verified">
                            <h3>Success!</h3>
                            <p>Your email has been verified.</p>
                            <button className="button">
                                <Link to="/account">
                                    Go to your Account page
                                </Link>
                            </button>
                        </div>
                    ) : (
                        <div className="email-unverified">
                            <h3>Verifying...</h3>
                            {verificationError && (
                                <div className="verification-error">
                                    <p>
                                        Sorry, your email could not be verified.
                                    </p>
                                    {user && user ? (
                                        <button
                                            className="button"
                                            onClick={resendVerificationEmail}
                                        >
                                            Resend Verification Email
                                        </button>
                                    ) : (
                                        <Link to="/account">
                                            Log in to re-verify your email
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {mode === 'resetPassword' && (
                <div className="reset-password account-section">
                    {!passwordReset ? (
                        <div className="new-password">
                            <h3>Please reset your password.</h3>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    New password:
                                    <input
                                        type="password"
                                        value={updatedPassword}
                                        onChange={e =>
                                            setUpdatedPassword(e.target.value)
                                        }
                                    />
                                </label>
                                <input
                                    type="submit"
                                    className="button"
                                    value="Reset Password"
                                />
                            </form>
                        </div>
                    ) : (
                        <div className="password-reset account-section">
                            <h3>Your password has been reset!</h3>
                            {!user ? (
                                <p>
                                    If you're not logged in automatically,
                                    please <Link to="/account">log in</Link>{' '}
                                    again with your new password.
                                </p>
                            ) : (
                                <h3>
                                    Go to your{' '}
                                    <Link to="/account">account</Link>.
                                </h3>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default withRouter(AccountHandler)
