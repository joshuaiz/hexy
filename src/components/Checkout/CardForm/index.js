import React, { Fragment } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import Login from '../../Login'
import { getDateString } from '../../../utils/helpers'
import { ReactComponent as StripeBadge } from '../../../images/stripe_badge.svg'

const CardForm = ({ cart, setCart, stripe, status, setStatus }) => {
    const { user } = useAuthState(firebase.auth())
    let total = parseInt(cart.price) * 100

    // console.log(total)

    const submit = async e => {
        e.preventDefault()

        setStatus('submitting')

        let response

        try {
            let { token } = await stripe.createToken({ name: 'Name' })

            response = await fetch('/.netlify/functions/charge', {
                // crossDomain: true,
                method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    token: token.id
                })
            })

            if (response.ok) {
                updateAccount()
                setStatus('complete')
                setCart()
                localStorage.removeItem('hexy_cart')
            } else {
                throw new Error('Network response was not ok.')
            }
        } catch (err) {
            console.log('response', response)
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
                    <Login />
                </Fragment>
            ) : (
                <div className="checkout-form-wrap">
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
                                    Something went wrong.
                                </div>
                            )}
                        </div>
                    </form>
                    <StripeBadge />
                </div>
            )}
        </div>
    )
}

export default injectStripe(CardForm)
