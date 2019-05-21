import React, { useState, useEffect, useRef, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import FileUploader from 'react-firebase-file-uploader'
import { format } from 'date-fns'
import { login, logout, signup } from '../../utils/user'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import Swatch from '../Swatch'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import './Account.scss'

// console.log('db', db)

const Account = ({
    onSubmit,
    history,
    handleFavorites,
    removeFavorite,
    favorites,
    paletteWasSaved
}) => {
    const { initialising, user } = useAuthState(firebase.auth())
    const [currentUser, setCurrentUser] = useState()
    const [tab1Active, setTab1Active] = useState(true)
    const [avatar, setAvatar] = useState()
    const [avatarURL, setAvatarURL] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    // const [userName, setUserName] = useState()
    const [profileUpdated, setProfileUpdated] = useState(false)
    // const [filename, setFilename] = useState()
    const [paletteRemoved, setPaletteRemoved] = useState(false)

    // console.log('paletteWasSaved', paletteWasSaved)

    const inputEl = useRef(null)

    const handleLogin = async event => {
        event.preventDefault()
        const { email, password } = event.target.elements
        login(email.value, password.value)
    }
    const handleLogout = () => {
        logout()
    }

    useEffect(() => {
        if (user) {
            var userRef = db.collection('users').doc(user.uid)

            userRef.get().then(function(doc) {
                if (doc.exists) {
                    // console.log('Document data:', doc.data())

                    setCurrentUser(doc.data())
                }
            })
        }
    }, [user, profileUpdated, paletteWasSaved, paletteRemoved])

    const handleUploadStart = () => {
        setIsUploading(true)
        setProgress(0)
    }

    const handleUploadError = error => {
        setIsUploading(false)
        console.error(error)
    }

    const handleProgress = progress => {
        setProgress(progress)
    }

    const handleUploadSuccess = filename => {
        //   this.setState({ avatar: filename, progress: 100, isUploading: false });
        setAvatar(filename)
        setProgress(100)
        setIsUploading(false)
        // handleSubmit(inputEl)
        firebase
            .storage()
            .ref('avatars')
            .child(filename)
            .getDownloadURL()
            .then(url => {
                setAvatarURL(url)
                updateUserProfile(currentUser.displayName, url)
            })
    }

    // const handleSubmit = inputEl => {
    //     console.log(inputEl)
    // }

    // console.log('currentUser', currentUser && currentUser)

    const handleSignUp = async event => {
        event.preventDefault()
        const { email, password, username } = event.target.elements

        const date = format(Date.now(), 'YYYY-MM-dd', {
            awareOfUnicodeTokens: true
        })

        // eslint-disable-next-line
        const newUser = signup({
            email: email.value,
            password: password.value,
            displayName: username.value,
            startDate: date
        })
    }

    const updateUserProfile = (displayName, url) => {
        setProfileUpdated(false)
        let activeUser = firebase.auth().currentUser

        // console.log('activeUser', displayName, activeUser, url)

        activeUser
            .updateProfile({
                displayName: displayName,
                photoURL: url
            })
            .then(function() {
                setProfileUpdated(true)

                setTimeout(() => {
                    setProfileUpdated(false)
                }, 4000)

                db.doc(`users/${user.uid}`).update({
                    displayName: displayName,
                    photoURL: url
                })
            })
            .catch(function(error) {
                console.log(error)
            })
    }

    const handleTabs = () => {
        setTab1Active(!tab1Active)
    }

    const deletePalette = paletteName => {
        const userPalettes = currentUser.palettes

        const newPalettes = userPalettes.filter(
            palette => palette.name !== paletteName
        )

        var userRef = db.collection('users').doc(user.uid)
        userRef.update({
            palettes: newPalettes
        })

        setPaletteRemoved(true)
    }

    if (initialising) {
        return (
            <div className="page-account">
                <p>Loading...</p>
            </div>
        )
    }
    if (user) {
        return (
            <div className="page-account">
                <div className="user-info">
                    <h2>
                        Welcome,{' '}
                        <strong>{user.displayName && user.displayName}</strong>!
                    </h2>
                    {currentUser ? (
                        <div className="user-avatar">
                            <div className="avatar">
                                <img
                                    src={
                                        currentUser ? currentUser.photoURL : ''
                                    }
                                    alt="user avatar"
                                />
                            </div>

                            <div className="file-uploader">
                                <p>
                                    To change your avatar, upload a new image:
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
                                {profileUpdated ? (
                                    <div className="profile-updated">
                                        <p>Your avatar has been updated!</p>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    ) : (
                        <span>Loading...</span>
                    )}
                    <div className="start-date">
                        <strong>Account created:</strong>{' '}
                        {currentUser && currentUser.startDate}
                    </div>
                </div>
                <button onClick={handleLogout}>Log out</button>
                <div className="user-palettes">
                    {currentUser && currentUser.palettes && (
                        <h3>Saved Palettes</h3>
                    )}
                    <div className="nostyle palettes-list">
                        {currentUser &&
                            currentUser.palettes.map(palette => {
                                return (
                                    <div
                                        className="palette-wrap"
                                        key={palette.date.seconds}
                                    >
                                        <div className="palette-title-bar">
                                            <div className="palette-name">
                                                {palette.name && palette.name}
                                            </div>
                                            <FavoritesPDF
                                                favorites={
                                                    palette.palette &&
                                                    palette.palette
                                                }
                                                paletteName={
                                                    palette.name && palette.name
                                                }
                                            />
                                        </div>

                                        <ul className="user-palette nostyle">
                                            {palette.palette.map(
                                                (color, index) => {
                                                    return (
                                                        <Swatch
                                                            key={
                                                                palette.date
                                                                    .seconds +
                                                                color.hex
                                                            }
                                                            color={color}
                                                            index={index}
                                                            handleFavorites={
                                                                handleFavorites
                                                            }
                                                            removeFavorite={
                                                                removeFavorite
                                                            }
                                                            favorites={
                                                                favorites
                                                            }
                                                            // isFavorite={isFavorite ? true : false}
                                                        />
                                                    )
                                                }
                                            )}
                                        </ul>
                                        <div className="palette-utilities">
                                            <div className="delete-palette">
                                                <span
                                                    className="palette-delete"
                                                    onClick={() =>
                                                        deletePalette(
                                                            palette.name
                                                        )
                                                    }
                                                >
                                                    <TimesCircle
                                                        style={{
                                                            color: '#f35336'
                                                        }}
                                                    />
                                                    <span className="clear-text">
                                                        Delete
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-account">
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
                                    <form onSubmit={handleLogin}>
                                        <label>
                                            Email
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                            />
                                        </label>
                                        <label>
                                            Password
                                            <input
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </label>
                                        <button type="submit">Log In</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`tab2 tab ${
                                tab1Active ? 'inactive' : 'active'
                            }`}
                        >
                            <div className="login-form">
                                <div className="tab-content">
                                    <form onSubmit={handleSignUp}>
                                        <label>
                                            Username
                                            <input
                                                name="username"
                                                type="text"
                                                placeholder="Username (no spaces or special characters)"
                                            />
                                        </label>
                                        <label>
                                            Email
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                            />
                                        </label>
                                        <label>
                                            Password
                                            <input
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </label>
                                        <button type="submit">Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withRouter(Account)
