import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import { Dialog } from '@reach/dialog'
import Component from '@reach/component-component'
import { humanize } from '../../utils/helpers'

const PriceModal = React.memo(function PriceModal({
    cart,
    addToCart,
    accountType,
    price
}) {
    const { user } = useAuthState(firebase.auth())
    const [currentUser, setCurrentUser] = useState()
    const [disabled, setDisabled] = useState(false)
    // console.log('PriceModal', cart)

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

    useEffect(() => {
        if (currentUser && accountType) {
            if (currentUser.accountType === accountType) {
                setDisabled(true)
            }
        }
    }, [currentUser, accountType])

    return (
        
                <div>
                    <button
                        className={`button ${disabled ? `disabled` : null}`}
                        disabled={disabled}
                        onClick={() => {
                            addToCart(accountType, price)
                            setState({ showDialog: true })
                        }}
                    >
                        {disabled
                            ? 'Current Account'
                            : `Get ${humanize(accountType)}!`}
                    </button>
                   
                        <div className="modal-content">
                            <h3>
                                Hexy {humanize(accountType)} added to your cart!
                            </h3>
                            <p>
                                Go to{' '}
                                <Link to="/checkout">Checkout &rarr;</Link>.
                            </p>
                        </div>
                    
                </div>
            )}
        </Component>
    )
})

// PriceModal.whyDidYouRender = true

export default PriceModal
