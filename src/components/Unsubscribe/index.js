import React, { useState } from 'react'
import { getParameterByName } from '../../utils/helpers'
import './Unsubscribe.scss'

const Unsubscribe = () => {
    const [submitted, setSubmitted] = useState(false)
    const email = getParameterByName('email')

    console.log('unsubscribe', email)

    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
    }

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
                        value={email}
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
