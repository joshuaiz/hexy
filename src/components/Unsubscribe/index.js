import React, { useState, useEffect } from 'react'
import { getParameterByName } from '../../utils/helpers'
import './Unsubscribe.scss'

const Unsubscribe = () => {
    const [submitted, setSubmitted] = useState(false)
    const [emailAddress, setEmailAddress] = useState('')
    const email = getParameterByName('email')

    // console.log('unsubscribe', email)

    const handleSubmit = e => {
        e.preventDefault()

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encode({ 'form-name': 'unsubscribe', emailAddress })
        })
            .then(setSubmitted(true))
            .catch(error => alert(error))
    }

    const encode = data => {
        return Object.keys(data)
            .map(
                key =>
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(data[key])
            )
            .join('&')
    }

    useEffect(() => {
        setEmailAddress(email)
    }, [email])

    return (
        <div className="unsubscribe">
            <h1>Unsubscribe from Hexy emails</h1>

            {submitted ? (
                <div className="unsubscibe-success">
                    <h3>{email} has been unsubscribed.</h3>
                    <p>It's ok, we still love you.</p>
                </div>
            ) : (
                <form
                    name="unsubscribe"
                    id="unsubscribe"
                    onSubmit={handleSubmit}
                    method="post"
                >
                    <input type="hidden" name="form-name" value="unsubscribe" />
                    <input
                        className="email-input"
                        type="email"
                        name="email"
                        value={emailAddress && emailAddress}
                        // defaultValue={emailAddress}
                        onChange={e => e.target.value}
                    />
                    <button className="button" type="submit">
                        Unsubscribe Me
                    </button>
                </form>
            )}
        </div>
    )
}

export default Unsubscribe
