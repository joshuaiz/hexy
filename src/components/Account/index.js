import React, { useState, useEffect, useRef } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import Toggle from 'react-toggle'
import FileUploader from 'react-firebase-file-uploader'
import { humanize, getExpirationDate } from '../../utils/helpers'
import { logout } from '../../utils/user'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import Swatch from '../Swatch'
import Login from '../Login'
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
    const [avatar, setAvatar] = useState()
    const [avatarURL, setAvatarURL] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    // const [userPalettes, setUserPalettes] = useState([])
    const [swatchInfo, setSwatchInfo] = useState(true)
    const [profileUpdated, setProfileUpdated] = useState(false)
    const [paletteRemoved, setPaletteRemoved] = useState(false)

    const inputEl = useRef(null)

    useEffect(() => {
        // used to cancel async fetch on unmount
        // see here: https://github.com/facebook/react/issues/14326
        let didCancel = false

        if (user) {
            var userRef = db.collection('users').doc(user.uid)

            userRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        console.log('Document data:', doc.data())

                        setCurrentUser(doc.data())
                    }
                })
                .catch(err => {
                    console.log('Error getting documents', err)
                })
        }
        return () => {
            didCancel = true
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

    const handleToggle = () => {
        setSwatchInfo(!swatchInfo)
    }

    const handleLogout = () => {
        logout()
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

                                <div className="file-uploader">
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
                                    {profileUpdated ? (
                                        <div className="profile-updated">
                                            <p>Your avatar has been updated!</p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                            <div className="user-meta">
                                <h3>Hexy Account:</h3>
                                <div className="start-date">
                                    <strong>Account created:</strong>{' '}
                                    {currentUser && currentUser.startDate}
                                </div>
                                <div className="account-level">
                                    <strong>Account Level:</strong>{' '}
                                    {currentUser &&
                                        humanize(currentUser.accountType)}
                                </div>
                                <div className="account-expiration">
                                    <strong>Valid Until:</strong>{' '}
                                    {currentUser &&
                                    currentUser.accountType !== 'pro_lifetime'
                                        ? getExpirationDate(
                                              currentUser.accountStartDate
                                          )
                                        : 'Forever'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span>Loading...</span>
                    )}
                    <button onClick={handleLogout}>Log out</button>
                </div>

                <div className="user-palettes">
                    <div className="user-palettes-header">
                        {currentUser && currentUser.palettes ? (
                            <h3>
                                Saved Palettes ({currentUser.palettes.length})
                            </h3>
                        )
                        : <p>You don't have any saved palettes. <Link to="/colors">Find colors &rarr;</Link></p>
                        }
                        <div className="feed-toggle">
                            <label>
                                <Toggle
                                    defaultChecked={!swatchInfo}
                                    icons={false}
                                    onChange={handleToggle}
                                />
                                <span>
                                    {swatchInfo ? 'Show' : 'Hide'} swatch info
                                </span>
                            </label>
                        </div>
                    </div>

                    <div
                        className={`nostyle palettes-list ${
                            swatchInfo ? 'no-info' : 'info'
                        }`}
                    >
                        {currentUser &&
                            currentUser.palettes && currentUser.palettes.length
                                .slice(0)
                                .reverse()
                                .map(palette => {
                                    return (
                                        <div
                                            className="palette-wrap"
                                            key={palette.date.seconds}
                                        >
                                            <div className="palette-title-bar">
                                                <div className="palette-name">
                                                    {palette.name &&
                                                        palette.name}
                                                </div>
                                                <FavoritesPDF
                                                    favorites={
                                                        palette.palette &&
                                                        palette.palette
                                                    }
                                                    paletteName={
                                                        palette.name &&
                                                        palette.name
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
            <div className="not-logged-in">
                <h2>Please Log In or Sign Up</h2>
                <Login />
            </div>
        </div>
    )
}

export default withRouter(Account)
