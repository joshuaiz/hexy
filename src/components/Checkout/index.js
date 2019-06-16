import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
    StripeProvider,
    CardElement,
    injectStripe,
    Elements,
    stripe
} from 'react-stripe-elements'
import axios from 'axios'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { humanize } from '../../utils/helpers'
import CardForm from './CardForm'
import './Checkout.scss'

const Checkout = ({ cart, setCart }) => {
    const { initialising, user } = useAuthState(firebase.auth())
    const [status, setStatus] = useState('default')

    // console.log('Checkout', cart)

    const handleClearCart = () => {
        setCart()
        localStorage.removeItem('hexy_cart')
    }

    let desc

    if (
        (cart && cart.accountType === 'pro') ||
        (cart && cart.accountType === 'pro_unlimited')
    ) {
        desc = <div>(includes 1 year of Hexy Pro features & support)</div>
    } else if (cart && cart.accountType === 'pro_lifetime') {
        desc = <div>(one-time payment/lifetime Hexy Pro access)</div>
    } else {
        return null
    }

    // console.log('status', status)

    // if (status === 'complete') {
    //     return <div className="CheckoutForm-complete">Payment successful!</div>
    // }

    return (
        <StripeProvider apiKey="pk_test_Q8j9ieOEWFZAnuSox9yqNyrG">
            <div className="checkout">
                <h1>Checkout</h1>

                {cart && status !== 'complete' ? (
                    <Fragment>
                        <div className="cart-table">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Item</td>
                                        <td>Price</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="table-main">
                                        <td>
                                            {cart ? (
                                                <span>
                                                    Hexy Account:{' '}
                                                    <strong>
                                                        {humanize(
                                                            cart.accountType
                                                        )}
                                                    </strong>
                                                </span>
                                            ) : null}
                                            {cart && desc}
                                        </td>
                                        <td>
                                            {cart && cart.price ? (
                                                <span>${cart.price}</span>
                                            ) : null}
                                        </td>
                                    </tr>
                                    <tr className="table-total">
                                        <td>
                                            {cart && cart.price ? (
                                                <strong>Total: </strong>
                                            ) : null}
                                        </td>
                                        <td>
                                            <span className="total-price">
                                                {cart && cart.price ? (
                                                    <span>${cart.price}</span>
                                                ) : null}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                className="clear-cart button"
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                        <Elements>
                            <CardForm
                                cart={cart}
                                setCart={setCart}
                                stripe={stripe}
                                status={status}
                                setStatus={setStatus}
                            />
                        </Elements>
                    </Fragment>
                ) : (
                    <div className="cart-empty">
                        <h3>Your cart is empty.</h3>
                        <p>
                            See our Hexy Pro{' '}
                            <Link to="/pro">plans & pricing</Link>.
                        </p>
                    </div>
                )}
                {status === 'complete' ? (
                    <div className="CheckoutForm-complete">
                        Payment successful!
                    </div>
                ) : null}
            </div>
        </StripeProvider>
    )
}

export default Checkout
