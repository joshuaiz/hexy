import React, { useState, useEffect, useRef, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import Modali, { useModali } from 'modali'
import Toggle from 'react-toggle'
import FileUploader from 'react-firebase-file-uploader'
import { login, logout } from '../../utils/user'
import Login from '../Login'
import UserMeta from './UserMeta'
import UserPalettes from './UserPalettes'
import UpdateProfile from './UpdateProfile'
import './Account.scss'

const Account = React.memo(
    ({
        currentUser,
        onSubmit,
        location,
        paletteWasSaved,
        paletteExported,
        setPaletteExported,
        profileUpdated,
        setProfileUpdated,
    }) => {
        const [user, loading, error] = useAuthState(firebase.auth())
        const [active, setActive] = useState({
            viewInfo: true,
            changeAvatar: false,
            updateProfile: false,
        })
        const [avatar, setAvatar] = useState()
        const [isUploading, setIsUploading] = useState(false)
        const [progress, setProgress] = useState(0)
        const [swatchInfo, setSwatchInfo] = useState(true)
        const [avatarUpdated, setAvatarUpdated] = useState(false)
        const [paletteRemoved, setPaletteRemoved] = useState(false)
        const [showUpdate, setShowUpdate] = useState(false)
        const [updateError, setUpdateError] = useState()
        const [usernameError, setUsernameError] = useState()
        const [authSuccess, setAuthSuccess] = useState()
        const [updating, setUpdating] = useState()
        const [emailSent, setEmailSent] = useState(false)

        const [loginModal, toggleLoginModal] = useModali()

        const inputEl = useRef(null)
        const form = useRef(null)

        let emailVerified

        if (user != null) {
            emailVerified = user.emailVerified
        }

        // console.log(user && emailVerified)

        const handleActions = (action) => {
            console.log('handleActions', action)
            console.log('clicked')
            if (action === 'viewInfo') {
                setActive({
                    viewInfo: true,
                    changeAvatar: false,
                    updateProfile: false,
                })
            } else if (action === 'changeAvatar') {
                setActive({
                    viewInfo: false,
                    changeAvatar: true,
                    updateProfile: false,
                })
            } else if (action === 'updateProfile') {
                setActive({
                    viewInfo: false,
                    changeAvatar: false,
                    updateProfile: true,
                })
                // setShowUpdate(!showUpdate)
            } else if (action === 'close') {
                setActive({
                    viewInfo: true,
                    changeAvatar: false,
                    updateProfile: false,
                })
            }
        }

        const handleUploadStart = () => {
            setIsUploading(true)
            setProgress(0)
        }

        const handleUploadError = (error) => {
            setIsUploading(false)
            console.error(error)
        }

        const handleProgress = (progress) => {
            setProgress(progress)
        }

        const handleUploadSuccess = (filename) => {
            setAvatar(filename)
            setProgress(100)
            setIsUploading(false)
            firebase
                .storage()
                .ref('avatars')
                .child(filename)
                .getDownloadURL()
                .then((url) => {
                    updateUserProfile(currentUser.displayName, url)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }

        const updateUserProfile = (displayName, url) => {
            setAvatarUpdated(false)
            let activeUser = firebase.auth().user

            // console.log('activeUser', displayName, activeUser, url)

            activeUser
                .updateProfile({
                    displayName: displayName,
                    photoURL: url,
                })
                .then(function () {
                    setAvatarUpdated(true)
                    setProfileUpdated(true)
                    setTimeout(() => {
                        setAvatarUpdated(false)
                    }, 4000)

                    db.doc(`users/${user.uid}`).update({
                        displayName: displayName,
                        photoURL: url,
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        }

        const deletePalette = (paletteName) => {
            const userPalettes = currentUser.palettes

            const newPalettes = userPalettes.filter(
                (palette) => palette.name !== paletteName
            )

            var userRef = db.collection('users').doc(user.uid)
            userRef.update({
                palettes: newPalettes,
            })

            setPaletteRemoved(true)
        }

        const handleToggle = () => {
            setSwatchInfo(!swatchInfo)
        }

        const handleLogout = () => {
            logout()
            localStorage.removeItem('hexy_user')
        }

        const handleUpdate = (event) => {
            event.preventDefault()
            const { username, email, password } = event.target.elements

            console.log(email.value, password.value, username.value)

            setProfileUpdated(false)
            let activeUser = firebase.auth().user

            if (username.value) {
                const re = /^\w+$/
                if (re.test(username.value)) {
                    activeUser
                        .updateProfile({
                            displayName: username.value,
                        })
                        .then(function () {
                            setProfileUpdated(true)

                            db.doc(`users/${user.uid}`).update({
                                displayName: username.value,
                            })
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                } else {
                    const validationError =
                        'Usernames may only contain letters, numbers and underscores. Please try with a different username.'
                    setUsernameError(validationError)
                }
            }

            if (email.value) {
                activeUser
                    .updateEmail(email.value)
                    .then(function () {
                        setProfileUpdated(true)
                    })
                    .then(function () {
                        db.doc(`users/${user.uid}`).update({
                            email: email.value,
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                        setUpdateError(true)
                        toggleLoginModal(true)
                    })
            }

            if (password.value) {
                activeUser
                    .updatePassword(password.value)
                    .then(function () {
                        setProfileUpdated(true)
                    })
                    .catch(function (error) {
                        console.log(error)
                        setUpdateError(true)
                        toggleLoginModal(true)
                    })
            }
        }

        useEffect(() => {
            if (profileUpdated) {
                // console.log(profileUpdated)
                if (form && form.current) {
                    form.current.reset()
                }
                setShowUpdate(false)
                setTimeout(() => {
                    setProfileUpdated(false)
                    // console.log(form)
                }, 4000)
            }
        }, [profileUpdated, setProfileUpdated])

        const handleLogin = async (event) => {
            setAuthSuccess(false)
            setUpdating(true)
            event.preventDefault()
            // toggleLoginModal(false)
            const { email, password } = event.target.elements
            login(email.value, password.value)
                .then(
                    setUpdating(false),
                    setAuthSuccess(true),
                    setUpdateError(false),
                    toggleLoginModal(false)
                )
                .catch((error) => {
                    console.log(error)
                    // setLoginError(error)
                    setUpdateError(true)
                    toggleLoginModal(true)
                    // return <div className="error-message">{error.message}</div>
                })
        }

        const verifyEmail = () => {
            var thisUser = firebase.auth().currentUser

            thisUser
                .sendEmailVerification()
                .then(function () {
                    // Email sent.
                    console.log('Verification email sent')
                    setEmailSent(true)
                    setTimeout(() => {
                        setEmailSent(false)
                    }, 5000)
                })
                .catch(function (error) {
                    // An error happened.
                    console.log('Could not send verification email')
                })
        }

        // useEffect(() => {
        //     getFavorites()
        // }, [favorites, getFavorites])

        if (loading) {
            return (
                <div className="page-account">
                    <div className="loading">Loading...</div>
                </div>
            )
        }
        if (user) {
            return (
                <div className="page-account">
                    <div className="user-info">
                        <h2>
                            Welcome,{' '}
                            <strong>
                                {(user.displayName && user.displayName) ||
                                    (currentUser && currentUser.displayName)}
                            </strong>
                            !
                        </h2>
                        {!emailVerified && (
                            <div className="unverified">
                                <h3>
                                    Please verify your email to continue using
                                    Hexy.
                                </h3>
                                <p>
                                    If you didn't receive a verification email,
                                    click the 'Verify Email' button below to
                                    send a new one. Click the verfication link
                                    in the email to fully activate your Hexy
                                    account.
                                </p>
                            </div>
                        )}
                        {user ? (
                            <div className="user-content-wrap">
                                <div className="user-avatar">
                                    <div className="avatar">
                                        <img
                                            src={
                                                currentUser
                                                    ? currentUser.photoURL
                                                    : ''
                                            }
                                            alt="user avatar"
                                        />
                                    </div>
                                </div>
                                <div className="user-actions">
                                    <ul className="nostyle user-action-list">
                                        {user && !emailVerified && (
                                            <li className="verify-email">
                                                <span onClick={verifyEmail}>
                                                    Verify Email
                                                </span>
                                                {emailSent && (
                                                    <p>
                                                        Verification email sent.
                                                        Please check your inbox
                                                        and click the link to
                                                        verify your email.
                                                    </p>
                                                )}
                                            </li>
                                        )}
                                        {emailVerified && (
                                            <Fragment>
                                                <li
                                                    className={`${
                                                        active.viewInfo
                                                            ? 'current'
                                                            : ''
                                                    }`}
                                                >
                                                    <span
                                                        onClick={() =>
                                                            handleActions(
                                                                'viewInfo'
                                                            )
                                                        }
                                                    >
                                                        View account info
                                                    </span>
                                                </li>
                                                <li
                                                    className={`${
                                                        active.changeAvatar
                                                            ? 'current'
                                                            : ''
                                                    }`}
                                                >
                                                    <span
                                                        onClick={() =>
                                                            handleActions(
                                                                'changeAvatar'
                                                            )
                                                        }
                                                    >
                                                        Change avatar
                                                    </span>
                                                </li>
                                                <li
                                                    className={`${
                                                        active.updateProfile
                                                            ? 'current'
                                                            : ''
                                                    }`}
                                                >
                                                    <span
                                                        onClick={() =>
                                                            handleActions(
                                                                'updateProfile'
                                                            )
                                                        }
                                                    >
                                                        Update profile
                                                    </span>
                                                </li>
                                            </Fragment>
                                        )}

                                        <li>
                                            <span onClick={handleLogout}>
                                                Log Out
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div
                                    className={`file-uploader ${
                                        active.changeAvatar
                                            ? 'active'
                                            : 'inactive'
                                    }`}
                                >
                                    <p>
                                        To change your avatar, upload a new
                                        image:
                                    </p>
                                    {isUploading && <p>Progress: {progress}</p>}

                                    <FileUploader
                                        className="uploader"
                                        accept="image/*"
                                        name="avatar"
                                        ref={inputEl}
                                        randomizeFilename
                                        storageRef={firebase
                                            .storage()
                                            .ref('avatars')}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                    />
                                    {avatarUpdated ? (
                                        <div className="profile-updated">
                                            <p>Your avatar has been updated!</p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <UserMeta
                                    currentUser={currentUser}
                                    active={active.viewInfo}
                                />
                                <div
                                    className={`update-profile-outer ${
                                        active.updateProfile
                                            ? 'active'
                                            : 'inactive'
                                    }`}
                                >
                                    {authSuccess && (
                                        <div className="auth-success">
                                            Authenticated successfully...please
                                            update your profile below.
                                        </div>
                                    )}

                                    <UpdateProfile
                                        handleUpdate={handleUpdate}
                                        active={active.updateProfile}
                                        setActive={setActive}
                                        setRef={form}
                                        usernameError={usernameError}
                                    />

                                    {updateError && (
                                        <Modali.Modal
                                            {...loginModal}
                                            animated={true}
                                            centered={true}
                                        >
                                            <div className="login-form update-login">
                                                <h3>
                                                    To update your profile,
                                                    please log in again:
                                                </h3>
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
                                                        disabled={updating}
                                                    >
                                                        {updating
                                                            ? 'Logging you in'
                                                            : 'Log In'}
                                                    </button>
                                                </form>
                                            </div>
                                        </Modali.Modal>
                                    )}

                                    {profileUpdated ? (
                                        <div className="profile-updated">
                                            <p>
                                                Your profile has been updated!
                                            </p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </div>

                    <div className="user-palettes">
                        {user && emailVerified && (
                            <Fragment>
                                <div className="user-palettes-header">
                                    {currentUser &&
                                    currentUser.palettes &&
                                    currentUser.palettes.length > 0 ? (
                                        <h3>
                                            Saved Palettes (
                                            {currentUser.palettes.length})
                                        </h3>
                                    ) : (
                                        <p>
                                            You don't have any saved palettes.
                                            Use the{' '}
                                            <strong>Save Palette</strong>{' '}
                                            feature in the Favorites sidebar to
                                            save your current palette or{' '}
                                            <Link to="/colors">
                                                find more colors &rarr;
                                            </Link>
                                        </p>
                                    )}
                                    {currentUser &&
                                        currentUser.palettes &&
                                        currentUser.palettes.length > 0 && (
                                            <div className="feed-toggle">
                                                <label>
                                                    <Toggle
                                                        defaultChecked={
                                                            !swatchInfo
                                                        }
                                                        icons={false}
                                                        onChange={handleToggle}
                                                    />
                                                    <span>
                                                        {swatchInfo
                                                            ? 'Show'
                                                            : 'Hide'}{' '}
                                                        swatch info
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                </div>

                                <UserPalettes
                                    swatchInfo={swatchInfo}
                                    currentUser={currentUser}
                                    deletePalette={deletePalette}
                                    paletteExported={paletteExported}
                                    setPaletteExported={setPaletteExported}
                                />
                            </Fragment>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div className="page-account">
                <div className="not-logged-in">
                    <h2>
                        {location.search === '?action=signup'
                            ? 'Get a free Hexy Account'
                            : 'Please Log In or Sign Up'}
                    </h2>
                    <Login setProfileUpdated={setProfileUpdated} />
                </div>
            </div>
        )
    }
)

// Account.whyDidYouRender = true

export default withRouter(Account)
