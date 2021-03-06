import React from 'react'
import ScrollToTop from '../ScrollToTop'
import './Contact.scss'

const Contact = () => {
    return (
        <div className="page-contact">
            <ScrollToTop />
            <div className="contact-form">
                <h1 className="page-title">Contact Us</h1>
                <h3>
                    Have a question, comment, or having issues using Hexy? We'd
                    love to hear from you.
                </h3>
                <div className="form-inner">
                    <form
                        name="contact"
                        method="post"
                        action="/contact/success"
                    >
                        <input type="hidden" name="form-name" value="contact" />
                        <div className="form-field">
                            <label>
                                <span className="input-label">Your Name:</span>{' '}
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="First Last"
                                />
                            </label>
                        </div>

                        <div className="form-field">
                            <label>
                                <span className="input-label">Your Email:</span>{' '}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@youremail.com"
                                />
                            </label>
                        </div>

                        <div className="form-field">
                            <label>
                                <span className="input-label">Subject:</span>{' '}
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Message Subject"
                                />
                            </label>
                        </div>

                        <div className="form-field">
                            <label>
                                <span className="input-label">Message:</span>{' '}
                                <textarea name="message" />
                            </label>
                        </div>
                        <div data-netlify-recaptcha="true" />
                        <input
                            className="button"
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
