import React, { useEffect, useState } from 'react'
import { getParameterByName } from '../../utils/helpers'
import './Unsubscribe.scss'

const Unsubscribe = () => {
    const [submitted, setSubmitted] = useState(false)
    const email = getParameterByName('email')
    const form = document.getElementById('unsubscribe')

    const submitForm = () => {
        form.submit()
    }

    useEffect(() => {
        if (email.length) {
            submitForm()
            setSubmitted(true)
        }
        return () => {
            setSubmitted(false)
        }
    }, [email])

    return (
        <div className="unsubscribe">
            <h1>Unsubscribe</h1>
            <form name="unsubscribe">
                <input
                    type="hidden"
                    name="email"
                    id="unsubscribe"
                    value={email}
                />
            </form>
            {submitted ? (
                <div className="unsubscibe-success">
                    <h3>You're unsubscribed.</h3>
                    <p>It's ok, we still love you.</p>
                </div>
            ) : (
                <div className="unsubscibe-progress">
                    <h3>Unsubscribing...</h3>
                </div>
            )}
        </div>
    )
}

export default Unsubscribe
