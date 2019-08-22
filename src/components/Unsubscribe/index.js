import React, { useState } from 'react'
import { getParameterByName } from '../../utils/helpers'
import './Unsubscribe.scss'

const Unsubscribe = () => {
    const [submitted, setSubmitted] = useState(false)
    const email = getParameterByName('email')

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
                    <input name="email" value={email} />
                    <input type="hidden" name="form-name" value="unsubscribe" />
                    <input
                        className="button"
                        type="submit"
                        value="Unsubscribe Me"
                    />
                </form>
            )}
        </div>
    )
}

export default Unsubscribe
