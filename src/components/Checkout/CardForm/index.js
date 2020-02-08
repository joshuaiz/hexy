import React, { useState, Fragment } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import Login from '../../Login'
import { getDateString } from '../../../utils/helpers'
import { ReactComponent as StripeBadge } from '../../../images/stripe_badge.svg'

const CardForm = ({
    cart,
    setCart,
    stripe,
    status,
    setStatus,
    currentCoupon,
    setCurrentCoupon,
    couponError,
    setProfileUpdated,
    currentUser
}) => {
    const { user } = useAuthState(firebase.auth())
    const [cardError, setCardError] = useState('')

    let total = parseInt(cart.price) * 100

    // console.log(cart)

    const submitFree = e => {
        e.preventDefault()

        if (cart.total === 0.0 || cart.total === '0.00') {
            if (cart.accountType.length && cart.accountType !== 'standard') {
                // console.log('submitFree accountType')
                updateAccount()
                setStatus('completeFree')
                setCart()
                localStorage.removeItem('hexy_cart')
                if (currentCoupon && !couponError) {
                    let couponRef = db
                        .collection('coupons')
                        .doc(currentCoupon.code)

                    // Set the coupon to used
                    couponRef.update({ used: true })
                    setCurrentCoupon(null)
                }
            } else {
                setStatus('error')
                console.log('Account could not be created.')
            }
        } else {
            console.log('something went wrong')
        }
    }

    const submit = async e => {
        e.preventDefault()

        setStatus('submitting')

        let response

        try {
            let { token } = await stripe.createToken({
                name: (currentUser && currentUser.displayName) || 'Name'
            })

            response = await fetch('/.netlify/functions/charge', {
                // crossDomain: true,
                method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    token: token.id,
                    desc: cart.accountType,
                    email: currentUser && currentUser.email
                })
            })

            if (response.ok) {
                updateAccount()
                setStatus('complete')
                setCart()
                localStorage.removeItem('hexy_cart')
                if (currentCoupon && !couponError) {
                    let couponRef = db
                        .collection('coupons')
                        .doc(currentCoupon.code)

                    // Set the coupon to used
                    couponRef.update({ used: true })
                    setCurrentCoupon(null)
                }
            } else {
                throw new Error('Network response was not ok.')
            }
        } catch (err) {
            console.log('response', response)
            console.log('error', err)
            setCardError(response)
            setStatus('error')
        }
    }

    const updateAccount = () => {
        let date = new Date()
        date = getDateString(date)

        db.collection('users')
            .doc(user.uid)
            .update({
                accountType: cart.accountType,
                accountStartDate: date
            })
            .then(() => {})

            .catch(err => {
                console.log('Error updating account:', err)
            })
    }

    return (
        <div className="page-checkout">
            <h2>Complete Your Purchase</h2>
            {!user ? (
                <Fragment>
                    <p>Please Log In or Sign Up:</p>
                    <Login setProfileUpdated={setProfileUpdated} />
                </Fragment>
            ) : (
                <div className="checkout-form-wrap">
                    {cart && cart.total === '0.00' ? (
                        <form
                            className="checkout-form checkout-form-free"
                            onSubmit={submitFree}
                        >
                            <div className="checkout-form-inner">
                                <button
                                    className="CheckoutForm-button button"
                                    type="submit"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting'
                                        ? 'Submitting'
                                        : 'Submit Order'}
                                </button>
                                {status === 'error' && (
                                    <div className="CheckoutForm-error">
                                        <p>Something went wrong.</p>
                                    </div>
                                )}
                            </div>
                        </form>
                    ) : (
                        <Fragment>
                            <form className="checkout-form" onSubmit={submit}>
                                <div className="checkout-form-inner">
                                    <CardElement />
                                    <button
                                        className="CheckoutForm-button button"
                                        type="submit"
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting'
                                            ? 'Submitting'
                                            : 'Submit Order'}
                                    </button>
                                    {status === 'error' && (
                                        <div className="CheckoutForm-error">
                                            <p>Something went wrong.</p>
                                        </div>
                                    )}
                                </div>
                            </form>
                            <StripeBadge />
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    )
}

export default injectStripe(CardForm)
