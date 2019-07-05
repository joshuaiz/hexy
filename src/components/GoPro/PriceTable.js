import React, { useState, useEffect } from 'react'
import Modali, { useModali } from 'modali'
import { withRouter } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'

const PriceTable = ({ cart, addToCart, history }) => {
    const { user } = useAuthState(firebase.auth())
    const [currentUser, setCurrentUser] = useState()
    const [accountType, setAccountType] = useState()
    const [modal, toggleModal] = useModali()

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
                        // console.log('Document data:', doc.data())

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
    }, [user])

    const triggerModal = account => {
        toggleModal(true)
        setAccountType(account)
    }

    const handleClick = () => {
        toggleModal(false)
        setTimeout(() => {
            history.push('/checkout')
        }, 1000)
    }

    window.onbeforeunload = () => {
        toggleModal(false)
    }

    return (
        <div className="price-table">
            <ul className="nostyle account-list">
                <li className="account-free">
                    <div className="account-title">
                        <h2>Free</h2>
                    </div>
                    <div className="account-features">
                        <div className="account-meta">
                            <div className="account-price">$0.00</div>
                            <div className="account-license">no license</div>
                        </div>

                        <ul className="nostyle features-list">
                            <li>browse named colors</li>
                            <li>add favorites</li>
                            <li>export favorites to PDF</li>
                            <li>view public palettes</li>
                            <li>add up to 5 favorites at a time</li>
                            <li>community support</li>
                        </ul>
                    </div>

                    <div className="signup">
                        <button
                            className="button"
                            onClick={() => {
                                addToCart('standard', 0)
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                </li>
                <li className="account-pro">
                    <div className="account-title">
                        <h2>Pro</h2>
                    </div>
                    <div className="account-features">
                        <div className="account-meta">
                            <div className="account-price">$19.00/year</div>
                            <div className="account-payment">paid yearly</div>
                            <div className="account-license">
                                1-year license
                            </div>
                        </div>
                        <ul className="nostyle features-list">
                            <li>browse named colors</li>
                            <li>add favorites</li>
                            <li>export favorites to PDF</li>
                            <li>view public palettes</li>
                            <li>add up to 10 favorites at a time</li>
                            <li>save favorites to profile</li>
                            <li>save 50 palettes</li>
                            <li>private palettes</li>
                            <li>priority support</li>
                        </ul>
                    </div>

                    <div className="signup">
                        <button
                            className={`button ${
                                currentUser && currentUser.accountType === 'pro'
                                    ? `disabled`
                                    : null
                            }`}
                            disabled={
                                currentUser && currentUser.accountType === 'pro'
                                    ? true
                                    : null
                            }
                            onClick={() => {
                                addToCart('pro', 19)
                                triggerModal('Pro')
                            }}
                        >
                            {currentUser && currentUser.accountType === 'pro'
                                ? 'Current Account'
                                : `Get Pro!`}
                        </button>
                    </div>
                </li>
                <li className="account-pro-unlimited">
                    <div className="account-title">
                        <h2>Pro Unlimited</h2>
                    </div>
                    <div className="account-features">
                        <div className="account-meta">
                            <div className="account-price">$49.00/year</div>
                            <div className="account-payment">paid yearly</div>
                            <div className="account-license">
                                1-year license
                            </div>
                        </div>

                        <ul className="nostyle features-list">
                            <li>browse named colors</li>
                            <li>add favorites</li>
                            <li>export favorites to PDF</li>
                            <li>view public palettes</li>
                            <li>add up to 15 favorites at a time</li>
                            <li>save favorites to profile</li>
                            <li>save 100 palettes</li>
                            <li>private palettes</li>
                            <li>export palettes to scss</li>
                            <li>dedicated priority support</li>
                            <li>early access to new colors</li>
                            <li>early access to new features</li>
                        </ul>
                    </div>

                    <div className="signup">
                        <button
                            className={`button ${
                                currentUser &&
                                currentUser.accountType === 'pro_unlimited'
                                    ? `disabled`
                                    : null
                            }`}
                            disabled={
                                currentUser &&
                                currentUser.accountType === 'pro_unlimited'
                                    ? true
                                    : null
                            }
                            onClick={() => {
                                addToCart('pro_unlimited', 49)
                                triggerModal('Pro Unlimited')
                            }}
                        >
                            {currentUser &&
                            currentUser.accountType === 'pro_unlimited'
                                ? 'Current Account'
                                : `Get Pro Unlimited!`}
                        </button>
                    </div>
                </li>
                <li className="account-pro-lifetime">
                    <div className="starburst-outer">
                        <div className="starburst">
                            <span>Best Value!</span>
                        </div>
                    </div>
                    <div className="account-title">
                        <h2>Pro Lifetime</h2>
                    </div>
                    <div className="account-features">
                        <div className="account-meta">
                            <div className="account-price">$199.00</div>
                            <div className="account-info">
                                <div className="account-payment">
                                    one-time payment
                                </div>
                                <div className="account-license">
                                    lifetime license
                                </div>
                            </div>
                        </div>

                        <ul className="nostyle features-list">
                            <li>browse named colors</li>
                            <li>add favorites</li>
                            <li>export favorites to PDF</li>
                            <li>view public palettes</li>
                            <li>add up to 15 favorites at a time</li>
                            <li>save favorites to profile</li>
                            <li>save unlimited palettes</li>
                            <li>private palettes</li>
                            <li>export palettes to scss</li>
                            <li>dedicated priority support</li>
                            <li>early access to new colors</li>
                            <li>early access to new features</li>
                        </ul>
                    </div>

                    <div className="signup">
                        <button
                            className={`button ${
                                currentUser &&
                                currentUser.accountType === 'pro_lifetime'
                                    ? `disabled`
                                    : null
                            }`}
                            disabled={
                                currentUser &&
                                currentUser.accountType === 'pro_lifetime'
                                    ? true
                                    : null
                            }
                            onClick={() => {
                                addToCart('pro_lifetime', 199)
                                triggerModal('Pro Lifetime')
                            }}
                        >
                            {currentUser &&
                            currentUser.accountType === 'pro_lifetime'
                                ? 'Current Account'
                                : `Get Pro Lifetime!`}
                        </button>
                    </div>
                </li>
            </ul>
            <Modali.Modal {...modal} animated={true} centered={true}>
                <div className="price-modal">
                    <h3>Hexy {accountType} was added to your cart!</h3>
                    <p>A wonderful world of color awaits...</p>
                    <button className="button" onClick={handleClick}>
                        Go to Checkout &rarr;
                    </button>
                </div>
            </Modali.Modal>
        </div>
    )
}

// PriceTable.whyDidYouRender = true

export default withRouter(PriceTable)
